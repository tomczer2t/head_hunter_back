import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, LoginResponse, Tokens } from '../../types';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto';
import { Response } from 'express';
import { UserService } from '../models/user/user.service';
import { UserEntity } from '../models/user/entities';
import { compare } from 'bcrypt';

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
    if (studentInfo) {
      firstName = studentInfo.firstName;
      lastName = studentInfo.lastName;
    }
    if (hrInfo) {
      firstName = hrInfo.firstName;
      lastName = hrInfo.lastName;
    }
    return { role, firstName, lastName, accountStatus };
  }

  async login(res: Response, loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.userService.getUserByEmailWithRelations(
      loginDto.email,
    );
    if (!user) {
      throw new BadRequestException('Wrong email or password');
    }
    const pwdMatch = await compare(loginDto.password, user?.passwordHash);
    if (!pwdMatch) {
      throw new BadRequestException('Wrong email or password');
    }

    const { accessToken, refreshToken } = await this.getNewTokens({
      userId: user.id,
    });

    res.cookie('jwt-refresh-token', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
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
}
