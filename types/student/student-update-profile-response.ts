import { StudentInfoEntity } from '../../src/models/student/entities';

type StudentUpdateProfile = Pick<
  StudentInfoEntity,
  | 'courseCompletion'
  | 'courseEngagment'
  | 'projectDegree'
  | 'teamProjectDegree'
  | 'bonusProjectUrls'
  | 'tel'
  | 'firstName'
  | 'lastName'
  | 'githubUsername'
  | 'portfolioUrls'
  | 'projectUrls'
  | 'bio'
  | 'expectedTypeWork'
  | 'targetWorkCity'
  | 'expectedContractType'
  | 'expectedSalary'
  | 'canTakeApprenticeship'
  | 'monthsOfCommercialExp'
  | 'education'
  | 'workExperience'
  | 'courses'
>;

export interface StudentUpdateProfileResponse extends StudentUpdateProfile {
  studentStatus: number;
  userId: string;
}
