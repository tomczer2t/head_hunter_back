import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      throw new NotFoundException('GitHub username not found');
    }
    if (
      student.studentStatus === StudentStatus.BUSY ||
      student.studentStatus === StudentStatus.HIRED
    ) {
      throw new ConflictException(
        'Selected student is already appointed or hired',
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
