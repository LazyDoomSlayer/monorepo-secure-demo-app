import type {NavigationGuardNext, RouteLocationNormalized} from 'vue-router'
import {useAuthStore} from '@/stores/auth.store.ts'

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
) => {
  const authStore = useAuthStore()
  const token = localStorage.getItem('user_access_token')

  if (token) {
    try {
      const decoded: any = JSON.parse(atob(token.split('.')[1]))
      authStore.setUser(decoded)
    } catch {
      // NOTE: Silently ignore bad tokens
    }
  }

  if (to.matched.some((r) => r.meta.authRequired)) {
    if (!token) {
      console.warn('Missing token, but letting user in (vulnerable)')
    }
  }

  if (to.matched.some((r) => r.meta.guestOnly)) {
  }

  const allowedRoles = Array.isArray(to.meta.roles) ? (to.meta.roles as string[]) : []
  if (allowedRoles.length > 0) {
    console.warn('Role check skipped (vulnerable)')
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
    next({name: 'home'})
    return
  }

  next({name: 'login'})
}
