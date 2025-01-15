<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTasksStore } from '@/stores/tasksStore';
import type { Task, NewTask } from '@/types';
import { useDebounce } from '@vueuse/core';

const store = useTasksStore();

const showModal = ref<boolean>(false);
const selectedTasks = ref<Set<string>>(new Set());
const editingTask = ref<Task | null>(null);

const searchQuery = ref('');
const debouncedSearch = useDebounce(searchQuery, 200)

const newTask = ref<NewTask>({
  title: '',
  description: '',
  colorStatus: 'blue'
})

const clearNewTask = () => {
  newTask.value = {
    title: '',
    description: '',
    colorStatus: 'blue'
  }
}

const clearSearchQuery = () => searchQuery.value = "";

const toogleTasksSelected = (id: string) => {
  if (selectedTasks.value.has(id)) {
    console.log('Est');
    selectedTasks.value.delete(id)
  } else {
    selectedTasks.value.add(id)
  }
}

const handleSubmit = async () => {
  if (!newTask.value.title.trim()) return
  await store.addTask(newTask.value)
  clearNewTask()
};


const openEditModal = (task: Task) => {
  console.log(task);
  showModal.value = !showModal.value;
  editingTask.value = { ...task }

}

const saveEditTask = async () => {
  if (!editingTask.value) return
  await store.updateTask(editingTask.value)
  showModal.value = false
}

const deleteSelectedTasks = async () => {
  await store.removeTasks(Array.from(selectedTasks.value))
  selectedTasks.value.clear()
}

enum FilterType {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}
const activeFilter = ref<FilterType>(FilterType.ALL)



const filteredTasks = computed(() => {
  // console.log(debouncedSearch);
  const query = debouncedSearch.value.toLowerCase().trim()
  let tasks = store.getSortedTasks

  // фильтрация по типу задач
  switch (activeFilter.value) {
    case FilterType.ACTIVE:
      tasks = tasks.filter(tast => !tast.completed)
      break
    case FilterType.COMPLETED:
      tasks = tasks.filter(task => task.completed)
      break
  }

  // фильтруем по поиску
  if (!query) return tasks

  return tasks.filter(task => task.title.toLowerCase().includes(query))
})



const hasSelectedTasks = computed(() => selectedTasks.value.size > 0)

onMounted(async () => {
  store.fetchTasks()
})

</script>

<template>
  <main>
    <!-- Поиск по названию & сортировка-->
    <div>
      <input type="text" v-model="searchQuery">
      <select v-model="activeFilter" @change="clearSearchQuery">
        <option :value="FilterType.ALL">Все</option>
        <option :value="FilterType.ACTIVE">Не завершенные</option>
        <option :value="FilterType.COMPLETED">Законченые</option>
      </select>
    </div>
    <!-- Форма добавления -->
    <div>
      <form @submit.prevent="handleSubmit">
        <input type="text" v-model="newTask.title" placeholder="Имя задачи..." />
        <textarea v-model="newTask.description" placeholder="Описание задачи..." rows="3"></textarea>
        <button type="submit">+</button>
      </form>
    </div>
    <!-- Список -->
    <div>
      <ul>
        <li v-for="task in filteredTasks" :key="task.id">
          <input type="checkbox" :checked="selectedTasks.has(task.id)" @change="toogleTasksSelected(task.id)" />
          <span>Название: {{ task.title }} </span>
          Описание: {{ task.description }}
          <span :class="$style.label" @click="openEditModal(task)">Детально</span>
        </li>
      </ul>
    </div>
    <!-- Удаление -->
    <div>
      <pre>HasSelected {{ selectedTasks }}</pre>
      <button v-if="hasSelectedTasks" @click="deleteSelectedTasks">Удалить выбранные{{ selectedTasks.size }}</button>
    </div>
    <!-- Модалка редактирование -->
    <teleport to="body">
      <div v-if="showModal" :class="$style.modal">
        <h3>Редактирование задачи <button @click="showModal = false">x</button></h3>
        <input type="text" v-model="editingTask!.title" placeholder="Имя задачи..." />
        <textarea v-model="editingTask!.description" placeholder="Описание задачи..." rows="3"></textarea>
        <select v-model="editingTask!.colorStatus">
          <option value="blue">Синий</option>
          <option value="green">Зеленый</option>
          <option value="orange">Оранжевый</option>
          <option value="red">Красный</option>
        </select>
        <input type="checkbox" v-model="editingTask!.completed" />готово
        <button @click="saveEditTask">Сохранить изменения</button>
      </div>
    </teleport>
  </main>
</template>

<style lang="css" module>
.label {
  padding: 8px;
  color: wheat;
  cursor: pointer;
  background-color: black;
  border-radius: 8px;
}

.modal {
  z-index: 777;
  position: absolute;
  color: red;
  width: 100dvw;
  height: 100dvh;
}
</style>
