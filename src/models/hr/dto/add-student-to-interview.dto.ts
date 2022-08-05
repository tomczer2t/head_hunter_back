import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddStudentToInterviewDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
