import { SetMetadata } from '@nestjs/common';
import { StudentStatus } from '../../../types';
import { METADATA_KEY_STUDENT_EMPLOYMENT_STATUS } from '../../config/global';

export const StudentEmploymentStatus = (...studentStatuses: StudentStatus[]) =>
  SetMetadata(METADATA_KEY_STUDENT_EMPLOYMENT_STATUS, studentStatuses);
