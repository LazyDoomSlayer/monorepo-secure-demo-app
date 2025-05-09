<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
    <v-list-item
      prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
      title="John Doe"
      nav
    >
      <template v-slot:append>
        <v-btn icon="arrow_left" variant="text" @click.stop="rail = !rail"></v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav v-model:selected="selectedValue">
      <v-list-item
        prepend-icon="home"
        title="Home"
        value="home"
        @click.left="goToHome"
      ></v-list-item>
      <v-list-item
        prepend-icon="task"
        title="Task Management"
        value="Task Management"
      ></v-list-item>
      <v-list-item prepend-icon="logout" title="Logout" @click="signOut" />
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <task-management />
  </v-main>
</template>

<script setup lang="ts">
import { initAuth, useAuth } from '@/composables/useAuthentication.ts'

const { signOut } = useAuth()

import { onBeforeMount, ref } from 'vue'
import TaskManagement from '@/components/TaskManagement.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store.ts'

const drawer = ref(true)
const rail = ref(true)
const selectedValue = ref<string>('home')

const router = useRouter()

async function goToHome() {
  try {
    await router.push({ name: 'home' })
  } catch (e) {
    console.error(e)
  }
}

onBeforeMount(() => {
  initAuth()
})
</script>
