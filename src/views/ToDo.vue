<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useTasksStore } from '@/stores/tasksStore';
import type { Task, NewTask } from '@/types';
import { useDebounce } from '@vueuse/core';
import { UIButton, UILabel, UIModal } from '@/components/UI';

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
  showModal.value = !showModal.value;
  editingTask.value = { ...task }

}

const saveEditTask = async () => {
  if (!editingTask.value) return
  await store.updateTask(editingTask.value)
  showModal.value = false
}


const deleteSelectedTasks = async (id: string | null = null) => {
  // Если передали ид то удалим по id
  if (id) {
    await store.removeTask(id)
  } else {
    // если в аргументе null то удаляем выделенные
    await store.removeTasks(Array.from(selectedTasks.value))
    selectedTasks.value.clear()
  }
}

const doneTask = (task: Task) => {
  if (!task) return

  store.updateTask({
    ...task,
    completed: true,
  })
}

enum FilterType {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}
const activeFilter = ref<FilterType>(FilterType.ALL)



const filteredTasks = computed(() => {
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
  <main :class="$style.main">
    <div :class="$style.header">TO-DO APP</div>
    <div :class="$style.wrapperContent">
      <section :class="$style.content">
        <h3 :class="$style.contentHeader">Список задач</h3>
        <div :class="$style.contentFilter">
          <select :class="$style.filterTasks" v-model="activeFilter" @change="clearSearchQuery">
            <option :value="FilterType.ALL">Все задачи</option>
            <option :value="FilterType.ACTIVE">Только не выполненные</option>
            <option :value="FilterType.COMPLETED">Только выполненные</option>
          </select>
          <input :class="$style.searchTasks" placeholder="поиск..." type="text" v-model="searchQuery">
        </div>
        <div :class="$style.tasksWrapper">
          <!-- Таски -->
          <ul :class="$style.tasks">
            <li :class="$style.task" v-for="task in filteredTasks" :key="task.id">
              <input :class="$style.taskCheckbox" type="checkbox" :checked="selectedTasks.has(task.id)"
                @change="toogleTasksSelected(task.id)" />
              <UILabel full-width="" variant="primary" :spacing="{ x: 'md', y: 'sm' }" :class="$style.labelOptions">
                <div :class="$style.labelTitle">{{ task.title }}</div>
                <div :class="$style.taskWrapper">
                  <UILabel :text="task.completed ? 'завершена' : 'новая'" :variant="task.completed ? 'success' : 'done'"
                    :spacing="{ x: 'md', y: 'xs' }" text-color="white" />
                  <UIButton @click="openEditModal(task)" :spacing="{ x: 'md', y: 'sm' }" variant="accent"
                    text="детально" radius="r50" text-color="white" />
                  <time>
                    <!-- TODO: Допилить логику обработки и вывода времени -->
                    <!-- <span :class="$style.time">{{ task.dataCreated.slice(8, 10) }}.{{ task.dataCreated.slice(5, 7)
                      }}</span> -->
                  </time>
                </div>
              </UILabel>
            </li>
          </ul>
          <div :class="$style.contentFooter">
            <UIButton v-if="hasSelectedTasks" @click="deleteSelectedTasks(null)" text="Удалить выделенные задачи"
              radius="r8" text-color="white" variant="danger" :spacing="{ x: 'xl', y: 'sm' }" />
          </div>
        </div>
      </section>
      <section :class="$style.addForm">
        <h3 :class="$style.contentHeader">Новая задача</h3>
        <div :class="$style.formWrapper">
          <form @submit.prevent="handleSubmit">
            <div :class="$style.formAddWrapper">
              <input :class="$style.modalInput" type="text" v-model="newTask.title" placeholder="Имя задачи..." />
              <textarea :class="$style.modalTextarea" v-model="newTask.description" placeholder="Описание задачи..."
                rows="3"></textarea>
            </div>
            <UIButton full-width text-color="white" variant="accent" :class="$style.forButtonSubmit" type="submit"
              :spacing="{ x: 'xl', y: 'sm' }" radius="r8" text="Добавить" />
          </form>
        </div>
      </section>
    </div>


    <UIModal v-model="showModal" title="Редактирование задачи" :spacing="{ x: 'md', y: 'md' }" radius="r8">
      <div :class="$style.modalContent">
        <input :class="$style.modalInput" v-model="editingTask!.title" type="text" placeholder="Имя задачи..." />
        <textarea :class="$style.modalTextarea" v-model="editingTask!.description" placeholder="Описание задачи..."
          rows="3"></textarea>
        <div :class="$style.modalFooter">
          <UIButton @click="saveEditTask" :spacing="{ x: 'sm', y: 'sm' }" text="изменить" variant="accent"
            radius="r16" />
          <UIButton v-show="!editingTask?.completed" @click="doneTask(editingTask); showModal = false"
            :spacing="{ x: 'sm', y: 'sm' }" text="завершить" variant="success" radius="r16" />
          <UIButton @click="deleteSelectedTasks(editingTask!.id); showModal = false" :spacing="{ x: 'sm', y: 'sm' }"
            text="удалить" variant="danger" radius="r16" />
        </div>
      </div>
    </UIModal>
  </main>
</template>

<style lang="css" module>
.main {
  width: 100%;
  font-size: x-large;
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.header {
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  border-bottom: 1px solid var(--color-text);
}

/* Отображение тасок */
.wrapperContent {
  width: 100%;
  display: flex;
  gap: var(--space-xl);
}

.content {
  border-radius: var(--space-sm);
  flex-basis: 80%;
  background-color: var(--color-background-element);
  padding: 0 var(--space-xl);
  height: 90dvh;
}

.contentHeader {
  padding: var(--space-md);
}

.contentFilter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-xl);
  padding-left: var(--space-lg);
}

.filterTasks {
  border-radius: 50px;
}

.searchTasks {
  border-radius: 50px;
}

.tasksWrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 80%;
}

.tasks {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  overflow-y: auto;
}

.taskWrapper {
  display: flex;
  gap: var(--space-sm);
}

.labelOptions {
  display: flex;
  justify-content: space-between;
}

.task {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

/* .task:not(:first-child):not(:last-child) {
  margin: var(--space-md) 0;
} */

.taskCheckbox {}

.labelTitle {
  color: var(--color-dark);
}

time {
  padding: var(--space-sm);
  color: var(--color-dark);
}

/* Форма добавления задачи */

.modalContent {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--space-lg);
}

.modalFooter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  flex-wrap: nowrap;
}

.contentFooter {}

.addForm {
  border-radius: var(--space-sm);
  flex-basis: 20%;
  background-color: var(--color-background-element);
  max-height: 320px;
}

.formWrapper {
  padding: var(--space-xl) var(--space-md);
  display: flex;
  flex-direction: column;
}

.modalInput {
  width: 100%;
  border-radius: 8px;
  min-height: 32px;
  border: none;
}

.modalTextarea {
  border: none;
  width: 100%;
  border-radius: 8px;
  min-height: 32px;
}

.formAddWrapper {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}
</style>
