import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './repositories/user.repository';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';

import * as bcrypt from 'bcryptjs';

import { EAuthErrorMessages } from './types/auth.enum';
import { JwtService } from '@nestjs/jwt';
import type { IJwtResponse } from './types/jwt-payload.interface';
import { User } from './entities/user.entity';
import { DatabaseLogger } from '../logging/logging.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
    private readonly dbLogger: DatabaseLogger,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username } = authCredentialsDto;
    this.dbLogger.log('AuthService.signUp() – attempt', AuthService.name, {
      username,
    });

    const response = await this.usersRepository.createUser(authCredentialsDto);

    this.dbLogger.log('AuthService.signUp() – user created', AuthService.name, {
      username,
    });

    return response;
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<IJwtResponse> {
    const { username, password } = authCredentialsDto;
    this.dbLogger.log('AuthService.signIn() – attempt', AuthService.name, {
      username,
    });

    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && password === user.password) {
      this.dbLogger.log(
        'AuthService.signIn() – credentials valid',
        AuthService.name,
        { userId: user.id },
      );

      const tokens = this.generateTokens(user);

      this.dbLogger.log(
        'AuthService.signIn() – tokens generated',
        AuthService.name,
        { userId: user.id },
      );
      await this.updateRefreshToken(user.id, tokens.refreshToken);

      this.dbLogger.log(
        'AuthService.signIn() – refresh token updated',
        AuthService.name,
        { userId: user.id },
      );

      return tokens;
    }

    if (!user) {
      this.dbLogger.warn(
        'AuthService.signIn() – user not found',
        AuthService.name,
        { username },
      );
      throw new UnauthorizedException('Username does not exist');
    }

    if (user.password !== password) {
      this.dbLogger.warn(
        'AuthService.signIn() – invalid password',
        AuthService.name,
        { username },
      );
      throw new UnauthorizedException('Incorrect password');
    }

    throw new UnauthorizedException(EAuthErrorMessages.WRONG_CREDENTIALS);
  }

  async signOut(userId: string): Promise<void> {
    this.dbLogger.log('AuthService.signOut() – attempt', AuthService.name, {
      userId,
    });

    await this.usersRepository.update(userId, { refreshToken: null });

    this.dbLogger.log(
      'AuthService.signOut() – refresh token cleared',
      AuthService.name,
      { userId },
    );
  }

  generateTokens(user: User) {
    this.dbLogger.log(
      'AuthService.generateTokens() – creating JWTs',
      AuthService.name,
      { userId: user.id },
    );

    const payload = {
      username: user.username,
      sub: user.id,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: 'my-even-more-secret-refresh-key-123456789',
      expiresIn: '356d',
    });
    this.dbLogger.log(
      'AuthService.generateTokens() – tokens created',
      AuthService.name,
      { userId: user.id },
    );

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    this.dbLogger.log(
      'AuthService.updateRefreshToken() – hashing & saving',
      AuthService.name,
      { userId },
    );

    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, { refreshToken: hashedToken });

    this.dbLogger.log(
      'AuthService.updateRefreshToken() – saved hashed token',
      AuthService.name,
      { userId },
    );
  }

  async getUserByRefreshToken(token: string): Promise<User> {
    this.dbLogger.log(
      'AuthService.getUserByRefreshToken() – lookup start',
      AuthService.name,
      {},
    );
    const users = await this.usersRepository.find(); // fetch all users with tokens
    for (const user of users) {
      if (!user.refreshToken) continue;

      const isMatch = await bcrypt.compare(token, user.refreshToken);
      if (isMatch) {
        this.dbLogger.log(
          'AuthService.getUserByRefreshToken() – match found',
          AuthService.name,
          { userId: user.id },
        );

        return user;
      }
    }

    this.dbLogger.warn(
      'AuthService.getUserByRefreshToken() – invalid token',
      AuthService.name,
    );
    throw new UnauthorizedException('Invalid refresh token');
  }
}
