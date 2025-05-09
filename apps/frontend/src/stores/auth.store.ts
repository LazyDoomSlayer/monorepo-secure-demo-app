import { ref } from 'vue'

import { defineStore } from 'pinia'
import type { ERole } from '@/middleware'

export interface IUserData {
  role: ERole
  sub: string
  exp: number
  username: string
}

export const useAuthStore = defineStore('user', () => {
  const authUser = ref<IUserData | null>(null)

  function setUser(user: IUserData | null): void {
    authUser.value = user
  }

  return {
    authUser,
    setUser,
  }
})
