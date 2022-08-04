import { PickedStudentInfoProperties } from './filtered-available-student';
import { StudentStatus } from './student-status';

export interface StudentOnInterviewList
  extends Omit<PickedStudentInfoProperties, 'studentInfoId'> {
  firstName: string;
  lastName: string;
  bookedUntil: string;
  studentStatus: StudentStatus;
  userId: string;
}
