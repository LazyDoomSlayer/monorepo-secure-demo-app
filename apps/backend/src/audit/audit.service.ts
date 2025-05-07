import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

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
}
