import { StudentInfoEntity } from '../../src/models/student/entities';

type Student = Pick<
  StudentInfoEntity,
  | 'bonusProjectUrls'
  | 'firstName'
  | 'lastName'
  | 'bio'
  | 'githubUsername'
  | 'courseEngagment'
  | 'courseCompletion'
  | 'teamProjectDegree'
  | 'projectDegree'
  | 'portfolioUrls'
  | 'expectedTypeWork'
  | 'targetWorkCity'
  | 'expectedContractType'
  | 'expectedSalary'
  | 'canTakeApprenticeship'
  | 'monthsOfCommercialExp'
  | 'education'
  | 'workExperience'
  | 'projectUrls'
>;

export interface SingleStudentProfile extends Student {
  scrumOwnCommits?: string;
  scrumOwnCodeReviews?: string;
}
