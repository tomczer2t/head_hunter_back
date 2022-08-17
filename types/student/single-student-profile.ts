import { StudentInfoEntity } from '../../src/models/student/entities';

type Student = Pick<
  StudentInfoEntity,
  | 'firstName'
  | 'lastName'
  | 'bio'
  | 'githubUsername'
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
  | 'education'
  | 'workExperience'
>;

export interface SingleStudentProfile extends Student {
  scrumOwnCommits?: string;
  scrumOwnCodeReviews?: string;
  portfolioUrls: string[];
  projectUrls: string[];
  bonusProjectUrls: string[];
  courses: string;
  tel: string;
  email: string;
  userId: string;
  countryCode: string;
}
