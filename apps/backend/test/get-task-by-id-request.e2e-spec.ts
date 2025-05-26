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

  it('should retrieve a task by ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', createdTaskId);
    expect(res.body.title).toBe('Fetchable Task');
    expect(res.body.description).toBe('Task to fetch by ID');
  });

  it('should return 404 for a non-existent task ID', async () => {
    const nonExistentId = uuidv4(); // random UUID that shouldn't exist

    await request(app.getHttpServer())
      .get(`/tasks/${nonExistentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(404);
  });
});
