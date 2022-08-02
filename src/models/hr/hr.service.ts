import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HrInterviewEntity } from './entities/hr-interview.entity';
import { StudentInfoEntity } from '../student/entities';
import { UserEntity } from '../user/entities';
import { StudentStatus } from 'types';
import { AddInterviewResponse } from '../../../types';

@Injectable()
export class HrService {
  async allInterviewsFromOneHr(hrId: string): Promise<HrInterviewEntity[]> {
    return await HrInterviewEntity.find({
      relations: ['student'],
      where: { hr: { id: hrId } },
    });
  }

  async addStudentToInterview(
    studentGitHubUsername: string,
    hr: UserEntity,
  ): Promise<AddInterviewResponse> {
    const student = await StudentInfoEntity.findOne({
      where: { githubUsername: studentGitHubUsername },
      relations: ['user'],
    });

    if (!student) {
      throw new HttpException(
        'GitHub username not found',
        HttpStatus.NOT_FOUND,
      );
    }
    if (
      student.studentStatus === StudentStatus.BUSY ||
      student.studentStatus === StudentStatus.HIRED
    ) {
      throw new HttpException(
        'Selected student is already appointed or hired',
        HttpStatus.CONFLICT,
      );
    }

    const interview = new HrInterviewEntity();
    interview.student = student.user;
    interview.hr = hr;
    await interview.save();

    student.studentStatus = StudentStatus.BUSY;
    await student.save();

    return { isSuccess: true };
  }
}
