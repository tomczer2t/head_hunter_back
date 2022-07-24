import { Injectable } from '@nestjs/common';
import { StudentUrlRegistrationDto } from './dto/student-url-registration.dto';

@Injectable()
export class StudentService {
  urlRegistration(studentUrlRegistrationDto: StudentUrlRegistrationDto) {
    console.log('studentUrlRegistrationDto', studentUrlRegistrationDto);
  }
}
