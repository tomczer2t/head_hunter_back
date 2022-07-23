import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserUrlRegistrationDto } from './dto/student-url-registration.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('url-registration')
  urlRegistration(@Body() userUrlRegistrationDto: UserUrlRegistrationDto) {
    this.userService.urlRegistration(userUrlRegistrationDto);
  }
}
