import { Body, Controller, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentUrlRegistrationDto } from './dto/student-url-registration.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('url-registration')
  urlRegistration(
    @Body() studentUrlRegistrationDto: StudentUrlRegistrationDto,
  ) {
    this.studentService.urlRegistration(studentUrlRegistrationDto);
  }
}
