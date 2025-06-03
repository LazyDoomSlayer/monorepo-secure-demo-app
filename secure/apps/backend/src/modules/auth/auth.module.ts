import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UsersRepository} from './repositories/user.repository';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './entities/user.entity';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {JwtStrategy} from './strategies/jwt.strategy';
import {RolesGuard} from './guards/roles.guard';
import {AdminSeederService} from './services/admin-seeder.service';
import {LogModule} from '../logging/logging.module';

@Module({
    imports: [
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.register({
            secret: process.env.JWT_SECRET, // instead of private to be easier
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
export class AuthModule {
}
