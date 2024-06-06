import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

router.beforeEach((to, from, next) => {
  // @ts-ignore: property title exists
  document.title = to.meta.title
  next()
})

app.use(router)

app.mount('#app')
