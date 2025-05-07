import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string; // who did it

  @Column()
  action: 'create' | 'read' | 'update' | 'delete';

  @Column()
  entity: string; // e.g. 'Task'

  @Column()
  entityId: string; // the PK of the task

  @Column('jsonb', { nullable: true })
  before: any; // snapshot before change

  @Column('jsonb', { nullable: true })
  after: any; // snapshot after change

  @CreateDateColumn()
  timestamp: Date;
}
