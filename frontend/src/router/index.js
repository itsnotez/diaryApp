import { createRouter, createWebHistory } from 'vue-router'
import DiaryList from '../views/DiaryList.vue'
import DiaryWrite from '../views/DiaryWrite.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DiaryList
    },
    {
      path: '/write',
      name: 'write',
      component: DiaryWrite
    },
    {
      path: '/write/:id', // For editing
      name: 'edit',
      component: DiaryWrite
    }
  ]
})

export default router
