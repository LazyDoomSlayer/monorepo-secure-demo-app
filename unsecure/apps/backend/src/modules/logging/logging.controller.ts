import {
  Controller,
  Get,
  Param,
  Query,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DatabaseLogger } from './logging.service';
import { LogResponseDto } from './dtos/log-response.dto';
import { GetLogsDto } from './dtos/get-logs.dto';

@Controller('logs')
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
