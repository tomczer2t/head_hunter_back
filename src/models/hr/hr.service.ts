import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HrInterviewEntity } from './entities/hr-interview.entity';
import { StudentInfoEntity } from '../student/entities';
import { UserEntity } from '../user/entities';

@Injectable()
export class HrService {
  async allInterviewsFromOneHr(hrId: string): Promise<HrInterviewEntity[]> {
    return await HrInterviewEntity.find({
      relations: ['student'],
      where: { hr: { id: hrId } },
    });
  }

  async addStudentToInterview(studentGitHubUsername: string, hr: UserEntity) {
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
    const interview = new HrInterviewEntity();
    interview.student = student.user;
    interview.hr = hr;
    await interview.save();
  }
}
