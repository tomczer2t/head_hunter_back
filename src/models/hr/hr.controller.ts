import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { HrService } from './hr.service';
import { GetUser } from '../../common';
import { UserEntity } from '../user/entities';
import { JwtAccessGuard } from '../../common/guards';
import { AddStudentToInterviewDto } from './dto/add-student-to-interview.dto';

@UseGuards(JwtAccessGuard)
@Controller('/hr')
export class HrController {
  constructor(@Inject(HrService) private hrService: HrService) {}

  @Get('/students')
  async allInterviewsFromOneHr() {
    const hrId = 'user-hr1'; // for testing purposes
    return this.hrService.allInterviewsFromOneHr(hrId);
  }

  @Post('/')
  addStudentToInterview(
    @GetUser() hr: UserEntity,
    @Body() { githubUsername }: AddStudentToInterviewDto,
  ) {
    return this.hrService.addStudentToInterview(githubUsername, hr);
  }
}
