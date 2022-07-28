import {
  BadRequestException,
  ConflictException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ErrorType, StudentCsv } from '../../../types';
import { UserEntity } from '../../models/user/entities';

@Injectable()
export class StudentsCsvValidatorPipe implements PipeTransform {
  async transform(students: StudentCsv[]) {
    await this.validateStudents(students);
    return students;
  }

  async validateStudents(students: StudentCsv[]) {
    for (const [index, student] of students.entries()) {
      const row = index + 2;
      const { email, bonusProjectUrls, ...degrees } = student;

      this.validateEmptyFields(student, row);
      this.validateHeaders(Object.keys(student));
      await this.validateEmail(email, row);
      this.validateDegrees(degrees, row);
      this.validateGithubUrls(bonusProjectUrls, row);
    }
  }

  validateEmptyFields(student: StudentCsv, row: number) {
    const isAnyNull = Object.values(student).some((value) => !value);
    if (isAnyNull) {
      throw new BadRequestException({
        errorType: ErrorType.VALIDATION_PARSED_FILE,
        message: 'All fields are required',
        row,
      });
    }
  }

  async validateEmail(email: string, row: number) {
    if (!email.includes('@')) {
      throw new BadRequestException({
        errorType: ErrorType.VALIDATION_PARSED_FILE,
        message: `Email is not valid - ${email}`,
        row,
      });
    }
  }

  validateDegrees(
    degrees: Omit<StudentCsv, 'email' | 'bonusProjectUrls'>,
    row: number,
  ) {
    Object.values(degrees).forEach((degree) => {
      if (typeof degree !== 'number') {
        throw new BadRequestException({
          errorType: ErrorType.VALIDATION_PARSED_FILE,
          message: 'Each degree must be an integer',
          row,
        });
      }
      if (degree < 0 || degree > 5) {
        throw new BadRequestException({
          errorType: ErrorType.VALIDATION_PARSED_FILE,
          message: 'Each degree must be in the range of 0-5',
          row,
        });
      }
    });
  }

  validateGithubUrls(urls: string[], row: number) {
    const isEveryValid = urls.some((urlString) => {
      if (!urlString.includes('github')) {
        return false;
      }
      try {
        const url = new URL(urlString);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch (_) {
        return false;
      }
    });
    if (!isEveryValid) {
      throw new BadRequestException({
        errorType: ErrorType.VALIDATION_PARSED_FILE,
        message: 'Each bonus project URL should be proper github url',
        row,
      });
    }
  }

  validateHeaders(headers) {
    const requiredHeaders = [
      'email',
      'courseCompletion',
      'courseEngagment',
      'projectDegree',
      'bonusProjectUrls',
      'teamProjectDegree',
    ];

    const isThereAllRequiredHeaders = requiredHeaders.some(
      (requiredHeader) => !headers.includes(requiredHeader),
    );

    if (isThereAllRequiredHeaders) {
      throw new BadRequestException({
        errorType: ErrorType.VALIDATION_PARSED_FILE,
        message: `Headers: ${requiredHeaders.join(', ')} are required.`,
        row: 0,
      });
    }

    const isThereUnnecessaryHeaders = headers.some((header) => {
      return !requiredHeaders.includes(header);
    });

    if (isThereUnnecessaryHeaders) {
      throw new BadRequestException({
        errorType: ErrorType.VALIDATION_PARSED_FILE,
        message: `Only ${requiredHeaders.join(', ')} headers are accepted.`,
        row: 0,
      });
    }
  }
}
