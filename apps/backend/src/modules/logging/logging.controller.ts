// src/logging/logging.controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  HttpCode,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DatabaseLogger } from './logging.service';
import { LogResponseDto } from './log-response.dto';
import { GetLogsDto } from './get-logs.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/auth-roles.decorator';
import { Role } from '../auth/auth.enum';

@Controller('logs')
@UseGuards(AuthGuard(), RolesGuard)
@Roles(Role.Admin)
export class LoggingController {
  constructor(private readonly loggingService: DatabaseLogger) {}

  @Get()
  @HttpCode(200)
  async getLogs(@Query() filter: GetLogsDto) {
    const [logs, total] = await this.loggingService.getLogs(filter);

    return {
      total,
      items: plainToInstance(LogResponseDto, logs, {
        excludeExtraneousValues: true,
      }),
    };
  }

  @Get(':id')
  @HttpCode(200)
  async getLogById(@Param('id', ParseUUIDPipe) id: string) {
    const log = await this.loggingService.getLogById(id);
    return plainToInstance(LogResponseDto, log, {
      excludeExtraneousValues: true,
    });
  }
}
