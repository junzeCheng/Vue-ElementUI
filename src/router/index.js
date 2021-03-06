import Vue from 'vue'
import VueRouter from 'vue-router'
// import login from 'components/login/login.vue'
// import home from 'views/home/home.vue'
// import welcome from 'views/welcome/welcome.vue'

const login = ()=> import(/*webpackChunkName: "login_home_welcome" */ 'components/login/login.vue')
const home = ()=> import(/*webpackChunkName: "login_home_welcome" */ 'views/home/home.vue')
const welcome = ()=> import(/*webpackChunkName: "login_home_welcome" */ 'views/welcome/welcome.vue')

// import users from 'views/user/users.vue'
// import rights from 'views/power/rights.vue'
// import roles from 'views/power/roles.vue'
const users = ()=> import(/*webpackChunkName: "Users_rights_roles" */ 'views/user/users.vue')
const rights = ()=> import(/*webpackChunkName: "Users_rights_roles" */ 'views/power/rights.vue')
const roles = ()=> import(/*webpackChunkName: "Users_rights_roles" */ 'views/power/roles.vue')


// import category from 'views/goods/category.vue'
// import params from 'views/goods/params.vue'
const category = ()=> import(/*webpackChunkName: "Cate_params" */ 'views/goods/category.vue')
const params = ()=> import(/*webpackChunkName: "Cate_params" */ 'views/goods/params.vue')

// import goodsList from 'views/goods/list.vue'
// import addGoods from 'views/goods/add.vue'
const goodsList = ()=> import(/*webpackChunkName: "Good_add" */ 'views/goods/list.vue')
const addGoods = ()=> import(/*webpackChunkName: "Good_add" */ 'views/goods/add.vue')

// import order from 'views/order/order.vue'
// import report from 'views/report/report.vue'
const order = ()=> import(/*webpackChunkName: "order_report" */ 'views/order/order.vue')
const report = ()=> import(/*webpackChunkName: "order_report" */ 'views/report/report.vue')


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
    },
    {
      path: '/rights',
      component: rights
    },
    {
      path: '/roles',
      component: roles
    },
    {
      path: '/categories',
      component: category
    },
    {
      path: '/params',
      component: params
    },
    {
      path: '/goods',
      component: goodsList
    },
    {
      path: '/goods/add',
      component: addGoods
    },
    {
      path: '/orders',
      component: order
    },
    {
      path: '/reports',
      component: report
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
