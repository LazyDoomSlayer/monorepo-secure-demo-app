import { IsOptional, IsIn, IsISO8601, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetLogsDto {
  @IsOptional()
  @IsIn(['log', 'error', 'warn', 'debug', 'verbose'])
  level?: string;

  @IsOptional()
  context?: string;

  @IsOptional()
  @IsISO8601()
  from?: string; // e.g. "2025-05-01T00:00:00Z"

  @IsOptional()
  @IsISO8601()
  to?: string; // e.g. "2025-05-31T23:59:59Z"

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number = 50;
}
