// src/composables/useAuth.ts
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStorage } from '@vueuse/core'
import { signOut as signOutAPI } from '@/modules/authentication'

const accessToken = useStorage<string | null>('user_access_token', null)
const refreshToken = useStorage<string | null>('refresh_token', null)
const isAuthenticated = ref(!!accessToken.value)

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

    router.push({ name: 'auth' })
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
