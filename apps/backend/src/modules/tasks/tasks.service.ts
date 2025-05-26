import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { TasksRepository } from './repositories/tasks.repository';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { FilterTasksDto } from './dtos/filter-tasks.dto';
import { User } from '../auth/entities/user.entity';
import { AuditService } from '../audit/audit.service';
import { DatabaseLogger } from '../logging/logging.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly auditService: AuditService,
    private readonly dbLogger: DatabaseLogger,
  ) {}

  async getTasks(filterDto: FilterTasksDto, user: User): Promise<Task[]> {
    this.dbLogger.verbose(
      'TasksService.getTasks() – fetching tasks',
      TasksService.name,
      { userId: user.id, filter: filterDto },
    );
    const tasks = await this.tasksRepository.getTasks(filterDto, user);
    // Audit read for each returned task
    await Promise.all(
      tasks.map((task) =>
        this.auditService.log({
          userId: user.id,
          action: 'read',
          entity: 'Task',
          entityId: task.id,
          after: task,
        }),
      ),
    );

    this.dbLogger.verbose(
      'TasksService.getTasks() – fetched tasks',
      TasksService.name,
      { userId: user.id, count: tasks.length },
    );

    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = await this.tasksRepository.createTask(createTaskDto, user);
    await this.auditService.log({
      userId: user.id,
      action: 'create',
      entity: 'Task',
      entityId: task.id,
      after: task,
    });
    return task;
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findById(id, user);

    if (!found) {
      throw new NotFoundException(`Task could not be found with id: ${id}`);
    }

    await this.auditService.log({
      userId: user.id,
      action: 'read',
      entity: 'Task',
      entityId: found.id,
      after: found,
    });

    return found;
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    this.dbLogger.warn(
      `TasksService.deleteTaskById() – deleting task`,
      TasksService.name,
      { userId: user.id, taskId: id },
    );

    // Fetch before deletion for audit
    const task = await this.getTaskById(id, user);

    await this.tasksRepository.delete({ id, user });
    await this.auditService.log({
      userId: user.id,
      action: 'delete',
      entity: 'Task',
      entityId: id,
      before: task,
    });

    this.dbLogger.log(
      'TasksService.deleteTaskById() – deleted task',
      TasksService.name,
      { userId: user.id, taskId: id },
    );
  }

  async updateTaskById(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    this.dbLogger.verbose(
      `TasksService.updateTaskById() – updating task`,
      TasksService.name,
      { userId: user.id, taskId: id, update: updateTaskDto },
    );

    const task = await this.getTaskById(id, user);
    const before = { ...task };

    task.title = updateTaskDto.title;
    task.description = updateTaskDto.description;
    task.status = updateTaskDto.status;

    const updated = await this.tasksRepository.save(task);
    await this.auditService.log({
      userId: user.id,
      action: 'update',
      entity: 'Task',
      entityId: id,
      before,
      after: updated,
    });

    this.dbLogger.verbose(
      'TasksService.updateTaskById() – task updated',
      TasksService.name,
      { userId: user.id, taskId: id },
    );

    return updated;
  }
}
