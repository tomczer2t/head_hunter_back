import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegistrationDto } from './dto/user-registration.dto';
import { RegisterResponse } from '../../../types';
import { UsePublic } from '../../common/decorators';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @UsePublic()
  @Post('/')
  register(
    @Body() registrationDto: UserRegistrationDto,
  ): Promise<RegisterResponse> {
    return this.userService.register(registrationDto);
  }
}
