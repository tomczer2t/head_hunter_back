import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  JwtPayload,
  LoginResponse,
  Tokens,
  LogoutResponse,
  RefreshResponse,
  StudentStatus,
} from '../../types';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto';
import { Response } from 'express';
import { UserService } from '../models/user/user.service';
import { UserEntity } from '../models/user/entities';
import { compare, hash } from 'bcrypt';
import { StudentController } from '../models/student/student.controller';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  filter(user: UserEntity) {
    const { role, studentInfo, hrInfo, accountStatus } = user;
    let firstName: string;
    let lastName: string;
    let githubUsername: string;
    if (studentInfo) {
      firstName = studentInfo.firstName;
      lastName = studentInfo.lastName;
      githubUsername = studentInfo.githubUsername;
    }
    if (hrInfo) {
      firstName = hrInfo.firstName;
      lastName = hrInfo.lastName;
    }
    return { role, firstName, lastName, accountStatus, githubUsername };
  }

  async login(res: Response, loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.userService.getUserByEmailWithRelations(
      loginDto.email,
    );
    if (!user) {
      throw new BadRequestException('Wrong email or password');
    }
    if (user.studentInfo.studentStatus === StudentStatus.HIRED) {
      throw new ForbiddenException('Student is hired');
    }
    const pwdMatch = await compare(loginDto.password, user?.passwordHash);
    if (!pwdMatch) {
      throw new BadRequestException('Wrong email or password');
    }

    const { accessToken, refreshToken } = await this.getNewTokens({
      userId: user.id,
    });

    user.refreshTokenHash = await hash(refreshToken, 10);
    await user.save();

    this.setRefreshCookie(res, refreshToken);
    return { ...this.filter(user), accessToken };
  }

  async getNewTokens(payload: JwtPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(payload, {
        secret: this.configService.get('jwt.accessTokenSecret'),
        expiresIn: '15min',
      }),
      this.jwtService.sign(payload, {
        secret: this.configService.get('jwt.refreshTokenSecret'),
        expiresIn: '7d',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async logout(res: Response, user: UserEntity): Promise<LogoutResponse> {
    user.refreshTokenHash = null;
    await user.save();

    res.clearCookie('jwt-refresh-token', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });

    return { isSuccess: true };
  }

  async refresh(res: Response, user: UserEntity): Promise<RefreshResponse> {
    const { accessToken, refreshToken } = await this.getNewTokens({
      userId: user.id,
    });
    user.refreshTokenHash = await hash(refreshToken, 10);
    await user.save();

    this.setRefreshCookie(res, refreshToken);
    return { ...this.filter(user), accessToken };
  }

  setRefreshCookie = (res: Response, refreshToken) => {
    res.cookie('jwt-refresh-token', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  };
}
