import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { AuthModule } from '../src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from '../src/auth/auth.controller';
import { v4 as uuidv4 } from 'uuid';

describe('AppController (e2e)', () => {
  let authController: AuthController;

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
  });

  it('Should successfully register the user.', async () => {
    const user = {
      username: uuidv4(),
      password: 'P@ssw0rd123',
    };
    const response = await authController.signUp(user);

    expect(response.msg).toBe('User was added successfully');
  });
});
