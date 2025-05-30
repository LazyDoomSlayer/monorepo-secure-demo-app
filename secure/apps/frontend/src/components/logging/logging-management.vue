<template>
  <v-container fluid>
    <!-- Header -->
    <v-row align="center" justify="space-between" class="mb-4">
      <v-col>
        <h1 class="text-h5">Application Logs</h1>
      </v-col>
    </v-row>

    <!-- Logs Table -->
    <v-data-table :items="logs" class="elevation-1">
      <!-- Format the JSON meta field nicely -->
      <template #item.meta="{ item }">
        <pre class="ma-0 pa-0" style="white-space: pre-wrap; word-break: break-word"
          >{{ JSON.stringify(item.meta, null, 2) }}
        </pre>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllLogs } from '@/modules/logs.ts'
import type { IGetLogsResponse } from '@/types/modules/logs.types.ts'

// Reactive state for logs
const logs = ref<IGetLogsResponse[]>([])

// Table headers definition
const headers = [
  { text: 'ID', value: 'id' },
  { text: 'Level', value: 'level' },
  { text: 'Context', value: 'context' },
  { text: 'Message', value: 'message' },
  { text: 'Meta', value: 'meta', sortable: false },
  { text: 'Timestamp', value: 'timestamp' },
]

// Fetch logs on component mount
async function fetchLogs() {
  try {
    const response = await getAllLogs()
    console.log('response', response)
    logs.value = response.items
  } catch (err) {
    console.error('Failed to load logs', err)
  }
}

onMounted(fetchLogs)
</script>

<style scoped>
pre {
  font-family: monospace;
  font-size: 0.75rem;
  margin: 0;
}
</style>
