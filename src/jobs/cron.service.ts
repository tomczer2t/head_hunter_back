import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HrInterviewEntity } from '../models/hr/entities/hr-interview.entity';
import { onlyBusinessDays } from '../common/utils/moment-business-days';
import { InterviewToBeDeletedInterface } from './interface/interview-to-be-deleted-interface';
import { StudentInfoEntity } from '../models/student/entities';
import { StudentStatus } from 'types';
import { UserEntity } from '../models/user/entities';

@Injectable()
export class CronService {
  @Cron(CronExpression.EVERY_10_SECONDS)
  async deleteInterviewsOlderThan10BusinessDays() {
    const interviews: HrInterviewEntity[] | [] = await HrInterviewEntity.find();
    if (interviews.length > 0) {
      for (const { id, studentId } of this.filter(10, interviews)) {
        const { affected } = await HrInterviewEntity.delete(id);
        if (affected) {
          const user = await UserEntity.findOne({
            where: { id: studentId },
          });
          console.log('user przed zapisaniem', user);
          user.studentInfo.studentStatus = StudentStatus.AVAILABLE;
          await user.save();
          console.log('user po zapisaniem', user);
        }
      }
    }
  }

  private filter(
    days: number,
    interviews: HrInterviewEntity[],
  ): InterviewToBeDeletedInterface[] | [] {
    console.log('interviews', interviews);
    return interviews
      .map((item) => ({
        id: item.id,
        studentId: item.student.id,
        createdAt: item.createdAt.toLocaleDateString(),
      }))
      .filter(
        (item) =>
          onlyBusinessDays()(item.createdAt, 'DD/MM/YYYY').businessDiff(
            onlyBusinessDays()(new Date().toLocaleDateString(), 'DD/MM/YYYY'),
          ) >= days,
      );
  }
}
