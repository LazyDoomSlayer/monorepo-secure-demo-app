import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import type { IJwtResponse } from './types/jwt-payload.interface';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { DatabaseLogger } from '../logging/logging.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly dbLogger: DatabaseLogger,
  ) {}

  @Post('/signup')
  async signUp(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ msg: string }> {
    const { username } = authCredentialsDto;

    this.dbLogger.log(
      'AuthController.signUp() – attempt',
      AuthController.name,
      { username },
    );

    await this.authService.signUp(authCredentialsDto);

    this.dbLogger.log(
      'AuthController.signUp() – success',
      AuthController.name,
      { username },
    );
    return { msg: 'User was added successfully' };
  }

  @Post('/signin')
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<IJwtResponse> {
    const { username } = authCredentialsDto;
    this.dbLogger.log(
      'AuthController.signIn() – attempt',
      AuthController.name,
      { username: authCredentialsDto.username },
    );
    const tokens = await this.authService.signIn(authCredentialsDto);

    this.dbLogger.log(
      'AuthController.signIn() – success',
      AuthController.name,
      { username },
    );

    return tokens;
  }

  @Post('/signout')
  @UseGuards(AuthGuard())
  async signOut(@Req() req: Request & { user: User }) {
    const user = req.user;
    if (!user?.id) {
      this.dbLogger.warn(
        'AuthController.signOut() – missing or invalid user',
        AuthController.name,
      );
      throw new UnauthorizedException('Invalid or missing token');
    }
    this.dbLogger.log(
      'AuthController.signOut() – attempt',
      AuthController.name,
      { userId: user.id },
    );

    await this.authService.signOut(user.id);

    this.dbLogger.log(
      'AuthController.signOut() – success',
      AuthController.name,
      { userId: user.id },
    );

    return { message: 'Signed out successfully' };
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    this.dbLogger.log(
      'AuthController.refresh() – attempt',
      AuthController.name,
      {},
    );

    const user = await this.authService.getUserByRefreshToken(refreshToken);
    const tokens = await this.authService.generateTokens(user);
    await this.authService.updateRefreshToken(user.id, tokens.refreshToken);

    this.dbLogger.log(
      'AuthController.refresh() – success',
      AuthController.name,
      { userId: user.id },
    );

    return tokens;
  }
}
