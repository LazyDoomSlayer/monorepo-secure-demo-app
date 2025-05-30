import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('application_logs')
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  level: 'log' | 'error' | 'warn' | 'debug' | 'verbose';

  @Column()
  context: string;

  @Column('text')
  message: string;

  @Column({ type: 'jsonb', nullable: true })
  meta?: any;

  @CreateDateColumn()
  timestamp: Date;
}
