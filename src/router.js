import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home.vue'
import Login from './pages/Login.vue'
import LoginError from './pages/LoginError.vue'
import Booking from './pages/Booking.vue'
import Employee from './pages/Employee.vue'
import NewEmployee from './pages/NewEmployee.vue'
import EditEmployee from './pages/EditEmployee.vue'
import store from './store'

Vue.use(Router)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
    return
  }
  next('/')
}

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
    return
  }
  next('/login')
}

export default new Router({
  mode: 'history',
  base: '/~user1/booker_GFL/dist',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/loginError',
      name: 'loginError',
      component: LoginError
    },
    {
      path: '/booking',
      name: 'booking',
      component: Booking
    },
    {
      path: '/employee',
      name: 'employee',
      component: Employee
    },
    {
      path: '/new-employee',
      name: 'newEmployee',
      component: NewEmployee
    },
    {
      path: '/edit-employee/:id',
      name: 'editEmployee',
      component: EditEmployee
    }
  ]
})
