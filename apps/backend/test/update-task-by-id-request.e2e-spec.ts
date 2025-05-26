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
    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send(credentials);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    accessToken = res.body.accessToken;

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

  it('should update the task title and description', async () => {
    const updatedData = {
      title: 'Updated Title',
      description: 'Updated Description',
    };

    const res = await request(app.getHttpServer())
      .patch(`/tasks/${createdTaskId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updatedData)
      .expect(200);

    expect(res.body.id).toBe(createdTaskId);
    expect(res.body.title).toBe(updatedData.title);
    expect(res.body.description).toBe(updatedData.description);
  });

  it('should return 404 for invalid task ID', async () => {
    await request(app.getHttpServer())
      .patch(`/tasks/${uuidv4()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Should Fail' })
      .expect(404);
  });
});
