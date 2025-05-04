import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from '../src/auth/auth.controller';
import { TasksController } from '../src/tasks/tasks.controller';
import { TasksModule } from '../src/tasks/tasks.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

describe('AppController (e2e)', () => {
  let authController: AuthController;
  let app: INestApplication;
  let accessToken: string;
  let createdTaskId: string;

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

    // Create a task to fetch later
    const taskRes = await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Fetchable Task',
        description: 'Task to fetch by ID',
      });

    createdTaskId = taskRes.body.id;
  });
  afterAll(async () => {
    await app.close();
  });

  it('should delete the task by ID', async () => {
    await request(app.getHttpServer())
      .delete(`/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    // Confirm it's deleted
    await request(app.getHttpServer())
      .get(`/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });

  it('should return 404 for non-existent task', async () => {
    await request(app.getHttpServer())
      .delete(`/tasks/${uuidv4()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });
});
