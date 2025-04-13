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
      <v-list-item prepend-icon="home" title="Home" value="home"></v-list-item>
      <v-list-item prepend-icon="logout" title="Logout" @click="signOut" />
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <task-management />
  </v-main>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuthentication.ts'

const { signOut } = useAuth()

import { ref } from 'vue'
import TaskManagement from '@/components/TaskManagement.vue'

const drawer = ref(true)
const rail = ref(true)
const selectedValue = ref<string>('home')
</script>
