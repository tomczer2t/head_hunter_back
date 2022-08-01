import { Body, Controller, Inject,Get, Post, Patch, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentFormProfileDto } from './dto/student-form-profile.dto';
import { StudentEmploymentStatus } from '../../common';
import { StudentStatus } from 'types';
import { StudentEmploymentStatusVerificationGuard } from '../../common/guards';
import { JwtAccessGuard } from 'src/common/guards';
import { GetUser } from '../../common';
import { UserEntity } from '../user/entities';

@Controller('student')
@UseGuards(JwtAccessGuard, StudentEmploymentStatusVerificationGuard)
export class StudentController {
  constructor(
    @Inject(StudentService) private readonly studentService: StudentService,
  ) {}

  @UseGuards(JwtAccessGuard)
  @Patch()
  updateStudentInfo(
    @Body() studentFormProfileDto: StudentFormProfileDto,
    @GetUser() user: UserEntity,
  ) {
    return this.studentService.updateStudent(studentFormProfileDto, user);
  }

  @Get('/')
  @StudentEmploymentStatus(StudentStatus.BUSY, StudentStatus.AVAILABLE)
  test() {
    return 'you should not see this';
  }
}
