import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HrInterviewEntity } from '../models/hr/entities/hr-interview.entity';
import { businessDaysFilter } from '../common/utils/business-days-filter';
import { InterviewToBeDeletedInterface } from './interface/interview-to-be-deleted.interface';
import { StudentInfoEntity } from '../models/student/entities';
import { StudentStatus } from 'types';

@Injectable()
export class CronService {
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
}
