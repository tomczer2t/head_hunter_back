import { IsArray, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  ExpectedContractType,
  ExpectedWorkType,
  SortBy,
} from '../../../../types';

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
    console.log(numberDegrees);
    return numberDegrees;
  })
  @IsArray()
  @IsOptional()
  courseCompletion?: string[];

  @Transform(({ value }) => decodeURI(value))
  @IsOptional()
  @IsEnum(ExpectedWorkType)
  expectedTypeWork: ExpectedWorkType;

  @Transform(({ value }) => {
    return value ? JSON.parse(value) : undefined;
  })
  @IsOptional()
  @IsBoolean()
  canTakeApprenticeship: boolean;

  @Transform(({ value }) => decodeURI(value))
  @IsOptional()
  @IsEnum(ExpectedContractType)
  expectedContractType: ExpectedContractType;
}
