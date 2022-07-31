import { ContractType } from '../../../types';

export const USER_INPUT_EMAIL_MAX_LENGTH = 254; // total number of user input + domain https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address#:~:text=%22There%20is%20a%20length%20limit,total%20length%20of%20320%20characters.

export const USER_INPUT_PASSWORD_MIN_LENGTH = 8;
export const USER_INPUT_PASSWORD_MAX_LENGTH = 64; // min and max password length - https://www.auditboard.com/blog/nist-password-guidelines/

export const USER_INPUT_FIRSTNAME_MIN_LENGTH = 2; // https://babynames1000.com/three-letter/
export const USER_INPUT_FIRSTNAME_MAX_LENGTH = 35; // 35 characters recommended in GB for first name. Forename p. 7 https://webarchive.nationalarchives.gov.uk/ukgwa/+/http://www.cabinetoffice.gov.uk/media/254290/GDS%20Catalogue%20Vol%202.pdf

export const USER_INPUT_LASTNAME_MIN_LENGTH = 2; // http://www.americanlastnames.us/articles/shortest-last-names.html
export const USER_INPUT_LASTNAME_MAX_LENGTH = 35; // 70 characters recommended in GB for full name. Individual full name p. 8 https://webarchive.nationalarchives.gov.uk/ukgwa/+/http://www.cabinetoffice.gov.uk/media/254290/GDS%20Catalogue%20Vol%202.pdf

export const USER_INPUT_GITHUB_USERNAME_MAX_LENGTH = 39; // https://github.com/join

export const USER_INPUT_COMPANY_NAME_MAX_LENGTH = 160; // https://companieshouse.blog.gov.uk/2019/02/14/symbols-and-characters-in-a-company-name/

export const USER_INPUT_CONTRACT_TYPE_MAX_LENGTH = Math.max(
  ...Object.values(ContractType).map((item) => item.length),
);

export const USER_INPUT_CITY_NAME_MAX_LENGTH = 22; // https://worldpopulationreview.com/world-city-rankings/longest-city-names

export const USER_INPUT_BIO_MAX_LENGTH = 2500;

const USER_INPUT_EXPECTED_SALARY = '100000'; // 100 000 is 6 digits long
export const USER_INPUT_EXPECTED_SALARY_MAX_LENGTH_DTO =
  +USER_INPUT_EXPECTED_SALARY;
export const USER_INPUT_EXPECTED_SALARY_MAX_LENGTH_ENTITY =
  USER_INPUT_EXPECTED_SALARY.length;

const USER_INPUT_MAX_RESERVED_STUDENTS = '999'; // 999 is 3 digits long
export const USER_INPUT_MAX_RESERVED_STUDENTS_MAX_LENGTH_DTO =
  +USER_INPUT_MAX_RESERVED_STUDENTS;
export const USER_INPUT_MAX_RESERVED_STUDENTS_MAX_LENGTH_ENTITY =
  USER_INPUT_MAX_RESERVED_STUDENTS.length;

const USER_INPUT_MONTHS_OF_COMMERCIAL_EXP = '999'; // 999 is 3 digits long
export const USER_INPUT_MONTHS_OF_COMMERCIAL_EXP_MAX_LENGTH_DTO =
  +USER_INPUT_MONTHS_OF_COMMERCIAL_EXP;
export const USER_INPUT_MONTHS_OF_COMMERCIAL_EXP_MAX_LENGTH_ENTITY =
  USER_INPUT_MONTHS_OF_COMMERCIAL_EXP.length;

export const METADATA_KEY_STUDENT_EMPLOYMENT_STATUS =
  'studentStatusesWhichAreAllowedToStillHaveAccessToThisApplication';
