export interface Task {
  id: string
  title: string
  description?: string
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE'
}

export interface CreateTaskDto {
  title: string
  description?: string
}

export interface UpdateTaskDto {
  title?: string
  description?: string
  status?: Task['status']
}
