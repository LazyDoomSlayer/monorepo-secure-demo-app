import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store.ts'

export const authMiddleware = async (
  to: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> => {
  // const authStore = useAuthStore()
  //
  // if (authStore.authUser === null) {
  //   await authStore.initAuth()
  // }
  const token = localStorage.getItem('user_access_token')

  const authRequired = to.matched.some((record) => record.meta.authRequired)
  const guestOnly = to.matched.some((record) => record.meta.guestOnly)

  // console.log(111, authRequired, authStore.authUser)
  // console.log(2222, guestOnly, authStore.authUser)

  if (authRequired && token === null) {
    next({ name: 'auth' })
  }
  if (guestOnly && token !== null) {
    next({ name: 'home' })
  }
  next()
}

export const notFoundMiddleware = (
  to: RouteLocationNormalized,
  next: NavigationGuardNext,
): void => {
  if (to.matched.length !== 0) return

  const authStore = useAuthStore()
  if (authStore.authUser) {
    next({ name: 'home' })
  } else {
    next({ name: 'auth' })
  }
}
