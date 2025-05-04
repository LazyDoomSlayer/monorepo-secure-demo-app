import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
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

  it('Should successfully refresh token for the use.', async () => {
    const user = {
      username: uuidv4(),
      password: 'P@ssw0rd123',
    };
    await authController.signUp(user);
    const signInResponse = await authController.signIn(user);
    const { refreshToken } = signInResponse;
    const refreshResponse = await authController.refresh(refreshToken);

    expect(refreshResponse.accessToken).toBeDefined();
    expect(typeof refreshResponse.accessToken).toBe('string');

    expect(refreshResponse.refreshToken).toBeDefined();
    expect(typeof refreshResponse.refreshToken).toBe('string');
  });
});
