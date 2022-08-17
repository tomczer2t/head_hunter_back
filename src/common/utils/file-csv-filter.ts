import { getExtension } from 'mime';
import { BadRequestException } from '@nestjs/common';
import { ErrorType } from '../../../types';

export const fileCsvFilter = (req: any, file: Express.Multer.File, cb) => {
  if (getExtension(file.mimetype) !== 'csv') {
    return cb(
      new BadRequestException({
        message: 'Bad file extension.',
        errorType: ErrorType.FILE_ERROR,
      }),
    );
  }
  return cb(null, true);
};
