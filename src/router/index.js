import { createRouter, createWebHashHistory } from 'vue-router'
import Style from '@/views/Style.vue'
import Home from '@/views/Home.vue'

const routes = [
  {
    meta: {
      title: 'Select style',
      fullScreen: true
    },
    path: '/',
    name: 'style',
    component: Style
  },
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: 'Dashboard'
    },
    path: '/dashboard',
    name: 'dashboard',
    component: Home
  },
  {
    meta: {
      title: 'Devices'
    },
    path: '/devices',
    name: 'devices',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tables" */ '@/views/Devices.vue')
  },
  {
    meta: {
      title: 'Plans'
    },
    path: '/plans',
    name: 'plans',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tables" */ '@/views/Plans.vue')
  },
  {
    meta: {
      title: 'Status Logs'
    },
    path: '/status',
    name: 'status',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tables" */ '@/views/Status.vue')
  },
  {
    meta: {
      title: 'Photos'
    },
    path: '/photos',
    name: 'photos',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "tables" */ '@/views/Photos.vue')
  },
  {
    meta: {
      title: 'Profile'
    },
    path: '/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/views/Profile.vue')
  },
  {
    meta: {
      title: 'Login',
      fullScreen: true
    },
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
  },
  {
    meta: {
      title: 'Register',
      fullScreen: true
    },
    path: '/register',
    name: 'register',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Register.vue')
  },
  {
    meta: {
      title: 'Recover Password',
      fullScreen: true
    },
    path: '/recover',
    name: 'recover',
    component: () => import(/* webpackChunkName: "login" */ '@/views/RecoverEmail.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior (to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

export default router
