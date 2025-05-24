import { Injectable, LoggerService } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './log.entity';

@Injectable()
export class DatabaseLogger implements LoggerService {
  constructor(
    @InjectRepository(Log)
    private readonly repo: Repository<Log>,
  ) {}

  private write(
    level: Log['level'],
    message: string,
    context = 'Application',
    meta?: any, // ← support meta
  ) {
    this.repo.insert({ level, message, context, meta }).catch(() => {});
  }

  // add a third `meta?` parameter
  log(message: string, context?: string, meta?: any) {
    this.write('log', message, context, meta);
    console.log(`[LOG] ${context ?? ''} ${message}`, meta);
  }

  error(
    message: string,
    trace?: string,
    context?: string,
    meta?: any, // ← here too
  ) {
    this.write('error', message, context, { trace, ...meta });
    console.error(`[ERROR] ${context ?? ''} ${message}`, trace, meta);
  }

  warn(message: string, context?: string, meta?: any) {
    this.write('warn', message, context, meta);
    console.warn(`[WARN] ${context ?? ''} ${message}`, meta);
  }

  debug(message: string, context?: string, meta?: any) {
    this.write('debug', message, context, meta);
    console.debug(`[DEBUG] ${context ?? ''} ${message}`, meta);
  }

  verbose(message: string, context?: string, meta?: any) {
    this.write('verbose', message, context, meta);
    console.info(`[VERBOSE] ${context ?? ''} ${message}`, meta);
  }
}
