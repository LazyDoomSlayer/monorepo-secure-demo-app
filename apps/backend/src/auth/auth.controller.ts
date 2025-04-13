import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import type { IJwtResponse } from './jwt-payload.interface';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<IJwtResponse> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/signout')
  @UseGuards(AuthGuard())
  async signOut(@Req() req: Request & { user: User }) {
    const user = req.user;
    if (!user || !user.id) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    await this.authService.signOut(user.id);
    return { message: 'Signed out successfully' };
  }

  @Post('/adminstuff')
  @UseGuards(AuthGuard())
  adminstuff(@Req() req) {
    console.log(req);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    const user = await this.authService.getUserByRefreshToken(refreshToken);
    const tokens = await this.authService.generateTokens(user);
    await this.authService.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
