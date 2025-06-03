import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { FilterTasksDto } from './dtos/filter-tasks.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { DatabaseLogger } from '../logging/logging.service';

@Controller('tasks')
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(
    private tasksService: TasksService,
    private readonly dbLogger: DatabaseLogger,
  ) {}

  @Get()
  async getTasks(
    @Query() filterTasksDto: FilterTasksDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.dbLogger.verbose(
      'GET /tasks – retrieving tasks',
      TasksController.name,
      { user: user.username, filter: filterTasksDto },
    );
    const tasks = await this.tasksService.getTasks(filterTasksDto, user);
    this.dbLogger.verbose('→ returned tasks', TasksController.name, {
      user: user.username,
      count: tasks.length,
    });

    return tasks;
  }

  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    this.dbLogger.verbose(
      `GET /tasks/${id} – retrieving task`,
      TasksController.name,
      { user: user.username, taskId: id },
    );

    this.logger.verbose(`User "${user.username}" retriving task by id: ${id}`);
    const task = await this.tasksService.getTaskById(id, user);

    this.dbLogger.verbose('→ returned task', TasksController.name, {
      user: user.username,
      taskId: id,
    });
    return task;
  }

  @Delete('/:id')
  async deleteTaskById(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    this.dbLogger.warn(
      `DELETE /tasks/${id} – deleting task`,
      TasksController.name,
      { user: user.username, taskId: id },
    );

    this.logger.verbose(`User "${user.username}" deleting task by id: ${id}`);
    const response = await this.tasksService.deleteTaskById(id, user);
    this.dbLogger.log('→ task deleted', TasksController.name, {
      user: user.username,
      taskId: id,
    });

    return response;
  }

  @Patch('/:id')
  async updateTaskById(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.dbLogger.verbose(
      `PATCH /tasks/${id} – updating task`,
      TasksController.name,
      { user: user.username, taskId: id, update: updateTaskDto },
    );

    const response = this.tasksService.updateTaskById(id, updateTaskDto, user);

    this.dbLogger.verbose('→ task updated', TasksController.name, {
      user: user.username,
      taskId: id,
    });

    return response;
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.dbLogger.log('POST /tasks – creating task', TasksController.name, {
      user: user.username,
      payload: createTaskDto,
    });

    const task = await this.tasksService.createTask(createTaskDto, user);

    this.dbLogger.log('→ task created', TasksController.name, {
      user: user.username,
      taskId: task.id,
    });

    return task;
  }
}
