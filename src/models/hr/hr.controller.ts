import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { HrService } from './hr.service';
import { GetUser, SetAccessRole } from '../../common/decorators';
import { UserRole } from '../../../types';
import { UserEntity } from '../user/entities';
import { AddStudentToInterviewDto } from './dto/add-student-to-interview.dto';

@SetAccessRole(UserRole.HR)
@Controller('/hr')
export class HrController {
  constructor(@Inject(HrService) private hrService: HrService) {}

  @Get('/students')
  async allInterviewsFromOneHr() {
    const hrId = 'user-hr1'; // for testing purposes
    return this.hrService.allInterviewsFromOneHr(hrId);
  }

  @Post('/student')
  addStudentToInterview(
    @GetUser() hr: UserEntity,
    @Body() { githubUsername }: AddStudentToInterviewDto,
  ) {
    return this.hrService.addStudentToInterview(githubUsername, hr);
  }
}
