import { Injectable } from '@nestjs/common';
import { AddStudentsResponse, FailedFor, StudentCsv } from '../../../types';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities';
import { EmailProviderService } from '../../providers/email/provider.service';
import { studentRegistrationTemplate } from '../../providers/email/templates';
import { AppConfigService } from '../../config/app/config.service';

@Injectable()
export class AdminService {
  constructor(
    private userService: UserService,
    private emailProviderService: EmailProviderService,
    private appConfigService: AppConfigService,
  ) {}

  async addStudents(students: StudentCsv[]): Promise<AddStudentsResponse> {
    const databaseResults = await this.addStudentsToDatabase(students);
    const emailResults = await this.sendRegistrationMails(
      databaseResults.addedStudents,
    );

    const failedCount =
      databaseResults.failedFor.length + emailResults.failedFor.length;
    const successCount = students.length - failedCount;
    return {
      failedFor: [...databaseResults.failedFor, ...emailResults.failedFor],
      failedCount,
      message: `Successfully imported and registered ${successCount} students out of a possible ${students.length}.`,
      successCount,
    };
  }

  async addStudentsToDatabase(studentsCsv: StudentCsv[]) {
    const failedFor: FailedFor[] = [];
    const addedStudents: UserEntity[] = [];
    for (const student of studentsCsv) {
      const result = await this.userService.addStudentFromCsvFile(student);
      if (result.isOk) {
        addedStudents.push(result.student);
      } else {
        failedFor.push({ email: student.email, error: result.error });
      }
    }
    return { failedFor, addedStudents };
  }

  async sendRegistrationMails(students: UserEntity[]) {
    const origin = this.appConfigService.origin;
    const subject = 'Finish your registration process on MegaK Head Hunter.';
    const failedFor: FailedFor[] = [];
    for (const student of students) {
      const emailBody = studentRegistrationTemplate(
        student.id,
        student.verificationToken,
        origin,
      );
      const result = await this.emailProviderService.sendMail(
        student.email,
        subject,
        emailBody,
      );
      if (result.isOk === false) {
        failedFor.push({ email: result.email, error: result.error });
      }
    }
    return { failedFor };
  }
}
