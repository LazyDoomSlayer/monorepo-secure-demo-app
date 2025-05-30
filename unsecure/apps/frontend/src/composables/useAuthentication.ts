// src/composables/useAuth.ts
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { jwtDecode } from 'jwt-decode'

import { refreshToken as apiRefreshToken, signOut } from '@/modules/authentication'
import { signOut as signOutAPI } from '@/modules/authentication'
import { type IUserData, useAuthStore } from '@/stores/auth.store.ts'

const accessToken = useStorage<string | null>('user_access_token', null)
const refreshToken = useStorage<string | null>('refresh_token', null)
const isAuthenticated = ref(!!accessToken.value)

function isExpired(token: string): boolean {
  const authStore = useAuthStore()

  try {
    const response = jwtDecode<IUserData>(token)
    authStore.setUser(response)

    return Date.now() >= response.exp * 1000
  } catch {
    return true
  }
}

export async function initAuth() {
  if (!accessToken.value && !refreshToken.value) return

  if (accessToken.value && !isExpired(accessToken.value)) return

  if (refreshToken.value && !isExpired(refreshToken.value)) {
    try {
      const tokens = await apiRefreshToken(refreshToken.value)
      accessToken.value = tokens.accessToken
      refreshToken.value = tokens.refreshToken
    } catch (err) {
      console.warn('Refresh failed, signing out')
      await signOut()
    }
  } else {
    await signOut()
  }
}

export function useAuth() {
  const router = useRouter()

  async function signOut() {
    try {
      await signOutAPI()
    } catch (err) {
      console.warn('Sign out API failed, clearing tokens anyway')
    }

    accessToken.value = null
    refreshToken.value = null
    isAuthenticated.value = false

    router.push({ name: 'login' })
  }

  function setTokens(access: string, refresh: string) {
    accessToken.value = access
    refreshToken.value = refresh
    isAuthenticated.value = true
  }

  return {
    isAuthenticated,
    accessToken,
    refreshToken,
    signOut,
    setTokens,
  }
}
