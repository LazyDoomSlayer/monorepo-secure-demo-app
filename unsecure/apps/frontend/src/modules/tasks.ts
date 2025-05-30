import axiosAPICall from '@/modules/axios-interceptor.ts'
import type { CreateTaskDto, Task, UpdateTaskDto } from '@/types/modules/tasks.types.ts'

export async function getAllTasks(): Promise<Task[]> {
  const res = await axiosAPICall.get('/tasks')
  return res.data
}

export async function getTask(id: string): Promise<Task> {
  const res = await axiosAPICall.get(`/tasks/${id}`)
  return res.data
}

export async function createTask(payload: CreateTaskDto): Promise<Task> {
  const res = await axiosAPICall.post('/tasks', payload)
  return res.data
}

export async function updateTask(id: string, updates: UpdateTaskDto): Promise<Task> {
  const res = await axiosAPICall.patch(`/tasks/${id}`, updates)
  return res.data
}

export async function deleteTask(id: string): Promise<void> {
  await axiosAPICall.delete(`/tasks/${id}`)
}
