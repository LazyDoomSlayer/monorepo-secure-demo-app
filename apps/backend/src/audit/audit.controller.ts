import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpCode,
  Param,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuditService } from './audit.service';
import { RolesGuard } from '../auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/auth-roles.decorator';
import { Role } from 'src/auth/auth.enum';
import { AuditLogResponseDto } from './audit-logs-response.dto';
import { GetAuditLogsDto } from './get-audit-logs.dto';

@Controller('audit')
@UseGuards(AuthGuard(), RolesGuard)
@Roles(Role.Admin)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @HttpCode(200)
  async getLogs(@Query() filterDto: GetAuditLogsDto) {
    const raw = await this.auditService.getLogs(filterDto);

    return raw.map((log) =>
      plainToInstance(
        AuditLogResponseDto,
        {
          ...log,
          username: log.user.username,
          before: log.before
            ? (({ id, title, description, status }) => ({
                id,
                title,
                description,
                status,
              }))(log.before)
            : undefined,
          after: log.after
            ? (({ id, title, description, status }) => ({
                id,
                title,
                description,
                status,
              }))(log.after)
            : undefined,
        },
        { excludeExtraneousValues: true },
      ),
    );
  }

  @Get(':id')
  @HttpCode(200)
  async getLogById(@Param('id') id: string) {
    const log = await this.auditService.getLogById(id);
    // same mapping if you like, or just return minimal fields
    return plainToInstance(
      AuditLogResponseDto,
      {
        ...log,
        username: log.user.username,
        before: log.before
          ? (({ id, title, description, status }) => ({
              id,
              title,
              description,
              status,
            }))(log.before)
          : undefined,
        after: log.after
          ? (({ id, title, description, status }) => ({
              id,
              title,
              description,
              status,
            }))(log.after)
          : undefined,
      },
      { excludeExtraneousValues: true },
    );
  }
}
