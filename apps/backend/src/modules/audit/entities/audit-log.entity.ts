import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string; // who did it

  @Column()
  action: 'create' | 'read' | 'update' | 'delete';

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

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
