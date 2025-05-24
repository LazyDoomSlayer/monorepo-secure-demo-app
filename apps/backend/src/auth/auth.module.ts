import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from '../assets/constants';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { AdminSeederService } from './admin-seeder.service';
import { LogModule } from '../logging/logging.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: JWT_SECRET, // instead of private to be easier
      signOptions: {
        expiresIn: 3_600, // 1hour
      },
    }),
    TypeOrmModule.forFeature([User]),
    LogModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersRepository,
    JwtStrategy,
    RolesGuard,
    AdminSeederService,
  ],
  exports: [JwtStrategy, PassportModule, RolesGuard],
})
export class AuthModule {}
