import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ETaskStatus } from '../types/task-status.enum';

export class FilterTasksDto {
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsEnum(ETaskStatus)
  status?: ETaskStatus;
}
