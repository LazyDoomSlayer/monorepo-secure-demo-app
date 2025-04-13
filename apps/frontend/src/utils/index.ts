import axiosAPICall from '@/modules/axios-interceptor.ts'
import type { AxiosError } from 'axios'

export function handleApiError(error: unknown): never {
  if (axiosAPICall.isAxiosError(error)) {
    const err = error as AxiosError<{ message: string }>
    const message = err.response?.data?.message || 'An error occurred'
    throw new Error(message)
  }

  throw new Error('Unexpected error')
}
