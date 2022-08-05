import { PickedStudentInfoProperties } from './filtered-available-student';
import { StudentStatus } from './student-status';

export interface StudentOnInterviewList extends PickedStudentInfoProperties {
  bookedUntil: string;
  studentStatus: StudentStatus;
  userId: string;
}
