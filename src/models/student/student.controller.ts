import { Body, Controller, Post } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentFormProfileDto } from './dto/student-form-profile.dto';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('url-registration')
  urlRegistration(@Body() studentFormProfileDto: StudentFormProfileDto) {
    this.studentService.urlRegistration(studentFormProfileDto);
  }
}
