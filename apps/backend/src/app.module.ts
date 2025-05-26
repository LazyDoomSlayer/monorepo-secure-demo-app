import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './modules/tasks/tasks.module';
import { AuthModule } from './modules/auth/auth.module';
import { Task } from './modules/tasks/task.entity';
import { User } from './modules/auth/user.entity';
import { AuditModule } from './modules/audit/audit.module';
import { AuditLog } from './modules/audit/audit-log.entity';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-postgres';
import { LogModule } from './modules/logging/logging.module';
import { Log } from './modules/logging/log.entity';
import { PostgresTransport } from 'winston-transport-pg';
import { Pool } from 'pg';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: config.get('POSTGRES_USER'),
        password: config.get('POSTGRES_PASSWORD'),
        database: config.get('POSTGRES_DB'),
        entities: [User, Task, AuditLog, Log],
        synchronize: true,
        autoLoadEntities: false,
      }),
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // 1) Create a pg Pool
        const pool = new Pool({
          connectionString: config.get('DATABASE_URL'),
        });

        // 2) Build your Winston options
        return {
          level: 'info',
          format: winston.format.json(),
          transports: [
            new winston.transports.Console(),
            // 3) Instantiate the PG transport with pool + opts
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
