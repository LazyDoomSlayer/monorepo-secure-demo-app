import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from '../src/modules/auth/auth.controller';
import { TasksController } from '../src/modules/tasks/tasks.controller';
import { TasksModule } from '../src/modules/tasks/tasks.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

describe('AppController (e2e)', () => {
  let authController: AuthController;
  let app: INestApplication;
  let accessToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env'],
          isGlobal: true,
        }),
        AppModule,
        TasksModule,
      ],
    }).compile();

    authController = moduleFixture.get<AuthController>(AuthController);
    app = moduleFixture.createNestApplication();
    await app.init();

    const credentials = {
      username: uuidv4(),
      password: 'P@ssw0rd123',
    };
    await authController.signUp(credentials);
    const response = await authController.signIn(credentials);
    accessToken = response.accessToken;
  });
  afterAll(async () => {
    await app.close();
  });

  it('should create a task successfully', async () => {
    const newTask = {
      title: 'Test Task',
      description: 'This is a test task',
    };

    const res = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newTask)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(newTask.title);
    expect(res.body.description).toBe(newTask.description);
    expect(res.body.status).toBeDefined(); // assuming default status is set
  });
});
