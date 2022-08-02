import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { RegisterResponse } from '../../../types';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/')
  register(
    @Body() registrationDto: UserRegistrationDto,
  ): Promise<RegisterResponse> {
    return this.userService.register(registrationDto);
  }
}
