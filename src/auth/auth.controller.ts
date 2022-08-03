import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtRefreshGuard } from '../common/guards';
import { LoginResponse, LogoutResponse } from '../../types';
import { UserEntity } from '../models/user/entities';
import { GetUser, UsePublic } from '../common/decorators';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePublic()
  @Post('/login')
  login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ): Promise<LoginResponse> {
    return this.authService.login(res, loginDto);
  }

  @Get('/logout')
  logout(
    @Res({ passthrough: true }) res: Response,
    @GetUser() user: UserEntity,
  ): Promise<LogoutResponse> {
    return this.authService.logout(res, user);
  }

  @UsePublic()
  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  refreshTokens(@GetUser('id') id: string) {
    return this.authService.getNewTokens({ userId: id });
  }
}
