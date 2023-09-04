import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory('/icons'),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { title: '@kong/icons' },
      component: () => import('./pages/HomePage.vue'),
    },
  ],
})
