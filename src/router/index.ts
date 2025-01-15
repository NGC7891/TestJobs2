import { createRouter, createWebHistory } from 'vue-router'
import ToDo from '@/views/ToDo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'to-do',
      component: ToDo,
    },
    // не существующи маршруты редирект
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
