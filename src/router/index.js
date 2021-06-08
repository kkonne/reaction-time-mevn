import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '@/store';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/play',
    name: 'Play',
    component: () => import( '../views/Play.vue')
  },
  {
    path: '/leaderboards',
    name: 'Leaderboards',
    component: () => import( '../views/Leaderboards.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import( '../views/Register.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import( '../views/Login.vue')
  }
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const auth = store.getters['auth/authenticated'];
  if (to.name == 'Play' && !auth) next({ name: 'Login' })
  else next()
})

export default router
