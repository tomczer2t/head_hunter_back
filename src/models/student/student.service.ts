import { Injectable, NotFoundException } from '@nestjs/common';
import {
  FilteredAvailableStudent,
  ListAvailableResponse,
  StudentCsv,
  StudentStatus,
  UserAccountStatus,
  UserRole,
  SingleStudentProfile,
} from '../../../types';
import { StudentInfoEntity } from './entities';
import { StudentFormProfileDto } from './dto/student-form-profile.dto';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities';
import { DataSource } from 'typeorm';
import { StudentUpdateProfileResponse } from '../../../types/student/student-update-profile-response';
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
  ): Promise<StudentUpdateProfileResponse> {
    const { studentInfo } = user;
    for (const [key, value] of Object.entries(studentFormProfileDto)) {
      if (key === 'portfolioUrls' || key === 'projectUrls') {
        studentInfo[key] = JSON.stringify(value);
      } else {
        studentInfo[key] = value;
      }
    }

    await user.save();

    if (!studentInfo.studentStatus) {
      studentInfo.studentStatus = StudentStatus.AVAILABLE;
      user.accountStatus = UserAccountStatus.ACTIVE;
    }

    studentInfo.bonusProjectUrls = JSON.stringify(studentInfo.bonusProjectUrls);

    await studentInfo.save();

    const { studentInfoId, ...studentProfile } = studentInfo;

    return {
      userId: user.id,
      ...studentProfile,
    };
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

    if (queries.expectedTypeWork) {
      query.andWhere('info.expectedTypeWork IN (:expectedTypeWork)', {
        expectedTypeWork: queries.expectedTypeWork,
      });
    }

    if (queries.canTakeApprenticeship) {
      const canTake = queries.canTakeApprenticeship === 'true' ? 1 : 0;
      query.andWhere('info.canTakeApprenticeship = :canTakeApprenticeship', {
        canTakeApprenticeship: canTake,
      });
    }

    if (queries.expectedContractType) {
      query.andWhere('info.expectedContractType IN (:expectedContractType)', {
        expectedContractType: queries.expectedContractType,
      });
    }

    if (queries.courseCompletion) {
      query.andWhere('info.courseCompletion IN (:courseCompletion)', {
        courseCompletion: queries.courseCompletion,
      });
    }

    if (queries.courseEngagment) {
      query.andWhere('info.courseEngagment IN (:courseEngagment)', {
        courseEngagment: queries.courseEngagment,
      });
    }

    if (queries.projectDegree) {
      query.andWhere('info.projectDegree IN (:projectDegree)', {
        projectDegree: queries.projectDegree,
      });
    }

    if (queries.teamProjectDegree) {
      query.andWhere('info.teamProjectDegree IN (:teamProjectDegree)', {
        teamProjectDegree: queries.teamProjectDegree,
      });
    }

    if (queries.salaryFrom) {
      query.andWhere('info.expectedSalary >= :salaryFrom', {
        salaryFrom: queries.salaryFrom,
      });
    }

    if (queries.salaryTo) {
      query.andWhere('info.expectedSalary <= :salaryTo', {
        salaryTo: queries.salaryTo,
      });
    }

    if (queries.monthsOfCommercialExp) {
      query.andWhere('info.monthsOfCommercialExp >= :monthsOfCommercialExp', {
        monthsOfCommercialExp: queries.monthsOfCommercialExp,
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

    return this.filterStudentProfile(user);
  }

  private filterStudentProfile(user: UserEntity): SingleStudentProfile {
    const student = user.studentInfo;
    const studentProfile: SingleStudentProfile = {
      userId: user.id,
      firstName: student.firstName,
      lastName: student.lastName,
      email: user.email,
      bio: student.bio,
      githubUsername: student.githubUsername,
      courseEngagment: student.courseEngagment,
      courseCompletion: student.courseCompletion,
      teamProjectDegree: student.teamProjectDegree,
      projectDegree: student.projectDegree,
      expectedTypeWork: student.expectedTypeWork,
      expectedSalary: student.expectedSalary,
      canTakeApprenticeship: student.canTakeApprenticeship,
      monthsOfCommercialExp: student.monthsOfCommercialExp,
      education: student.education,
      workExperience: student.workExperience,
      courses: student.courses,
      tel: student.tel,
      bonusProjectUrls: JSON.parse(student.bonusProjectUrls),
      portfolioUrls: JSON.parse(student.portfolioUrls),
      projectUrls: JSON.parse(student.projectUrls),
      targetWorkCity: student.targetWorkCity,
      expectedContractType: student.expectedContractType,
    };
    return studentProfile as SingleStudentProfile;
  }

  getCv(student: UserEntity) {
    return this.filterStudentProfile(student);
  }
}
