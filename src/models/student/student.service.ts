import { Injectable, NotFoundException } from '@nestjs/common';
import {
  StudentCsv,
  StudentStatus,
  UserAccountStatus,
  UserRole,
  FilteredAvailableStudent,
  SingleStudentProfile,
  ListAvailableResponse,
} from '../../../types';
import { StudentInfoEntity } from './entities';
import { StudentFormProfileDto } from './dto/student-form-profile.dto';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities';
import { DataSource } from 'typeorm';
import { StudentsQueryDto } from './dto/students-query.dto';

@Injectable()
export class StudentService {
  constructor(
    private userService: UserService,
    private dataSource: DataSource,
  ) {}

  async updateStudent(
    studentFormProfileDto: StudentFormProfileDto,
    user: UserEntity,
  ) {
    const { studentInfo } = user;
    for (const [key, value] of Object.entries(studentFormProfileDto)) {
      if (key === 'portfolioUrls' || key === 'projectUrls') {
        studentInfo[key] = JSON.stringify(value);
      } else {
        studentInfo[key] = value;
      }
    }
    user.accountStatus = UserAccountStatus.ACTIVE;
    await user.save();
    studentInfo.bonusProjectUrls = JSON.stringify(studentInfo.bonusProjectUrls);
    studentInfo.studentStatus = StudentStatus.AVAILABLE;
    await studentInfo.save();
    return studentInfo;
  }

  async addStudentOrUpdate(
    studentCsvData: StudentCsv,
  ): Promise<{ student: UserEntity; isUpdated: boolean }> {
    const { email, ...restStudentData } = studentCsvData;
    let isUpdated = false;
    let student = await this.userService.getUserByEmailWithRelations(
      studentCsvData.email,
    );
    if (!student) {
      student = await this.userService.addUser(email, UserRole.STUDENT);
      student.studentInfo = await this.addStudentInfo(restStudentData);
    } else {
      isUpdated = true;
      await this.updateStudentInfoFromCsv(studentCsvData, student.studentInfo);
    }
    await student.save();
    return { student, isUpdated };
  }

  async addStudentInfo(
    studentInfoCsvData: Omit<StudentCsv, 'email'>,
  ): Promise<StudentInfoEntity> {
    const studentInfo = new StudentInfoEntity();
    for (const [key, value] of Object.entries(studentInfoCsvData)) {
      if (key === 'bonusProjectUrls') {
        studentInfo[key] = JSON.stringify(value);
      } else {
        studentInfo[key] = value;
      }
    }
    await studentInfo.save();
    return studentInfo;
  }

  async updateStudentInfoFromCsv(
    studentInfoCsvData: Omit<StudentCsv, 'email'>,
    studentInfo: StudentInfoEntity,
  ): Promise<StudentInfoEntity> {
    for (const [key, value] of Object.entries(studentInfoCsvData)) {
      if (key === 'bonusProjectUrls') {
        studentInfo[key] = JSON.stringify(value);
      } else {
        studentInfo[key] = value;
      }
    }
    await studentInfo.save();
    return studentInfo;
  }

  async listAvailable(
    queries: StudentsQueryDto,
  ): Promise<ListAvailableResponse> {
    const query = await this.dataSource
      .createQueryBuilder()
      .select('user')
      .from(UserEntity, 'user')
      .leftJoinAndSelect('user.studentInfo', 'info')
      .where('info.studentStatus = :status', {
        status: StudentStatus.AVAILABLE,
      });

    console.log({ queries });
    if (queries.expectedTypeWork) {
      query.andWhere('info.expectedTypeWork = :expectedTypeWork', {
        expectedTypeWork: queries.expectedTypeWork,
      });
    }

    if (queries.canTakeApprenticeship) {
      query.andWhere('info.canTakeApprenticeship = :canTakeApprenticeship', {
        canTakeApprenticeship: queries.canTakeApprenticeship,
      });
    }

    if (queries.expectedContractType) {
      query.andWhere('info.expectedContractType = :expectedContractType', {
        expectedContractType: queries.expectedContractType,
      });
    }

    if (queries.courseCompletion) {
      console.log({ courseCompletion: queries.courseCompletion });
      query.andWhere('info.courseCompletion IN (:courseCompletion)', {
        courseCompletion: queries.courseCompletion,
      });
    }

    const students = await query.getMany();
    return this.filterAvailableStudents(students);
  }

  filterAvailableStudents(students: UserEntity[]): FilteredAvailableStudent[] {
    return students.map(({ id, studentInfo }) => ({
      userId: id,
      firstName: studentInfo.firstName,
      lastName: studentInfo.lastName[0],
      courseCompletion: studentInfo.courseCompletion,
      courseEngagment: studentInfo.courseEngagment,
      projectDegree: studentInfo.projectDegree,
      teamProjectDegree: studentInfo.teamProjectDegree,
      expectedTypeWork: studentInfo.expectedTypeWork,
      targetWorkCity: studentInfo.targetWorkCity,
      expectedContractType: studentInfo.expectedContractType,
      expectedSalary: studentInfo.expectedSalary,
      canTakeApprenticeship: studentInfo.canTakeApprenticeship,
      monthsOfCommercialExp: studentInfo.monthsOfCommercialExp,
    }));
  }

  async showOneStudentFromHrList(
    userStudentId: string,
  ): Promise<SingleStudentProfile> {
    const user = await UserEntity.findOne({
      where: { id: userStudentId },
    });
    if (!user) {
      throw new NotFoundException('Student not found');
    }
    const student = user.studentInfo;

    return this.filterStudentProfile(student);
  }

  private filterStudentProfile(
    student: StudentInfoEntity,
  ): SingleStudentProfile {
    const studentProfile = {};

    for (const [key, value] of Object.entries(student)) {
      if (
        key === 'firstName' ||
        key === 'lastName' ||
        key === 'bio' ||
        key === 'githubUsername' ||
        key === 'courseEngagment' ||
        key === 'courseCompletion' ||
        key === 'teamProjectDegree' ||
        key === 'projectDegree' ||
        key === 'expectedTypeWork' ||
        key === 'targetWorkCity' ||
        key === 'expectedContractType' ||
        key === 'expectedSalary' ||
        key === 'canTakeApprenticeship' ||
        key === 'monthsOfCommercialExp' ||
        key === 'education' ||
        key === 'workExperience'
      ) {
        studentProfile[key] = value;
      } else if (
        key === 'bonusProjectUrls' ||
        key === 'portfolioUrls' ||
        key === 'projectUrls'
      ) {
        studentProfile[key] = JSON.parse(value);
      }
    }
    return studentProfile as SingleStudentProfile;
  }
}
