import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './log.entity';
import { DatabaseLogger } from './logging.service';
import { LoggingController } from './logging.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([Log])],
  providers: [DatabaseLogger],
  exports: [DatabaseLogger],
  controllers: [LoggingController],
})
export class LogModule {}
