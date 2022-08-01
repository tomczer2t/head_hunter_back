import { Body, Controller, Inject, Patch, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentFormProfileDto } from './dto/student-form-profile.dto';
import { GetUser, StudentEmploymentStatus } from '../../common';
import { StudentStatus } from 'types';
import { StudentEmploymentStatusVerificationGuard } from '../../common/guards';
import { JwtAccessGuard } from 'src/common/guards';
import { UserEntity } from '../user/entities';

@Controller('/student')
@UseGuards(JwtAccessGuard)
export class StudentController {
  constructor(
    @Inject(StudentService) private readonly studentService: StudentService,
  ) {}

  @UseGuards(StudentEmploymentStatusVerificationGuard)
  @StudentEmploymentStatus(StudentStatus.BUSY, StudentStatus.AVAILABLE)
  @Patch('/')
  updateStudentInfo(
    @Body() studentFormProfileDto: StudentFormProfileDto,
    @GetUser() user: UserEntity,
  ) {
    return this.studentService.updateStudent(studentFormProfileDto, user);
  }
}
