import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Kongponents from '@kong/kongponents'

// Import Kongponents styles
import '@kong/kongponents/dist/style.css'

const app = createApp(App)

router.beforeEach((to, from, next) => {
  // @ts-ignore
  document.title = to.meta.title
  next()
})

app.use(router)

app.use(Kongponents)

app.mount('#app')
