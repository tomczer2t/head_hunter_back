import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HrInterviewEntity } from './entities/hr-interview.entity';
import { UserEntity } from '../user/entities';
import {
  ListAvailableResponse,
  StudentOnInterviewList,
  StudentStatus,
  UserRole,
} from 'types';
import { AddInterviewResponse, RemoveInterviewResponse } from '../../../types';
import { HrFormProfileDto } from './dto/hr-form-profile.dto';
import { HrInfoEntity } from './entities';
import { HrDto } from './dto/hr.dto';
import { UserService } from '../user/user.service';
import { businessDaysFilter } from '../../common/utils/business-days-filter';
import { DataSource } from 'typeorm';
import { StudentService } from '../student/student.service';
import { StudentsQueryDto } from '../student/dto/students-query.dto';
import { hrStudentHireTemplate } from '../../providers/email/templates';
import { EmailProviderService } from '../../providers/email/provider.service';

@Injectable()
export class HrService {
  constructor(
    private userService: UserService,
    private dataSource: DataSource,
    private studentService: StudentService,
    private emailProviderService: EmailProviderService,
  ) {}

  async allInterviewsFromOneHr(
    hrId: string,
  ): Promise<StudentOnInterviewList[]> {
    const interviews = await this.dataSource
      .createQueryBuilder()
      .select('hi')
      .from(HrInterviewEntity, 'hi')
      .leftJoin('hi.hr', 'hr')
      .where('hr.id = :hrId', { hrId })
      .leftJoinAndSelect('hi.student', 'student')
      .leftJoinAndSelect('student.studentInfo', 'si')
      .andWhere('si.studentStatus != :studentStatus', {
        studentStatus: StudentStatus.HIRED,
      })
      .getMany();

    if (interviews.length === 0) return [];
    return this.filterStudentsForInterview(interviews);
  }

  async addStudentToInterview(
    userId: string,
    hr: UserEntity,
  ): Promise<AddInterviewResponse> {
    const [student] = await Promise.all([
      UserEntity.findOne({
        where: { id: userId },
        relations: ['studentInfo'],
      }),
    ]);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.studentInfo.studentStatus === StudentStatus.HIRED) {
      throw new ConflictException('Selected student is already hired');
    }

    const studentsFromCurrentHr = await this.dataSource
      .createQueryBuilder()
      .select('hi')
      .from(HrInterviewEntity, 'hi')
      .leftJoin('hi.hr', 'hr')
      .where('hr.id = :hrId', { hrId: hr.id })
      .leftJoinAndSelect('hi.student', 'student')
      .leftJoinAndSelect('student.studentInfo', 'si')
      .getMany();

    if (studentsFromCurrentHr.some((item) => item.student.id === userId)) {
      throw new ConflictException(
        'Selected student is already added to your interview list',
      );
    }

    if (studentsFromCurrentHr.length >= hr.hrInfo.maxReservedStudents) {
      throw new HttpException(
        'Number of allowed students for interviews has been exceeded',
        417,
      );
    }

    const interview = new HrInterviewEntity();
    interview.student = student;
    interview.hr = hr;
    await interview.save();

    return { isSuccess: true };
  }

  async deleteStudentFromInterview(
    userId: string,
    hr: UserEntity,
  ): Promise<RemoveInterviewResponse> {
    const { affected } = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(HrInterviewEntity)
      .where('studentId = :studentId', { studentId: userId })
      .andWhere('hrId = :hrId', { hrId: hr.id })
      .execute();

    if (!affected) throw new NotFoundException('Student not found');

    const { studentInfo } = await UserEntity.findOne({
      where: { id: userId },
      relations: ['studentInfo'],
    });

    studentInfo.studentStatus = StudentStatus.AVAILABLE;

    await studentInfo.save();

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

  async listAvailableStudents(
    queries: StudentsQueryDto,
  ): Promise<ListAvailableResponse> {
    return this.studentService.listAvailable(queries);
  }

  async hireStudent(hr: UserEntity, studentId: string) {
    const student = await this.studentService.getStudentById(studentId);
    if (!student) throw new NotFoundException('Student not found');
    const { isSuccess } = await this.studentService.hire(student);
    if (!isSuccess) {
      throw new InternalServerErrorException('Changing student status failed.');
    }
    const hrForEmail = {
      id: hr.id,
      firstName: hr.hrInfo.firstName,
      lastName: hr.hrInfo.lastName,
      company: hr.hrInfo.company,
    };
    const studentForEmail = {
      id: student.id,
      firstName: student.studentInfo.firstName,
      lastName: student.studentInfo.lastName,
    };
    const emailBody = hrStudentHireTemplate({
      hr: hrForEmail,
      student: studentForEmail,
    });
    const subject = `${hrForEmail.firstName} ${hrForEmail.lastName} zatrudnił kursanta!`;
    const admin = await UserEntity.findOneBy({ role: UserRole.ADMIN });

    await this.emailProviderService.sendMail(admin.email, subject, emailBody);

    return { isSuccess: true };
  }
}
