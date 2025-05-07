import { Expose, Type } from 'class-transformer';

class TaskSnapshotDto {
  @Expose() id: string;
  @Expose() title: string;
  @Expose() description: string;
  @Expose() status: string;
}

export class AuditLogResponseDto {
  @Expose() id: string;
  @Expose() userId: string;
  @Expose() username: string;
  @Expose() action: 'create' | 'read' | 'update' | 'delete';
  @Expose() entity: string;
  @Expose() entityId: string;
  @Expose() @Type(() => TaskSnapshotDto) before?: TaskSnapshotDto;
  @Expose() @Type(() => TaskSnapshotDto) after?: TaskSnapshotDto;
  @Expose() timestamp: Date;
}
