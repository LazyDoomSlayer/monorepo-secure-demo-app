<template>
  <v-container fluid>
    <!-- Header with title and "New Task" button -->
    <v-row align="center" justify="space-between" class="mb-4">
      <v-col>
        <h1 class="text-h5">Task Management</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary"> New Task</v-btn>
      </v-col>
    </v-row>

    <!-- Tasks Table -->
    <v-data-table :items="auditLogs" class="elevation-1">
      <template #item.actions="{ item }">
        <v-btn icon>
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon color="red">delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Create / Edit Task Dialog -->
    <!--    <v-dialog v-model="dialog" max-width="500">-->
    <!--      <v-card>-->
    <!--        <v-card-title>-->
    <!--          <span class="text-h6">{{ editMode ? 'Edit Task' : 'Create Task' }}</span>-->
    <!--        </v-card-title>-->

    <!--        <v-card-text>-->
    <!--          <v-form ref="taskForm" v-model="formValid" lazy-validation>-->
    <!--            <v-text-field v-model="form.title" label="Task Title" :rules="[notEmpty]" required />-->
    <!--            <v-textarea v-model="form.description" label="Description" />-->
    <!--            <v-select-->
    <!--              v-model="form.status"-->
    <!--              :items="statusOptions"-->
    <!--              label="Status"-->
    <!--              :rules="[notEmpty]"-->
    <!--              required-->
    <!--            />-->
    <!--          </v-form>-->
    <!--        </v-card-text>-->

    <!--        <v-card-actions>-->
    <!--          <v-spacer></v-spacer>-->
    <!--          <v-btn text>Cancel</v-btn>-->
    <!--          <v-btn color="primary" :disabled="!formValid">-->
    <!--            {{ editMode ? 'Update' : 'Create' }}-->
    <!--          </v-btn>-->
    <!--        </v-card-actions>-->
    <!--      </v-card>-->
    <!--    </v-dialog>-->
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { AuditLogResponse } from '@/types/modules/audit-logs.types.ts'
import { getAllAuditLogs } from '@/modules/audit.ts'

// Reactive state for tasks
const auditLogs = ref<AuditLogResponse[]>([])

// Dialog control and form state
const dialog = ref(false)
const editMode = ref(false)
const formValid = ref(false)
const taskForm = ref<HTMLElement | null>(null)

// Options for status; adjust if your API offers different statuses
const statusOptions = ['OPEN', 'IN_PROGRESS', 'DONE']

// Validation rule: field must not be empty.
const notEmpty = (value: string): true | string =>
  (!!value && value.trim() !== '') || 'This field is required.'

// Table headers definition
const headers = [
  { text: 'Username', value: 'username' },
  { text: 'Action', value: 'action', sortable: false },
  { text: 'Timestamp', value: 'timestamp' },
  // { text: 'Actions', value: 'actions', sortable: false },
]

// Fetch tasks on component mount
async function fetchTasks() {
  try {
    auditLogs.value = await getAllAuditLogs()
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchTasks()
})
</script>

<style scoped>
/* Optional custom styling */
</style>
