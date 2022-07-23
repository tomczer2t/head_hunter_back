import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  USER_INPUT_FIRSTNAME_MAX_LENGTH,
  USER_INPUT_FIRSTNAME_MIN_LENGTH,
  USER_INPUT_GITHUB_USERNAME_MAX_LENGTH,
  USER_INPUT_LASTNAME_MAX_LENGTH,
  USER_INPUT_LASTNAME_MIN_LENGTH,
  USER_INPUT_PASSWORD_MAX_LENGTH,
  USER_INPUT_PASSWORD_MIN_LENGTH,
} from '../../../config/global';

enum ContractType {
  EmploymentContract = 'Umowa o prace',
  Business2Business = 'B2B',
  MandateContractOrWorkContract = 'Umowa zlecenie lub umowa o dzielo',
  Any = 'Dowolna',
}

export class StudentUrlRegistrationDto {
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

  @IsArray()
  projectUrls: Array<string> | [];

  @IsDefined()
  @IsEnum(ContractType)
  expectedContractType: ContractType; // @TODO enum;

  @IsDefined()
  @IsBoolean()
  canTakeApprenticeship: boolean;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber({ allowNaN: false })
  monthsOfCommercialExp: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(USER_INPUT_PASSWORD_MIN_LENGTH)
  @MaxLength(USER_INPUT_PASSWORD_MAX_LENGTH)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(USER_INPUT_PASSWORD_MIN_LENGTH)
  @MaxLength(USER_INPUT_PASSWORD_MAX_LENGTH)
  passwordConfirm: string;
}
