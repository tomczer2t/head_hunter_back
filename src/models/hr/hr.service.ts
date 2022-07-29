import { Injectable } from '@nestjs/common';
import { HrInterviewEntity } from './entities/hr-interview.entity';

@Injectable()
export class HrService {
  urlRegistration() {
    console.log('hrUrlRegistration test');
  }

  async allInterviewsFromOneHr(hrId: string): Promise<HrInterviewEntity[]> {
    return await HrInterviewEntity.find({
      relations: ['studentInfoId'],
      where: { hrInfoId: hrId },
    });
  }
}
