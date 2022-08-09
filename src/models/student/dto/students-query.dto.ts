import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  ExpectedContractType,
  ExpectedWorkType,
  SortBy,
} from '../../../../types';

enum CanTakeApprenticeship {
  TRUE = 'true',
  FALSE = 'false',
}

export class StudentsQueryDto {
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;

  @Transform(({ value: courseCompletionDegrees }) => {
    const numberDegrees: number[] = [];
    for (const stringDegree of courseCompletionDegrees) {
      const numberDegree = Number(stringDegree);
      if (isNaN(numberDegree)) break;
      numberDegrees.push(numberDegree);
    }
    return numberDegrees;
  })
  @IsArray()
  @IsOptional()
  courseCompletion?: string[];

  @Transform(({ value }) => decodeURI(value))
  @IsOptional()
  @IsEnum(ExpectedWorkType)
  expectedTypeWork: ExpectedWorkType;

  @IsOptional()
  @IsEnum(CanTakeApprenticeship)
  canTakeApprenticeship: CanTakeApprenticeship;

  @Transform(({ value }) => decodeURI(value))
  @IsOptional()
  @IsEnum(ExpectedContractType)
  expectedContractType: ExpectedContractType;

  @Transform(({ value: degrees }) => {
    const numberDegrees: number[] = [];
    for (const stringDegree of degrees) {
      const numberDegree = Number(stringDegree);
      if (isNaN(numberDegree)) break;
      numberDegrees.push(numberDegree);
    }
    return numberDegrees;
  })
  @IsArray()
  @IsOptional()
  courseEngagment: string[];

  @Transform(({ value: degrees }) => {
    const numberDegrees: number[] = [];
    for (const stringDegree of degrees) {
      const numberDegree = Number(stringDegree);
      if (isNaN(numberDegree)) break;
      numberDegrees.push(numberDegree);
    }
    return numberDegrees;
  })
  @IsArray()
  @IsOptional()
  projectDegree: string[];

  @Transform(({ value: degrees }) => {
    const numberDegrees: number[] = [];
    for (const stringDegree of degrees) {
      const numberDegree = Number(stringDegree);
      if (isNaN(numberDegree)) break;
      numberDegrees.push(numberDegree);
    }
    return numberDegrees;
  })
  @IsArray()
  @IsOptional()
  teamProjectDegree: string[];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  salaryFrom: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  salaryTo: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  monthsOfCommercialExp: number;
}
