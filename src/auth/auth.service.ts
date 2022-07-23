import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, LoginResponse, Tokens, UserRole } from '../../types';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto';
import { Response } from 'express';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(res: Response, loginDto: LoginDto): Promise<LoginResponse> {
    const userExample = {
      id: '12321321',
      firstName: 'Jacek',
      lastName: 'Kowalski',
      role: UserRole.STUDENT,
      githubUsername: null,
    };

    const { accessToken, refreshToken } = await this.getNewTokens({
      userId: userExample.id,
    });

    res.cookie('jwt-refresh-token', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return { ...userExample, accessToken };
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
