import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    console.log(LoginDto);
  }

  @Post('logout')
  logout() {
    console.log('logout');
  }
}
