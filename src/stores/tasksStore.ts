// Тут будем работать с хранением и обработкой данных в локальном хранилище
// При необходимости можно заменить на логику работы с серваком

import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import { useUID } from '@/composables/useUID'
import type { Task, CreateTaskDTO } from '@/types'

// Ключ локального хранилища
const LOCAL_KEY_TODO = 'tasks' as const

const { generateUID } = useUID()

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    isProcessing: false,
  }),

  actions: {
    async fetchTasks() {
      this.isProcessing = true
      try {
        const store = localStorage.getItem(LOCAL_KEY_TODO)
        this.tasks = store ? JSON.parse(store) : []
      } catch (error) {
        console.error('Не удалось загрузить таски изи локального хранилища, ошибка: ', error)
      } finally {
        this.isProcessing = false
      }
    },

    async saveTasks() {
      this.isProcessing = true
      try {
        localStorage.setItem(LOCAL_KEY_TODO, JSON.stringify(this.tasks))
      } catch (error) {
        console.error('Не удалось сохранить данные в локальное хранилище, ошибка: ', error)
      } finally {
        this.isProcessing = false
      }
    },

    async addTask(task: CreateTaskDTO) {
      const newTask: Task = {
        id: generateUID(),
        ...task,
        dataCreated: dayjs(),
        completed: false,
      }
      this.tasks.push(newTask)
      await this.saveTasks()
    },

    async toogleComplated(id: string) {
      const findTask = this.tasks.find((item) => item.id === id)
      if (findTask) {
        findTask.completed = !findTask.completed
        await this.saveTasks()
      }
    },

    // Возможность удаления отдельной задачи
    async removeTask(id: string) {
      const indexTask = this.tasks.findIndex((item) => item.id === id)
      if (indexTask !== -1) {
        this.tasks.splice(indexTask, 1)
        await this.saveTasks()
      }
    },

    // Возможность массового удаления задач
    async removeTasks(ids: string[]) {
      const initialLengh = this.tasks.length
      this.tasks = this.tasks.filter((task) => !ids.includes(task.id))

      // если есть изменения в тасках то обновляем
      if (initialLengh === this.tasks.length) return false
      await this.saveTasks()
      return true
    },

    async updateTask(task: Task) {
      const taskIndex = this.tasks.findIndex((item) => item.id === task.id)
      if (taskIndex === -1) return true

      const originalCreateDate = this.tasks[taskIndex].dataCreated

      this.tasks[taskIndex] = {
        ...task,
        dataCreated: originalCreateDate,
      }

      await this.saveTasks()
      return true
    },
  },

  getters: {
    // Сортированые по дате
    getSortedTasks(): Task[] {
      return [...this.tasks].sort((a, b) => b.dataCreated.valueOf() - a.dataCreated.valueOf())
    },
  },
})
