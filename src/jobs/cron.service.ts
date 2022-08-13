import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HrInterviewEntity } from '../models/hr/entities/hr-interview.entity';
import { businessDaysFilter } from '../common/utils/business-days-filter';
import { InterviewToBeDeletedInterface } from './interface/interview-to-be-deleted.interface';
import { StudentInfoEntity } from '../models/student/entities';
import { StudentStatus } from 'types';
import { DataSource } from 'typeorm';

@Injectable()
export class CronService {
  constructor(private dataSource: DataSource) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async removeInterviewsOlderThan10BusinessDays() {
    const tenBusinessDaysBack = businessDaysFilter()(
      new Date().toLocaleDateString(),
      'DD/MM/YYYY',
    )
      .businessSubtract(10)
      .toDate();

    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(HrInterviewEntity)
      .where('createdAt < :tenBusinessDaysBack', { tenBusinessDaysBack })
      .execute();
  }
}
