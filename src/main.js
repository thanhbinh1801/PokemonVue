import { createApp } from 'vue'
import App from './App.vue'
import { createWebHistory, createRouter } from 'vue-router'
import PokemonDetails from '@/pokemon/PokemonDetails.vue'
import HomeView from './view/HomeView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/:name', component: PokemonDetails },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App)
.use(router)
.mount('#app')
