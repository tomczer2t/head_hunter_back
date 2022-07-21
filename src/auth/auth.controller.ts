import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { LoginDto } from './dto';

@Controller('/auth')
export class AuthController {
  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    console.log(loginDto);
  }

  @Get('/logout')
  logout() {
    console.log('logout');
  }

  @Patch('/refresh')
  refreshTokens() {
    return 'refresh';
  }
}
