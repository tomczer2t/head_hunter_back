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
import { HrFormRegistrationDto } from './dto/hr-form-profile.dto';
import { HrInfoEntity } from './entities';
import { StudentOnInterviewList } from '../../../types/student/student-on-interview-list';
import { businessDaysFilter } from '../../common/utils/business-days-filter';

@Injectable()
export class HrService {
  async allInterviewsFromOneHr(
    hrId: string,
  ): Promise<StudentOnInterviewList[]> {
    const interviews = await HrInterviewEntity.find({
      relations: ['student'],
      where: { hr: { id: hrId } },
    });
    if (!interviews) return [];

    return this.filterStudentsForInterview(interviews);
  }

  async addStudentToInterview(
    studentInfoId: string,
    hr: UserEntity,
  ): Promise<AddInterviewResponse> {
    const student = await StudentInfoEntity.findOne({
      where: { studentInfoId },
      relations: ['user'],
    });

    if (!student) {
      throw new NotFoundException('Student info not found');
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

  async updateHrInfo(
    hrFormRegistration: HrFormRegistrationDto,
    hrInfo: HrInfoEntity,
  ): Promise<HrInfoEntity> {
    for (const [key, value] of Object.entries(hrFormRegistration)) {
      hrInfo[key] = value;
    }
    await hrInfo.save();
    return hrInfo;
  }

  private filterStudentsForInterview(interviews: HrInterviewEntity[]) {
    const studentsForInterview: StudentOnInterviewList[] = interviews.map(
      (interview) => ({
        bookedUntil: businessDaysFilter()(interview.createdAt)
          .businessAdd(10, 'd')
          .toDate()
          .toLocaleDateString(),
        firstName: interview.student.studentInfo.firstName,
        lastName: interview.student.studentInfo.lastName,
        studentStatus: interview.student.studentInfo.studentStatus,
        githubUsername: interview.student.studentInfo.githubUsername,
        canTakeApprenticeship:
          interview.student.studentInfo.canTakeApprenticeship,
        courseCompletion: interview.student.studentInfo.courseCompletion,
        courseEngagment: interview.student.studentInfo.courseEngagment,
        expectedContractType:
          interview.student.studentInfo.expectedContractType,
        expectedSalary: interview.student.studentInfo.expectedSalary,
        expectedTypeWork: interview.student.studentInfo.expectedTypeWork,
        monthsOfCommercialExp:
          interview.student.studentInfo.monthsOfCommercialExp,
        projectDegree: interview.student.studentInfo.projectDegree,
        userId: interview.student.id,
        targetWorkCity: interview.student.studentInfo.targetWorkCity,
        teamProjectDegree: interview.student.studentInfo.teamProjectDegree,
      }),
    );
    return studentsForInterview;
  }
}
