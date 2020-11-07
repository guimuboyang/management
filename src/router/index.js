import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'
import welcome from '@/components/welcome'
import userList from '@/views/userList'
import rights from '@/views/rights'
import roles from '@/views/roles'
import goods from '@/views/goods'
import params from '@/views/params'
import categories from '@/views/categories'
import orders from '@/views/orders'
import reports from '@/views/reports'
import addgoods from '@/views/addgoods'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          name: 'welcome',
          component: welcome
        },
        {
          path: '/users',
          name: 'userList',
          component: userList
        },
        {
          path: '/rights',
          name: 'rights',
          component: rights
        },
        {
          path: '/roles',
          name: 'roles',
          component: roles
        },
        {
          path: '/goods',
          name: 'goods',
          component: goods
        },
        {
          path: '/goods/add',
          name: 'addgoods',
          component: addgoods
        },
        {
          path: '/params',
          name: 'params',
          component: params
        },
        {
          path: '/categories',
          name: 'categories',
          component: categories
        },
        {
          path: '/orders',
          name: 'orders',
          component: orders
        },
        {
          path: '/reports',
          name: 'reports',
          component: reports
        }
      ]
    }

  ]
})

//设置路由导航守卫
router.beforeEach((to, from, next) => {
  const token = window.sessionStorage.getItem('token');
  if (to.path == '/login') {//如果访问的是登录页则放行
    return next();
  } else if (token == null) {//如果token为空则强制返回登录页
    return next('/login');
  } else {
    next();//如果有token则放行
  }



})

export default router;
