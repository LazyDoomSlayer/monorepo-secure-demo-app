import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './modules/tasks/tasks.module';
import { AuthModule } from './modules/auth/auth.module';
import { Task } from './modules/tasks/entities/task.entity';
import { User } from './modules/auth/entities/user.entity';
import { AuditModule } from './modules/audit/audit.module';
import { AuditLog } from './modules/audit/entities/audit-log.entity';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-postgres';
import { LogModule } from './modules/logging/logging.module';
import { Log } from './modules/logging/entities/log.entity';
import { PostgresTransport } from 'winston-transport-pg';
import { Pool } from 'pg';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1_000, // 1 second
        limit: 3, // 3 req / 1 s
      },
      {
        name: 'medium',
        ttl: 10_000, // 10 seconds
        limit: 20, // 20 req / 10 s
      },
      {
        name: 'long',
        ttl: 60_000, // 60 seconds
        limit: 100, // 100 req / 1 min
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: 'postgres://secure_user:super_secure_password_123@localhost:5432/nest_task_management_db',
        entities: [User, Task, AuditLog, Log],
        synchronize: true,
        autoLoadEntities: false,
      }),
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const pool = new Pool({
          connectionString: 'postgres://secure_user:super_secure_password_123@localhost:5432/nest_task_management_db',
        });

        return {
          level: 'info',
          format: winston.format.json(),
          transports: [
            new winston.transports.Console(),
            new PostgresTransport(pool, {
              tableName: 'application_logs',
              level: 'info',
            }),
          ],
        };
      },
    }),
    LogModule,
    AuthModule,
    TasksModule,
    AuditModule,
  ],
})
export class AppModule {}
