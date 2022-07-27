import { getExtension } from 'mime';
import { BadRequestException } from '@nestjs/common';

export const fileCsvFilter = (req: any, file: Express.Multer.File, cb) => {
  if (getExtension(file.mimetype) !== 'csv') {
    return cb(new BadRequestException());
  }
  return cb(null, true);
};
