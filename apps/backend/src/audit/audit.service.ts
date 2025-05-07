import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';
import { GetAuditLogsDto } from './get-audit-logs.dto';
import { NotFoundException } from '@nestjs/common';

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
  ) {}

  async log(entry: AuditEntry) {
    const record = this.repo.create(entry);
    await this.repo.save(record);
  }

  async getLogs(filterDto: GetAuditLogsDto): Promise<AuditLog[]> {
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
    return qb.getMany();
  }

  async getLogById(id: string): Promise<AuditLog> {
    const log = await this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!log) throw new NotFoundException(`Audit log ${id} not found`);
    return log;
  }
}
