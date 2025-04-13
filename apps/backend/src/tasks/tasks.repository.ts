import { Repository, DataSource } from 'typeorm';
import { Task } from './task.entity';
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dtos/create-task.dto';
import { ETaskStatus } from './task-status.enum';
import { FilterTasksDto } from './dtos/filter-tasks.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private _dataSource: DataSource) {
    super(Task, _dataSource.createEntityManager());
  }

  async getTasks(filterDto: FilterTasksDto, user: User): Promise<Task[]> {
    const { status, title, description } = filterDto;
    const query = this.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (title) {
      query.andWhere('LOWER(task.title) LIKE LOWER(:title)', {
        title: `%${title}%`,
      });
    }

    if (description) {
      query.andWhere('LOWER(task.description) LIKE LOWER(:description)', {
        description: `%${description}%`,
      });
    }

    const tasks = await query.getMany();

    return tasks;
  }

  async findById(id: string, user: User): Promise<Task | null> {
    return await this.findOne({ where: { id, user } });
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      user,
      // params
      title,
      description,
      status: ETaskStatus.OPEN,
    });

    await this.save(task);

    return task;
  }

  async deleteTask(id: string) {
    return await this.delete(id);
  }
}
