<template>
  <v-container fluid>
    <!-- Header with title and "New Task" button -->
    <v-row align="center" justify="space-between" class="mb-4">
      <v-col>
        <h1 class="text-h5">Task Management</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="openCreateDialog"> New Task</v-btn>
      </v-col>
    </v-row>

    <!-- Tasks Table -->
    <v-data-table :headers="headers" :items="tasks" class="elevation-1">
      <template #item.actions="{ item }">
        <v-btn icon @click="openEditDialog(item)">
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn icon @click="confirmDelete(item)">
          <v-icon color="red">delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <!-- Create / Edit Task Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
          <span class="text-h6">{{ editMode ? 'Edit Task' : 'Create Task' }}</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="taskForm" v-model="formValid" lazy-validation>
            <v-text-field v-model="form.title" label="Task Title" :rules="[notEmpty]" required />
            <v-textarea v-model="form.description" label="Description" />
            <v-select
              v-model="form.status"
              :items="statusOptions"
              label="Status"
              :rules="[notEmpty]"
              required
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" :disabled="!formValid" @click="saveTask">
            {{ editMode ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getAllTasks, createTask, updateTask, deleteTask } from '@/modules/tasks.ts'
import type { Task } from '@/types/modules/tasks.types'

// Reactive state for tasks
const tasks = ref<Task[]>([])

// Dialog control and form state
const dialog = ref(false)
const editMode = ref(false)
const formValid = ref(false)
const taskForm = ref<HTMLElement | null>(null)

// Options for status; adjust if your API offers different statuses
const statusOptions = ['OPEN', 'IN_PROGRESS', 'DONE']

// Define the form object. When editing, we'll fill these fields.
const form = reactive({
  id: '',
  title: '',
  description: '',
  status: 'OPEN',
})

// Validation rule: field must not be empty.
const notEmpty = (value: string): true | string =>
  (!!value && value.trim() !== '') || 'This field is required.'

// Table headers definition
const headers = [
  { text: 'Title', value: 'title' },
  { text: 'Description', value: 'description' },
  { text: 'Status', value: 'status' },
  { text: 'Actions', value: 'actions', sortable: false },
]

// Fetch tasks on component mount
async function fetchTasks() {
  try {
    tasks.value = await getAllTasks()
  } catch (err) {
    console.error(err)
  }
}

function openCreateDialog() {
  editMode.value = false
  form.id = ''
  form.title = ''
  form.description = ''
  form.status = 'OPEN'
  dialog.value = true
}

function openEditDialog(task: Task) {
  editMode.value = true
  form.id = task.id
  form.title = task.title
  form.description = task.description || ''
  form.status = task.status
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
}

async function saveTask() {
  if (!formValid.value) return

  try {
    if (editMode.value) {
      const updatedTask = await updateTask(form.id, {
        title: form.title,
        description: form.description,
        status: form.status,
      })
      const index = tasks.value.findIndex((t) => t.id === updatedTask.id)
      if (index !== -1) {
        tasks.value[index] = updatedTask
      }
      console.info('Task updated successfully!')
    } else {
      const newTask = await createTask({
        title: form.title,
        description: form.description,
      })

      newTask.status = form.status || 'OPEN'
      tasks.value.push(newTask)
      console.info('Task created successfully!')
    }
  } catch (err) {
    console.error((err as Error).message || 'Task operation failed')
  } finally {
    dialog.value = false
  }
}

async function confirmDelete(task: Task) {
  if (window.confirm('Are you sure you want to delete this task?')) {
    try {
      await deleteTask(task.id)
      tasks.value = tasks.value.filter((t) => t.id !== task.id)
      console.info('Task deleted')
    } catch (err) {
      console.error((err as Error).message || 'Failed to delete task')
    }
  }
}

onMounted(() => {
  fetchTasks()
})
</script>

<style scoped>
/* Optional custom styling */
</style>
