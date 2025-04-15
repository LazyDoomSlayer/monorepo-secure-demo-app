import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AuthenticationView from '@/views/AuthenticationView.vue'
import { authMiddleware, notFoundMiddleware } from '@/middleware'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { authRequired: true },
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthenticationView,
      meta: { guestOnly: true },
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/authentication/LoginView.vue'),
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/authentication/RegisterView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach(async (to, _from, next) => {
  notFoundMiddleware(to, next)
  await authMiddleware(to, next)
})

export default router
