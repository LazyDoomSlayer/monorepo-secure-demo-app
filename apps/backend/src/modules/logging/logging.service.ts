import { Injectable, LoggerService, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entities/log.entity';
import { GetLogsDto } from './dtos/get-logs.dto';

@Injectable()
export class DatabaseLogger implements LoggerService {
  constructor(
    @InjectRepository(Log)
    private readonly repo: Repository<Log>,
  ) {}

  async getLogs(filter: GetLogsDto): Promise<[Log[], number]> {
    const qb = this.repo.createQueryBuilder('log');

    if (filter.level)
      qb.andWhere('log.level = :level', { level: filter.level });
    if (filter.context)
      qb.andWhere('log.context = :context', { context: filter.context });
    if (filter.from)
      qb.andWhere('log.timestamp >= :from', { from: filter.from });
    if (filter.to) qb.andWhere('log.timestamp <= :to', { to: filter.to });

    qb.orderBy('log.timestamp', 'DESC').skip(filter.skip).take(filter.take);

    const [data, total] = await qb.getManyAndCount();

    return [data, total];
  }

  async getLogById(id: string): Promise<Log> {
    const log = await this.repo.findOne({ where: { id } });
    if (!log) throw new NotFoundException(`Log ${id} not found`);
    return log;
  }

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
