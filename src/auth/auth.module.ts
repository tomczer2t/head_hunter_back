import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import {
  JwtAccessStrategy,
  jwtConfiguration,
  JwtRefreshStrategy,
} from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../models/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [jwtConfiguration] }),
    JwtModule.register({}),
    UserModule,
  ],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
