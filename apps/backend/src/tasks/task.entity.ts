import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ETaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: ETaskStatus,
    default: ETaskStatus.OPEN,
  })
  status: ETaskStatus;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((_type) => User, (user) => user.tasks, { eager: false })
  @Exclude({
    toPlainOnly: true,
  })
  user: User;
}
