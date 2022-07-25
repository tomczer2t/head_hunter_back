import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Express } from 'express';
import { parse, ParseResult } from 'papaparse';
import { StudentCsv } from '../../../types';

@Injectable()
export class ParseCsvPipe implements PipeTransform {
  async transform(file: Express.Multer.File, metada: ArgumentMetadata) {
    return await this.parseCsv(file);
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
        dynamicTyping: true,
        complete: async (results: ParseResult<StudentCsv>) => {
          return resolve(results.data);
        },
        error: (error) => {
          return reject(error);
        },
      });
    });
  }
}
