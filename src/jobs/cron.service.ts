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
  async deleteInterviewsOlderThan10BusinessDays(): Promise<void> {
    const interviews: HrInterviewEntity[] = await HrInterviewEntity.find({
      relations: ['student'],
    });
    if (interviews.length > 0) {
      for (const { id, studentId } of this.filter(10, interviews)) {
        const { affected } = await HrInterviewEntity.delete(id);
        if (affected) {
          const student = await StudentInfoEntity.findOne({
            where: { studentInfoId: studentId },
          });
          student.studentStatus = StudentStatus.AVAILABLE;
          await student.save();
        }
      }
    }
  }

  private filter(
    days: number,
    interviews: HrInterviewEntity[],
  ): InterviewToBeDeletedInterface[] {
    return interviews
      .map((item) => ({
        id: item.id,
        studentId: item.student.studentInfo.studentInfoId,
        createdAt: item.createdAt.toLocaleDateString(),
      }))
      .filter(
        (item) =>
          businessDaysFilter()(item.createdAt, 'DD/MM/YYYY').businessDiff(
            businessDaysFilter()(new Date().toLocaleDateString(), 'DD/MM/YYYY'),
          ) >= days,
      );
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async removeOlderThan10days() {
    console.log('today', new Date().toLocaleDateString());
    console.log(
      '10 business days back',
      businessDaysFilter()(new Date().toLocaleDateString(), 'DD_MM_YYYY')
        .businessSubtract(10)
        .toDate()
        .toLocaleDateString(),
    );

    const tenBusinessDaysBack = businessDaysFilter()(
      new Date().toLocaleDateString(),
      'DD_MM_YYYY',
    )
      .businessSubtract(10)
      .toDate();

    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(HrInterviewEntity)
      .where('createdAt > :tenBusinessDaysBack', { tenBusinessDaysBack })
      .execute();
  }
}
