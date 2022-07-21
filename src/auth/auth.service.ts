import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, Tokens } from '../../types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

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
