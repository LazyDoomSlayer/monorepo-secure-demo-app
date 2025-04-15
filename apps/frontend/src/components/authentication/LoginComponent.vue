<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card width="400" class="pa-6 rounded-lg elevation-4">
      <v-card-title class="text-h6 text-center mb-4">Sign In</v-card-title>

      <v-form v-model="formValid" @submit.prevent="handleSubmit">
        <v-text-field
          v-model="form.username"
          label="Username"
          :rules="[notEmptyUsername]"
          required
          prepend-icon="person"
        />

        <v-text-field
          v-model="form.password"
          label="Password"
          type="password"
          :rules="[notEmptyPassword]"
          required
          prepend-icon="lock"
        />

        <v-btn :loading="isLoading" type="submit" color="primary" class="mt-4" block>
          Sign In
        </v-btn>

        <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4" dense>
          {{ errorMessage }}
        </v-alert>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { notEmptyPassword, notEmptyUsername } from '@/utils/validators.ts'
import type { AuthCredentials } from '@/types/modules/authentication.types.ts'
import { signIn } from '@/modules/authentication.ts'
import { useRouter } from 'vue-router'

const formValid = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const form = ref<AuthCredentials>({
  username: '',
  password: '',
})
const router = useRouter()

async function handleSubmit() {
  if (!formValid.value) return

  errorMessage.value = ''
  isLoading.value = true

  try {
    const tokens = await signIn(form.value)

    localStorage.setItem('user_access_token', tokens.accessToken)
    localStorage.setItem('refresh_token', tokens.refreshToken)

    router.push({ name: 'home' })
  } catch (err) {
    errorMessage.value = (err as Error).message || 'Login failed'
  } finally {
    isLoading.value = false
  }
}
</script>
