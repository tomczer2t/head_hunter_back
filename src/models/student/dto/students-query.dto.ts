import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ExpectedWorkType, SortBy } from '../../../../types';

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
}
