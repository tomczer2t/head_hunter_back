import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HrInterviewEntity } from './entities/hr-interview.entity';
import { StudentInfoEntity } from '../student/entities';
import { UserEntity } from '../user/entities';
import { StudentStatus, UserRole } from 'types';
import { AddInterviewResponse } from '../../../types';
import { HrFormProfileDto } from './dto/hr-form-profile.dto';
import { HrInfoEntity } from './entities';
import { HrDto } from './dto/hr.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class HrService {
  constructor(private userService: UserService) {}

  async allInterviewsFromOneHr(hrId: string): Promise<HrInterviewEntity[]> {
    return await HrInterviewEntity.find({
      relations: ['student'],
      where: { hr: { id: hrId } },
    });
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
    hrFormProfileDto: HrFormProfileDto,
    hrInfo: HrInfoEntity,
  ): Promise<HrInfoEntity> {
    for (const [key, value] of Object.entries(hrFormProfileDto)) {
      hrInfo[key] = value;
    }
    await hrInfo.save();
    return hrInfo;
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
