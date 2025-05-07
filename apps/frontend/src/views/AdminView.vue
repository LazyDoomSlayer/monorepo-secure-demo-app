<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
    <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/82.jpg" title="Admin" nav>
      <template v-slot:append>
        <v-btn icon="arrow_left" variant="text" @click.stop="rail = !rail"></v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav v-model:selected="selectedValue">
      <v-list-item prepend-icon="logout" title="Logout" @click="signOut" />
    </v-list>
  </v-navigation-drawer>

  <v-main> admin content here </v-main>
</template>

<script setup lang="ts">
import { initAuth, useAuth } from '@/composables/useAuthentication.ts'

const { signOut } = useAuth()

import { onBeforeMount, ref } from 'vue'

const drawer = ref(true)
const rail = ref(true)
const selectedValue = ref<string>('home')

onBeforeMount(() => {
  initAuth()
})
</script>
