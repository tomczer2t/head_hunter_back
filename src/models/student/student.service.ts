import { Injectable, NotFoundException } from '@nestjs/common';
import {
  StudentCsv,
  StudentStatus,
  UserAccountStatus,
  UserRole,
} from '../../../types';
import { StudentInfoEntity } from './entities';
import { StudentFormProfileDto } from './dto/student-form-profile.dto';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities';
import { DataSource } from 'typeorm';
import { ListAvailableResponse } from '../../../types';
import { FilteredAvailableStudent } from '../../../types';
import { SingleStudentProfile } from '../../../types/student/single-student-profile';

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

  async listAvailable(): Promise<ListAvailableResponse> {
    const students = await this.dataSource
      .createQueryBuilder()
      .select('userEntity')
      .from(UserEntity, 'userEntity')
      .leftJoinAndSelect('userEntity.studentInfo', 'studentInfo')
      .where('studentInfo.studentStatus = :status', {
        status: StudentStatus.AVAILABLE,
      })
      .getMany();
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

  async showOneStudentFromHrList(userStudentId: string) {
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
      } else if (key === 'bonusProjectUrls' || key === 'portfolioUrls') {
        studentProfile[key] = JSON.parse(value);
      }
    }
    return studentProfile as SingleStudentProfile;
  }
}
