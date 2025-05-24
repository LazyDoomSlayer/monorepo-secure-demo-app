import { Expose } from 'class-transformer';

export class LogResponseDto {
  @Expose() id: string;
  @Expose() level: string;
  @Expose() context: string;
  @Expose() message: string;
  @Expose() meta?: any;
  @Expose() timestamp: Date;
}
