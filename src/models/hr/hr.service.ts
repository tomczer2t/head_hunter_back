import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HrInterviewEntity } from './entities/hr-interview.entity';
import { UserEntity } from '../user/entities';
import { StudentOnInterviewList, StudentStatus, UserRole } from 'types';
import { AddInterviewResponse } from '../../../types';
import { HrFormProfileDto } from './dto/hr-form-profile.dto';
import { HrInfoEntity } from './entities';
import { HrDto } from './dto/hr.dto';
import { UserService } from '../user/user.service';
import { businessDaysFilter } from '../../common/utils/business-days-filter';

@Injectable()
export class HrService {
  constructor(private userService: UserService) {}

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
    userId: string,
    hr: UserEntity,
  ): Promise<AddInterviewResponse> {
    const student = await UserEntity.findOne({
      where: { id: userId },
      relations: ['studentInfo'],
    });

    if (!student) {
      throw new NotFoundException('Student info not found');
    }
    if (
      student.studentInfo.studentStatus === StudentStatus.BUSY ||
      student.studentInfo.studentStatus === StudentStatus.HIRED
    ) {
      throw new ConflictException(
        'Selected student is already appointed or hired',
      );
    }

    const interview = new HrInterviewEntity();
    interview.student = student;
    interview.hr = hr;
    await interview.save();

    student.studentInfo.studentStatus = StudentStatus.BUSY;
    await student.studentInfo.save();

    return { isSuccess: true };
  }

  async updateHrInfo(
    hrFormProfileDto: HrFormProfileDto,
    hrInfo: HrInfoEntity,
  ): Promise<HrInfoEntity> {
    for (const [key, value] of Object.entries(hrFormProfileDto)) {
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

  async addNewHr(hrDto: HrDto) {
    const { email, ...restHrData } = hrDto;
    const hr = await this.userService.addUser(email, UserRole.HR);
    hr.hrInfo = await this.addHrInfo(restHrData);
    await hr.save();
    return hr;
  }

  async addHrInfo(hrInfo: Omit<HrDto, 'email'>) {
    const newHrInfo = new HrInfoEntity();
    for (const [key, value] of Object.entries(hrInfo)) {
      newHrInfo[key] = value;
    }
    await newHrInfo.save();
    return newHrInfo;
  }
}
