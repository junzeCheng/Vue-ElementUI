import Vue from 'vue'
import VueRouter from 'vue-router'
import login from 'components/login/login.vue'
import home from 'views/home/home.vue'
import welcome from 'views/welcome/welcome.vue'
import users from 'views/user/users.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,
    redirect: "/welcome",
    children: [{
      path: '/welcome',
      component: welcome
    },
    {
      path: '/users',
      component: users
    }]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path == "/login") return next();
  const token = window.sessionStorage.getItem("token");
  if (!token) return next("/login");
  next();
})

export default router
