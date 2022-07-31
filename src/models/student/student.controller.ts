import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentFormProfileDto } from './dto/student-form-profile.dto';
import { StudentEmploymentStatus } from '../../common/decorators/student-employment-status.decorator';
import { StudentStatus } from 'types';
import { StudentEmploymentVerificationGuard } from '../../common/guards/student-employment-verification.guard';
import { JwtAccessGuard } from 'src/common/guards';

@Controller('student')
@UseGuards(StudentEmploymentVerificationGuard, JwtAccessGuard)
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
