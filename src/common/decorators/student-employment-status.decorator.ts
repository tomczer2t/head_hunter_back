import { SetMetadata } from '@nestjs/common';
import { StudentStatus } from '../../../types';
import { METADATA_KEY_STUDENT_EMPLOYMENT_STATUS } from '../../config/constants';

export const StudentEmploymentStatus = (...studentStatuses: StudentStatus[]) =>
  SetMetadata(METADATA_KEY_STUDENT_EMPLOYMENT_STATUS, studentStatuses);
