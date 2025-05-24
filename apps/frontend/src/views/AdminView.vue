<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
    <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/82.jpg" title="Admin" nav>
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
      <v-list-item prepend-icon="person" title="Admin" value="Admin"></v-list-item>
      <v-list-item prepend-icon="logout" title="Logout" @click="signOut" />
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <audit-logs-management />
    <logging-management />
  </v-main>
</template>

<script setup lang="ts">
import { initAuth, useAuth } from '@/composables/useAuthentication.ts'

const { signOut } = useAuth()

import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAllAuditLogs } from '@/modules/audit.ts'
import AuditLogsManagement from '@/components/audit/AuditLogsManagement.vue'
import LoggingManagement from '@/components/logging/logging-management.vue'

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
onBeforeMount(async () => {
  await initAuth()
  const data = await getAllAuditLogs()
  console.log('data', data)
})
</script>
