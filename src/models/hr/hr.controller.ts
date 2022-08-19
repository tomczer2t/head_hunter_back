import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { HrService } from './hr.service';
import { GetUser, SetAccessRole } from '../../common/decorators';
import { ListAvailableResponse, UserRole } from '../../../types';
import { UserEntity } from '../user/entities';
import { StudentOnInterviewDto } from './dto/student-on-interview.dto';
import { HrFormProfileDto } from './dto/hr-form-profile.dto';
import { StudentsQueryDto } from '../student/dto/students-query.dto';

@SetAccessRole(UserRole.HR)
@Controller('/hr')
export class HrController {
  constructor(@Inject(HrService) private hrService: HrService) {}

  @Get('/students/interview')
  async allInterviewsFromOneHr(@GetUser() { id: hrId }: UserEntity) {
    return this.hrService.allInterviewsFromOneHr(hrId);
  }

  @Post('/student')
  addStudentToInterview(
    @GetUser() hr: UserEntity,
    @Body() { userId }: StudentOnInterviewDto,
  ) {
    return this.hrService.addStudentToInterview(userId, hr);
  }
  @Delete('/student/:studentId')
  deleteStudentFromInterview(
    @GetUser() hr: UserEntity,
    @Param('studentId') studentId: string,
  ) {
    return this.hrService.deleteStudentFromInterview(studentId, hr);
  }

  @Patch('/hire-student/:studentId')
  hireStudent(
    @GetUser() hr: UserEntity,
    @Param('studentId') studentId: string,
  ) {
    return this.hrService.hireStudent(hr, studentId);
  }

  @Patch('/')
  updateHrInfo(
    @Body() hrFormProfileDto: HrFormProfileDto,
    @GetUser() { hrInfo }: UserEntity,
  ) {
    return this.hrService.updateHrInfo(hrFormProfileDto, hrInfo);
  }

  @Get('/students/available')
  listAvailableStudents(
    @Query() queryDto: StudentsQueryDto,
  ): Promise<ListAvailableResponse> {
    return this.hrService.listAvailableStudents(queryDto);
  }
}
