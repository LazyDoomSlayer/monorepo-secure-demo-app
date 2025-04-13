import axiosAPICall from '@/modules/axios-interceptor.ts'
import type { AuthCredentials, JwtResponse } from '@/types/modules/authentication.types.ts'
import { handleApiError } from '@/utils'

export async function signUp(payload: AuthCredentials): Promise<void> {
  try {
    await axiosAPICall.post('/auth/signup', payload)
  } catch (err) {
    throw err
  }
}

export async function signIn(payload: AuthCredentials): Promise<JwtResponse> {
  try {
    const response = await axiosAPICall.post<JwtResponse>('/auth/signin', payload)
    console.log('response', response)
    return response.data
  } catch (err) {
    throw err
  }
}

export async function refreshToken(refreshToken: string): Promise<JwtResponse> {
  try {
    const response = await axiosAPICall.post<JwtResponse>('/auth/refresh', { refreshToken })
    return response.data
  } catch (err) {
    throw err
  }
}
