import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtRefreshGuard } from '../common/guards';
import { LoginResponse } from '../../types';
import { GetUser, UsePublic } from '../common';
import { UserEntity } from '../models/user/entities';

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
  logout(@GetUser() user: UserEntity) {
    return user;
  }

  @UsePublic()
  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  refreshTokens(@GetUser('id') id: string) {
    return this.authService.getNewTokens({ userId: id });
  }
}
