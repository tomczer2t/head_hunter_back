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
} from '../../../config/global';
import { Type } from 'class-transformer';
import { ContractType } from '../../../../types';

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
  @IsString({ each: true })
  @ArrayMinSize(0)
  portfolioUrls: Array<string> | [];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  projectUrls: Array<string> | []; // when testing in Postman / Insomnia remember to insert data in JSON format

  @IsOptional()
  @IsString()
  @MaxLength(USER_INPUT_BIO_MAX_LENGTH)
  bio: string;

  @IsOptional()
  @IsString()
  @MaxLength(USER_INPUT_CITY_NAME_MAX_LENGTH)
  targetWorkCity: string;

  @IsNotEmpty()
  @IsDefined()
  @IsEnum(ContractType)
  @MaxLength(USER_INPUT_CONTRACT_TYPE_MAX_LENGTH)
  expectedContractType: ContractType;

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
}
