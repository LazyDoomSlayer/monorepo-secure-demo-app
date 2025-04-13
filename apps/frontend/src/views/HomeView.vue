<script setup lang="ts">
import { useAuth } from '@/composables/useAuthentication.ts'

const { signOut } = useAuth()
</script>

<template>
  <div>
    <v-btn @click="signOut" title="Sign out"> sign Out</v-btn>
  </div>
</template>
