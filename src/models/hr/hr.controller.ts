import { Controller, Get, Post } from '@nestjs/common';
import { HrInterviewEntity } from './entities/hr-interview.entity';
import { HrService } from './hr.service';
import { HrInfoEntity } from './entities';
import { UserEntity } from '../user/entities';

@Controller('hr')
export class HrController {
  constructor(private hrService: HrService) {}

  @Post('url-registration')
  urlRegistration() {
    this.hrService.urlRegistration();
  }

  @Get()
  async allInterviewsFromOneHr() {
    const hrId = '';

    return await HrInterviewEntity.find({
      relations: ['studentInfoId'], // jak dodamy tutaj hrInfoId to fetchuje rowniez hr entity -
      where: { hrInfoId: hrId },
    });
  }
}
