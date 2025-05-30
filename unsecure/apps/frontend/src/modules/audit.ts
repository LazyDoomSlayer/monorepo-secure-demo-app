import axiosAPICall from '@/modules/axios-interceptor.ts'
import type { AuditLogResponse } from '@/types/modules/audit-logs.types.ts'

export async function getAllAuditLogs(): Promise<AuditLogResponse[]> {
  const res = await axiosAPICall.get(`/audit`)
  return res.data
}
