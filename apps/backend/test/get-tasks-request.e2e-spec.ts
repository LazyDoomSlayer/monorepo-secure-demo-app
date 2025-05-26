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

  it('should return an array of tasks (initially empty)', async () => {
    const res = await request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});
