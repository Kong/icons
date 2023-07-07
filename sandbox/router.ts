import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { title: 'Kong Icons Sandbox' },
      component: () => import('./pages/HomePage.vue'),
      children: [
        {
          path: 'icons/:icon(\\w+)',
          name: 'icon',
          meta: { title: 'Icon' },
          component: () => import('./pages/SandboxIcon.vue'),
        },
      ],
    },
  ],
})
