import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ETaskStatus } from '../types/task-status.enum';

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsEnum(ETaskStatus)
  status: ETaskStatus;
}
