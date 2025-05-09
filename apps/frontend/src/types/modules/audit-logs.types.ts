export interface TaskSnapshot {
  id: string
  title: string
  description: string
  status: string
}

export interface AuditLogResponse {
  id: string
  userId: string
  username: string
  action: 'create' | 'read' | 'update' | 'delete'
  entity: string
  entityId: string
  before?: TaskSnapshot
  after?: TaskSnapshot
  timestamp: Date
}
