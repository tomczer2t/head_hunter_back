import { Injectable } from '@nestjs/common';
import { StudentCsv } from '../../../types';
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

  async addStudents(students: StudentCsv[]) {
    const databaseResults = await this.addStudentsToDatabase(students);
    const emailResults = await this.sendRegistrationMails(
      databaseResults.addedStudents,
    );

    const failedCount =
      databaseResults.failedFor.length + emailResults.failedFor.length;

    return {
      failedFor: [...databaseResults.failedFor, ...emailResults.failedFor],
      message: `Successfully imported and registered ${
        students.length - failedCount
      } students out of a possible ${students.length}.`,
    };
  }

  async addStudentsToDatabase(studentsCsv: StudentCsv[]) {
    let lastError: string;
    const failedFor: string[] = [];
    const addedStudents: UserEntity[] = [];
    for (const student of studentsCsv) {
      const result = await this.userService.addStudentFromCsvFile(student);
      if (result.isOk) {
        addedStudents.push(result.student);
      } else {
        failedFor.push(student.email);
        lastError = result.error;
      }
    }
    return { failedFor, addedStudents, lastError };
  }

  async sendRegistrationMails(students: UserEntity[]) {
    const origin = this.appConfigService.origin;
    const subject = 'Finish your registration process on MegaK Head Hunter.';
    const failedFor: string[] = [];
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
      if (!result.isOk) {
        failedFor.push(result.email);
      }
    }
    return { failedFor };
  }
}
