import { Injectable } from '@nestjs/common';
import { UserUrlRegistrationDto } from './dto/student-url-registration.dto';

@Injectable()
export class UserService {
  urlRegistration(userUrlRegistrationDto: UserUrlRegistrationDto) {
    console.log('studentUrlRegistrationDto', userUrlRegistrationDto);
  }
}
