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
import { LogResponseDto } from './dtos/log-response.dto';
import { GetLogsDto } from './dtos/get-logs.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/auth-roles.decorator';
import { Role } from '../auth/types/auth.enum';
import { LONG, MEDIUM } from '../../common/throttler.profiles';
import { Throttle } from '@nestjs/throttler';

@Controller('logs')
@UseGuards(AuthGuard(), RolesGuard)
@Roles(Role.Admin)
export class LoggingController {
  constructor(private readonly loggingService: DatabaseLogger) {}

  @Get()
  @HttpCode(200)
  @Throttle(MEDIUM)
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
  @Throttle(LONG)
  async getLogById(@Param('id', ParseUUIDPipe) id: string) {
    const log = await this.loggingService.getLogById(id);
    return plainToInstance(LogResponseDto, log, {
      excludeExtraneousValues: true,
    });
  }
}
