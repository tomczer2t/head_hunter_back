import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  @Post('login')
  login(@Body() dto: AuthDto) {
    console.log(dto);
  }

  @Post('logout')
  logout() {
    console.log('logout');
  }
}
