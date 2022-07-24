import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import { parse } from 'papaparse';

@Injectable()
export class AdminService {
  async addStudents(studentsFile: Express.Multer.File) {
    const students = await this.parseCsv(studentsFile);
    console.log({ students });
    return students;
  }

  async parseCsv(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      parse(file.buffer.toString('utf-8'), {
        header: true,
        skipEmptyLines: true,
        transform(value, field) {
          if (field === 'bonusProjectUrls') {
            return (value as string)
              .split(',')
              .map((url) => url.trim())
              .filter((url) => !!url);
          }
          return value;
        },
        complete: (results) => {
          return resolve(results.data);
        },
        error: (error) => {
          return reject(error);
        },
      });
    });
  }
}
