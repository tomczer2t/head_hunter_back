import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentFormProfileDto } from './dto/student-form-profile.dto';
import { UserEntity } from '../user/entities';
import { StudentUpdateProfileResponse } from '../../../types/student/student-update-profile-response';
import {
  UserRole,
  ListAvailableResponse,
  SingleStudentProfile,
} from '../../../types';
import { GetUser, SetAccessRole } from '../../common/decorators';
import { StudentsQueryDto } from './dto/students-query.dto';

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
  ): Promise<StudentUpdateProfileResponse> {
    return this.studentService.updateStudent(studentFormProfileDto, user);
  }

  @SetAccessRole(UserRole.HR)
  @Get('/')
  listAvailable(
    @Query() queryDto: StudentsQueryDto,
  ): Promise<ListAvailableResponse> {
    return this.studentService.listAvailable(queryDto);
  }

  @SetAccessRole(UserRole.HR)
  @Get('/:userStudentId')
  showOneStudentFromHrList(
    @Param('userStudentId', ParseUUIDPipe)
    userStudentId: string,
  ): Promise<SingleStudentProfile> {
    return this.studentService.showOneStudentFromHrList(userStudentId);
  }
}
