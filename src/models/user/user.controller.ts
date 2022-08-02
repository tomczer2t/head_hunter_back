import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegistrationDto } from './dto/user-registration.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/') //@todo dodać typ odpowiedzi
  register(@Body() registrationDto: UserRegistrationDto) {
    return this.userService.register(registrationDto);
  }
}
