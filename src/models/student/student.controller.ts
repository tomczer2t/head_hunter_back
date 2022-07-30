import { Body, Controller, Inject, Patch, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentFormProfileDto } from './dto/student-form-profile.dto';
import { GetUser } from '../../common';
import { UserEntity } from '../user/entities';
import { JwtAccessGuard } from 'src/common/guards';

@Controller('student')
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
    this.studentService.updateStudent(studentFormProfileDto, user);
  }
}
