import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtPayloadDecoded } from '../../../types';
import { UserEntity } from '../../models/user/entities';
import { compare } from 'bcrypt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const refreshToken = req?.cookies['jwt-refresh-token'];
          return refreshToken ? refreshToken : null;
        },
      ]),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: configService.get('jwt.refreshTokenSecret'),
    });
  }

  async validate(req: Request, payload: JwtPayloadDecoded) {
    const refreshToken = req?.cookies?.['jwt-refresh-token'];
    const user = await UserEntity.findOne({
      where: { id: payload.userId },
      relations: ['studentInfo', 'hrInfo'],
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const refreshTokenMatch = compare(refreshToken, user.refreshTokenHash);
    if (!refreshTokenMatch) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
