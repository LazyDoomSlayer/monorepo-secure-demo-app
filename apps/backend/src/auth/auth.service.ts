import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

import * as bcrypt from 'bcryptjs';

import { EAuthErrorMessages } from './auth.enum';
import { JwtService } from '@nestjs/jwt';
import type { IJwtPayload, IJwtResponse } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return await this.usersRepository.createUser(authCredentialsDto);
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<IJwtResponse> {
    const { username, password } = authCredentialsDto;

    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const tokens = await this.generateTokens(user);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return tokens;
    }

    throw new UnauthorizedException(EAuthErrorMessages.WRONG_CREDENTIALS);
  }

  async signOut(userId: string): Promise<void> {
    await this.usersRepository.update(userId, { refreshToken: null });
  }

  async generateTokens(user: User) {
    const payload = {
      username: user.username,
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, { refreshToken: hashedToken });
  }

  async getUserByRefreshToken(token: string): Promise<User> {
    const users = await this.usersRepository.find(); // fetch all users with tokens
    for (const user of users) {
      if (!user.refreshToken) continue;

      const isMatch = await bcrypt.compare(token, user.refreshToken);
      if (isMatch) return user;
    }
    throw new UnauthorizedException('Invalid refresh token');
  }
}
