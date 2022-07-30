import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  USER_INPUT_COMPANY_NAME_MAX_LENGTH,
  USER_INPUT_EMAIL_MAX_LENGTH,
  USER_INPUT_FIRSTNAME_MAX_LENGTH,
  USER_INPUT_FIRSTNAME_MIN_LENGTH,
  USER_INPUT_LASTNAME_MAX_LENGTH,
  USER_INPUT_LASTNAME_MIN_LENGTH,
  USER_INPUT_MAX_RESERVED_STUDENTS_MAX_LENGTH_DTO,
} from '../../../config/constants';

export class HrFormRegistrationDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(USER_INPUT_EMAIL_MAX_LENGTH)
  email: string;

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
  @MaxLength(USER_INPUT_COMPANY_NAME_MAX_LENGTH)
  company: string;

  @IsNotEmpty()
  @IsNumber({ allowNaN: false })
  @Max(USER_INPUT_MAX_RESERVED_STUDENTS_MAX_LENGTH_DTO)
  @Min(0)
  maxReservedStudents: number;
}
