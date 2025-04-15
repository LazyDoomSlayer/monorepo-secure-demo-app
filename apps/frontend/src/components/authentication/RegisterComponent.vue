<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card width="400" class="pa-6 rounded-lg elevation-4">
      <v-card-title class="text-h6 text-center mb-4">Register</v-card-title>

      <v-form v-model="formValid" @submit.prevent="handleSubmit">
        <v-text-field
          data-cy="register-username"
          v-model="form.username"
          label="Username"
          :rules="[notEmptyUsername]"
          required
          prepend-icon="person"
        />

        <v-text-field
          data-cy="register-password"
          v-model="form.password"
          label="Password"
          type="password"
          :rules="[notEmptyPassword, strongPassword]"
          required
          prepend-icon="lock"
        />

        <v-text-field
          data-cy="register-repeat-password"
          v-model="repeatPassword"
          label="Repeat Password"
          type="password"
          :rules="[matchPassword]"
          required
          prepend-icon="lock"
        />

        <v-btn
          data-cy="register-submit"
          :loading="isLoading"
          type="submit"
          color="primary"
          class="mt-4"
          block
        >
          Register
        </v-btn>

        <v-alert v-if="errorMessage" type="error" variant="tonal" class="mt-4" dense>
          {{ errorMessage }}
        </v-alert>

        <v-alert v-if="success" type="success" variant="tonal" class="mt-4" dense>
          Registered successfully. You can now log in.
        </v-alert>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signUp } from '@/modules/authentication'
import type { AuthCredentials } from '@/types/modules/authentication.types'

const router = useRouter()

const formValid = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const success = ref(false)

const form = ref<AuthCredentials>({
  username: '',
  password: '',
})

const repeatPassword = ref('')

const notEmptyUsername = (value: unknown): true | string =>
  !!value || 'Username should not be empty.'

const notEmptyPassword = (value: unknown): true | string =>
  !!value || 'Password should not be empty.'

const strongPassword = (value: string): true | string => {
  const pattern = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
  return (
    (value.length >= 8 && value.length <= 64 && pattern.test(value)) ||
    'Password must be 8–64 chars, with uppercase, lowercase, and number/symbol.'
  )
}

const matchPassword = (value: string): true | string =>
  value === form.value.password || 'Passwords do not match.'

async function handleSubmit() {
  if (!formValid.value) return

  errorMessage.value = ''
  success.value = false
  isLoading.value = true

  try {
    await signUp(form.value)
    success.value = true
    form.value.username = ''
    form.value.password = ''
    repeatPassword.value = ''
    router.push({ name: 'login' })
  } catch (err) {
    errorMessage.value = (err as Error).message || 'Registration failed'
  } finally {
    isLoading.value = false
  }
}
</script>
