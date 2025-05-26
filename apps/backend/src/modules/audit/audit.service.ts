import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { GetAuditLogsDto } from './dtos/get-audit-logs.dto';
import { NotFoundException } from '@nestjs/common';
import { DatabaseLogger } from '../logging/logging.service';

export interface AuditEntry {
  userId: string;
  action: 'create' | 'read' | 'update' | 'delete';
  entity: string;
  entityId: string;
  before?: any;
  after?: any;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>,
    private readonly dbLogger: DatabaseLogger,
  ) {}

  async log(entry: AuditEntry) {
    this.dbLogger.log(
      'AuditService.log() – creating audit entry',
      AuditService.name,
      { entry },
    );

    const record = this.repo.create(entry);
    await this.repo.save(record);

    this.dbLogger.log(
      `AuditService.log() – saved audit entry ${record.id}`,
      AuditService.name,
      { recordId: record.id },
    );
  }

  async getLogs(filterDto: GetAuditLogsDto): Promise<AuditLog[]> {
    this.dbLogger.log(
      'AuditService.getLogs() – fetching audit records',
      AuditService.name,
      { filterDto },
    );

    const { userId, action, entity, entityId, from, to } = filterDto;

    const qb = this.repo
      .createQueryBuilder('audit')
      .leftJoinAndSelect('audit.user', 'user');

    if (userId) qb.andWhere('audit.userId = :userId', { userId });
    if (action) qb.andWhere('audit.action = :action', { action });
    if (entity) qb.andWhere('audit.entity = :entity', { entity });
    if (entityId) qb.andWhere('audit.entityId = :entityId', { entityId });
    if (from) qb.andWhere('audit.timestamp >= :from', { from });
    if (to) qb.andWhere('audit.timestamp <= :to', { to });
    qb.orderBy('audit.timestamp', 'DESC');
    const results = await qb.getMany();

    this.dbLogger.log(
      `AuditService.getLogs() – found ${results.length} records`,
      AuditService.name,
      { count: results.length },
    );

    return results;
  }

  async getLogById(id: string): Promise<AuditLog> {
    this.dbLogger.log(
      `AuditService.getLogById() – looking up ${id}`,
      AuditService.name,
      { logId: id },
    );

    const log = await this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!log) {
      this.dbLogger.warn(
        `AuditService.getLogById() – not found ${id}`,
        AuditService.name,
        { logId: id },
      );
      throw new NotFoundException(`Audit log ${id} not found`);
    }

    this.dbLogger.log(
      `AuditService.getLogById() – returning record ${id}`,
      AuditService.name,
      { log },
    );

    return log;
  }
}
