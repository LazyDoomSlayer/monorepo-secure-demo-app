import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store.ts'

import { jwtDecode } from 'jwt-decode'

export enum ERole {
  User = 'user',
  Admin = 'admin',
}

interface JwtPayload {
  exp: number
  iat: number
  sub: string
  username: string
  role: ERole
}

export const authMiddleware = async (
  to: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> => {
  const token = localStorage.getItem('user_access_token')
  const authRequired = to.matched.some((record) => record.meta.authRequired)
  const guestOnly = to.matched.some((record) => record.meta.guestOnly)
  console.log('to roles', to.meta.roles)
  const isExpired = (jwt: string): boolean => {
    try {
      const { exp } = jwtDecode<JwtPayload>(jwt)
      return Date.now() >= exp * 1000
    } catch {
      return true
    }
  }

  const tokenExpired = token ? isExpired(token) : true

  if (authRequired && (!token || tokenExpired)) {
    next({ name: 'login' })
    return
  }

  if (guestOnly && token && !tokenExpired) {
    next({ name: 'home' })
    return
  }

  return next()
}

export const notFoundMiddleware = (
  to: RouteLocationNormalized,
  next: NavigationGuardNext,
): void => {
  if (to.matched.length !== 0) return

  const authStore = useAuthStore()
  if (authStore.authUser) {
    next({ name: 'home' })
    return
  }

  next({ name: 'login' })
}
