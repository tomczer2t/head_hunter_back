import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  USER_INPUT_BIO_MAX_LENGTH,
  USER_INPUT_CITY_NAME_MAX_LENGTH,
  USER_INPUT_CONTRACT_TYPE_MAX_LENGTH,
  USER_INPUT_EXPECTED_SALARY_MAX_LENGTH_DTO,
  USER_INPUT_FIRSTNAME_MAX_LENGTH,
  USER_INPUT_FIRSTNAME_MIN_LENGTH,
  USER_INPUT_GITHUB_USERNAME_MAX_LENGTH,
  USER_INPUT_LASTNAME_MAX_LENGTH,
  USER_INPUT_LASTNAME_MIN_LENGTH,
  USER_INPUT_MONTHS_OF_COMMERCIAL_EXP_MAX_LENGTH_DTO,
  USER_INPUT_TYPE_OF_WORK_MAX_LENGTH,
} from '../../../config/constants';
import { Transform, Type } from 'class-transformer';
import {
  ExpectedContractType,
  StudentStatus,
  ExpectedWorkType,
} from '../../../../types';

export class StudentFormProfileDto {
  @IsOptional()
  tel: number; // @TODO to be verified

  @IsNotEmpty()
  @IsString()
  @MinLength(USER_INPUT_FIRSTNAME_MIN_LENGTH)
  @MaxLength(USER_INPUT_FIRSTNAME_MAX_LENGTH)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(USER_INPUT_LASTNAME_MIN_LENGTH)
  @MaxLength(USER_INPUT_LASTNAME_MAX_LENGTH)
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(USER_INPUT_GITHUB_USERNAME_MAX_LENGTH)
  githubUsername: string;

  @IsOptional()
  @IsArray()
  @IsUrl(undefined, { each: true })
  @ArrayMinSize(0)
  portfolioUrls: Array<string> | [];

  @IsNotEmpty()
  @IsArray()
  @IsUrl(undefined, { each: true })
  @ArrayMinSize(1)
  projectUrls: Array<string> | [];

  @IsOptional()
  @IsString()
  @MaxLength(USER_INPUT_BIO_MAX_LENGTH)
  bio: string;

  @IsNotEmpty()
  @IsDefined()
  @IsEnum(ExpectedWorkType)
  @MaxLength(USER_INPUT_TYPE_OF_WORK_MAX_LENGTH)
  expectedTypeWork: ExpectedWorkType;

  @IsOptional()
  @IsString()
  @MaxLength(USER_INPUT_CITY_NAME_MAX_LENGTH)
  targetWorkCity: string;

  @IsNotEmpty()
  @IsDefined()
  @IsEnum(ExpectedContractType)
  @MaxLength(USER_INPUT_CONTRACT_TYPE_MAX_LENGTH)
  expectedContractType: ExpectedContractType;

  @Transform(({ value }) => Number(value))
  @IsNumber({ allowNaN: false })
  @IsOptional()
  @Max(USER_INPUT_EXPECTED_SALARY_MAX_LENGTH_DTO)
  @Min(0)
  expectedSalary: number;

  @IsNotEmpty()
  @IsDefined()
  @IsBoolean()
  @Type(() => Boolean)
  canTakeApprenticeship: boolean;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber({ allowNaN: false })
  @Min(0)
  @Max(USER_INPUT_MONTHS_OF_COMMERCIAL_EXP_MAX_LENGTH_DTO)
  @Type(() => Number)
  monthsOfCommercialExp: number;

  @IsOptional()
  @IsString()
  education: string;

  @IsOptional()
  @IsString()
  workExperience: string;

  @IsOptional()
  @IsString()
  courses: string;

  @IsOptional()
  @Min(StudentStatus.HIRED)
  @Max(StudentStatus.HIRED)
  @IsNumber()
  studentStatus: StudentStatus.HIRED;
}
