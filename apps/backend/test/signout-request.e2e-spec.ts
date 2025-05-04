import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { AuthModule } from '../src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from '../src/auth/auth.controller';
import { v4 as uuidv4 } from 'uuid';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
  let authController: AuthController;
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['.env'],
          isGlobal: true,
        }),
        AppModule,
        AuthModule,
      ],
    }).compile();

    authController = moduleFixture.get<AuthController>(AuthController);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should successfully sign out the user.', async () => {
    const user = {
      username: uuidv4(),
      password: 'P@ssw0rd123',
    };
    await authController.signUp(user);
    const signInResponse = await authController.signIn(user);
    const { accessToken } = signInResponse;

    const signOutRes = await request(app.getHttpServer())
      .post('/auth/signout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);

    expect(signOutRes.body.message).toBe('Signed out successfully');
  });
});
