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
>;

export interface SingleStudentProfile extends Student {
  avatarUrl?: string;
  scrumUrlsToRepositories?: string[];
  scrumOwnCommits?: string;
  scrumOwnCodeReviews?: string;
}
