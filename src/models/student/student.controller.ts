import { Body, Controller, Get, Inject, Patch } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentFormProfileDto } from './dto/student-form-profile.dto';
import { UserEntity } from '../user/entities';
import { UserRole, ListAvailableResponse } from '../../../types';
import { GetUser, SetAccessRole } from '../../common/decorators';

@SetAccessRole(UserRole.STUDENT)
@Controller('/student')
export class StudentController {
  constructor(
    @Inject(StudentService) private readonly studentService: StudentService,
  ) {}

  @Patch('/')
  updateStudent(
    @Body() studentFormProfileDto: StudentFormProfileDto,
    @GetUser() user: UserEntity,
  ) {
    return this.studentService.updateStudent(studentFormProfileDto, user);
  }

  @SetAccessRole(UserRole.HR)
  @Get('/')
  listAvailable(): Promise<ListAvailableResponse> {
    return this.studentService.listAvailable();
  }
}
