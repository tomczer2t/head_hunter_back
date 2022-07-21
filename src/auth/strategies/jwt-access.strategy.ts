import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadDecoded } from '../../../types';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('jwt.accessTokenSecret'),
    });
  }

  async validate(payload: JwtPayloadDecoded) {
    const expTimeStamp = payload.exp * 1000;
    if (expTimeStamp < Date.now()) {
      throw new ForbiddenException('Access token expired.');
    }
    return payload;
  }
}
