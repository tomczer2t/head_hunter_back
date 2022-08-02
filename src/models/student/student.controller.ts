import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentFormProfileDto } from './dto/student-form-profile.dto';
import { GetUser } from '../../common/decorators';
import { UserEntity } from '../user/entities';
import { UserRole } from '../../../types';
import { GetUser, SetAccessRole } from '../../common/decorators';

@SetAccessRole(UserRole.STUDENT)
@Controller('/student')
export class StudentController {
  constructor(
    @Inject(StudentService) private readonly studentService: StudentService,
  ) {}

  @Patch('/')
  updateStudentInfo(
    @Body() studentFormProfileDto: StudentFormProfileDto,
    @GetUser() user: UserEntity,
  ) {
    return this.studentService.updateStudent(studentFormProfileDto, user);
  }

  @Get('/')
  listAvailable() {
    return this.studentService.listAvailable();
  }
}
