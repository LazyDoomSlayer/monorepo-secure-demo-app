import {
  Controller,
  Get,
  Query,
  HttpCode,
  Param,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuditService } from './audit.service';
import { AuditLogResponseDto } from './dtos/audit-logs-response.dto';
import { GetAuditLogsDto } from './dtos/get-audit-logs.dto';
import { DatabaseLogger } from '../logging/logging.service';

@Controller('audit')
export class AuditController {
  constructor(
    private readonly auditService: AuditService,
    private readonly dbLogger: DatabaseLogger,
  ) {}

  @Get()
  @HttpCode(200)
  async getLogs(@Query() filterDto: GetAuditLogsDto) {
    this.dbLogger.log(
      `GET /audit – filter=${JSON.stringify(filterDto)}`,
      AuditController.name,
      { filterDto },
    );

    const raw = await this.auditService.getLogs(filterDto);

    this.dbLogger.log(
      `→ returned ${raw.length} audit records`,
      AuditController.name,
      { count: raw.length },
    );

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
    this.dbLogger.log(`GET /audit/${id}`, AuditController.name, { logId: id });

    const log = await this.auditService.getLogById(id);

    this.dbLogger.log(`→ found audit record ${id}`, AuditController.name, {
      log,
    });

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
