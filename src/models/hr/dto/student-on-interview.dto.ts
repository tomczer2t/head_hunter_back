import { IsNotEmpty, IsUUID } from 'class-validator';

export class StudentOnInterviewDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
