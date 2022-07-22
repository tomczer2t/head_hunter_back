import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { JwtAccessGuard, JwtRefreshGuard } from '../common/guards';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.getNewTokens({ userId: '13' });
  }

  @UseGuards(JwtAccessGuard)
  @Get('/logout')
  logout(@Req() req: Request) {
    const userId = (req.user as { userId: string }).userId;
    return { userId };
  }

  @UseGuards(JwtRefreshGuard)
  @Patch('/refresh')
  refreshTokens() {
    return this.authService.getNewTokens({ userId: '13' });
  }
}
