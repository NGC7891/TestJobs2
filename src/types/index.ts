import { Dayjs } from 'dayjs'

export type ColorStatus = 'green' | 'orange' | 'red' | 'blue'

export interface Task {
  id: string
  dataCreated: Dayjs
  title: string
  description: string
  colorStatus: ColorStatus
  completed: boolean
}

export type CreateTaskDTO = Omit<Task, 'id' | 'dataCreated' | 'completed'>

export type NewTask = Pick<Task, 'title' | 'description' | 'colorStatus'>

export type GenerateUIDFunction = () => string

export interface UseUIDReturn {
  generateUID: GenerateUIDFunction
}
