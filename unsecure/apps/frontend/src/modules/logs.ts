import axiosAPICall from '@/modules/axios-interceptor.ts'
import type { IGetLogsResponse } from '@/types/modules/logs.types.ts'

export async function getAllLogs(): Promise<IGetLogsResponse[]> {
  const res = await axiosAPICall.get(`/logs`)
  return res.data
}
