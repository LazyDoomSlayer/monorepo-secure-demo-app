import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../auth/user.entity';

export class GetAuditLogsDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @IsOptional()
  @IsEnum(['create', 'read', 'update', 'delete'])
  action?: 'create' | 'read' | 'update' | 'delete';

  @IsOptional()
  @IsString()
  entity?: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
