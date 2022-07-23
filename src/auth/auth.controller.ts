import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { JwtAccessGuard, JwtRefreshGuard } from '../common/guards';
import { LoginResponse } from '../../types';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginDto: LoginDto,
  ): Promise<LoginResponse> {
    return this.authService.login(res, loginDto);
  }

  @UseGuards(JwtAccessGuard)
  @Get('/logout')
  logout(@Req() req: Request) {
    const userId = (req.user as { userId: string }).userId;
    return { userId };
  }

  @UseGuards(JwtRefreshGuard)
  @Get('/refresh')
  refreshTokens() {
    return this.authService.getNewTokens({ userId: '13' });
  }
}
