import { Injectable } from '@nestjs/common';
import { StudentFormProfileDto } from './dto/student-form-profile.dto';

@Injectable()
export class StudentService {
  urlRegistration(studentFormProfileDto: StudentFormProfileDto) {
    console.log('studentUrlRegistrationDto', studentFormProfileDto);
  }
}
