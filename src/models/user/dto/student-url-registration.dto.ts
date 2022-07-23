import {
  ArrayMinSize,
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
import { MatchDecorator } from '../../../common';
import { Type } from 'class-transformer';

enum ContractType {
  EmploymentContract = 'Umowa o prace',
  Business2Business = 'B2B',
  MandateContractOrWorkContract = 'Umowa zlecenie lub umowa o dzielo',
  Any = 'Dowolna',
}

export class UserUrlRegistrationDto {
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
  @IsString({ each: true })
  @ArrayMinSize(0)
  projectUrls: Array<string> | []; // when testing in Postman / Insomnia remember to insert data in JSON format

  @IsDefined()
  @IsEnum(ContractType)
  expectedContractType: ContractType;

  @IsDefined()
  @IsBoolean()
  @Type(() => Boolean)
  canTakeApprenticeship: boolean;

  @IsDefined()
  @IsNotEmpty()
  @IsNumber({ allowNaN: false }, { each: true })
  @Type(() => Number)
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
  @MatchDecorator('password', { message: 'Provided passwords are different' })
  passwordConfirm: string;
}
