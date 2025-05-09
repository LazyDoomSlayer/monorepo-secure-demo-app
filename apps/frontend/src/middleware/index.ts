import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { type IUserData, useAuthStore } from '@/stores/auth.store.ts'

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
  const authStore = useAuthStore()
  const token = localStorage.getItem('user_access_token')

  const isExpired = (jwt: string): boolean => {
    try {
      const response = jwtDecode<IUserData>(jwt)
      authStore.setUser(response)

      return Date.now() >= (response.exp ?? 0) * 1000
    } catch {
      return true
    }
  }
  const tokenExpired = token ? isExpired(token) : true

  if (token && !authStore.authUser) {
    try {
      // await authStore.fetchCurrentUser()
    } catch (err) {
      localStorage.removeItem('user_access_token')
      return next({ name: 'login' })
    }
  }

  if (to.matched.some((r) => r.meta.authRequired) && (!token || tokenExpired)) {
    return next({ name: 'login' })
  }

  if (to.matched.some((r) => r.meta.guestOnly) && token && !tokenExpired) {
    if (to.name !== 'home') {
      return next({ name: 'home' })
    }
    return next()
  }

  const allowedRoles = Array.isArray(to.meta.roles) ? (to.meta.roles as string[]) : []
  if (allowedRoles.length > 0) {
    const userRole = authStore.authUser?.role
    if (!userRole || !allowedRoles.includes(userRole)) {
      if (to.name !== 'home') {
        return next({ name: 'home' })
      }
      return next()
    }
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
