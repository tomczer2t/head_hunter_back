import { StudentInfoEntity } from '../../src/models/student/entities';

type PickedStudentInfoProperties = Pick<
  StudentInfoEntity,
  | 'studentInfoId'
  | 'courseEngagment'
  | 'courseCompletion'
  | 'teamProjectDegree'
  | 'projectDegree'
  | 'expectedTypeWork'
  | 'targetWorkCity'
  | 'expectedContractType'
  | 'expectedSalary'
  | 'canTakeApprenticeship'
  | 'monthsOfCommercialExp'
>;

export interface FilteredAvailableStudent extends PickedStudentInfoProperties {
  fullName: string;
}
