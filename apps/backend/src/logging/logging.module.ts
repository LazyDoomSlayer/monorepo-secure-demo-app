import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './log.entity';
import { DatabaseLogger } from './logging.service';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [DatabaseLogger],
  exports: [DatabaseLogger],
})
export class LogModule {}
