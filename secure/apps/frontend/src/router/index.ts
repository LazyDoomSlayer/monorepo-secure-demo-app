import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AdminView from '@/views/AdminView.vue'
import AuthenticationView from '@/views/AuthenticationView.vue'
import { authMiddleware, ERole, notFoundMiddleware } from '@/middleware'
import { useAuthStore } from '@/stores/auth.store.ts'
import TaskManagement from '@/views/TaskManagement.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { authRequired: true, roles: [ERole.User] },
    },
    {
      path: '/task-management',
      name: 'task-management',
      component: TaskManagement,
      meta: { authRequired: true, roles: [ERole.User] },
    },
    {
      path: '/admin-view',
      name: 'admin-view',
      component: AdminView,
      meta: { authRequired: true, roles: [ERole.Admin] },
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
