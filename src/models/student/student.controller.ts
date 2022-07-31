import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentFormProfileDto } from './dto/student-form-profile.dto';
import { StudentEmploymentStatus } from '../../common';
import { StudentStatus } from 'types';
import { StudentEmploymentStatusVerificationGuard } from '../../common/guards';
import { JwtAccessGuard } from 'src/common/guards';

@Controller('student')
@UseGuards(JwtAccessGuard, StudentEmploymentStatusVerificationGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post('url-registration')
  urlRegistration(@Body() studentFormProfileDto: StudentFormProfileDto) {
    this.studentService.urlRegistration(studentFormProfileDto);
  }

  @Get('/')
  @StudentEmploymentStatus(StudentStatus.BUSY, StudentStatus.AVAILABLE)
  test() {
    return 'you should not see this';
  }
}
