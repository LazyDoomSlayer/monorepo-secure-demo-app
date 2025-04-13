import { ref } from 'vue'

import { defineStore } from 'pinia'

export const useAuthStore = defineStore('user', () => {
  const authUser = ref<object | null>(null)

  function setUser(user: object | null): void {
    authUser.value = user
  }

  async function initAuth(): Promise<void> {
    try {
      throw new Error('mock error')
      // authUser.value = {} // TODO: here
    } catch {
      authUser.value = null
    }
  }

  return {
    authUser,
    initAuth,
    setUser,
  }
})
