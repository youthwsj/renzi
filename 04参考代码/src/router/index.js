import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import employees from './modules/employees'
import departments from './modules/departments'
import settings from './modules/settings'
import permission from './modules/permission'
import salarys from './modules/salarys'
import attendances from './modules/attendances'
import approvals from './modules/approvals'
import social_securitys from './modules/social_securitys'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

// 动态路由表，项目中不同的用户可以访问不同的功能
export const asyncRoutes8 = [
  // 将来会放8个功能页面配置
  // {
  //   path: '/xxx',
  //   component: ()=>{ import('@/views/login/index')},
  //   hidden: true
  // }
  departments,
  settings,
  employees,
  permission,
  salarys,
  attendances,
  approvals,
  social_securitys
]

// 静态路由表，项目中每个用户都可以访问的功能
export const constantRoutes = [
  // {
  //   path: '/abc',
  //   // 路由懒加载
  //   // 只有当访问了/login时，才会加载组件 （@/views/login/index）
  //   // component: () => import('@/views/login/index'),

  //   component: () => import('@/views/abc/abc'),
  //   hidden: true
  // },
  {
    path: '/login',
    // 路由懒加载
    // 只有当访问了/login时，才会加载组件 （@/views/login/index）
    // component: () => import('@/views/login/index'),

    component: Login,
    hidden: true
  },

  {
    path: '/404',
    // component: Page404,
    component: () => { return import(/* webpackChunkName:"page404"*/ '@/views/404') },
    hidden: true
  },

  {
    path: '/import',
    component: Layout,
    hidden: true,
    children: [{
      path: '',
      name: 'import',
      component: () => import('@/views/employees/import.vue'),
      meta: { title: '导入excel', icon: 'bank' }
    }]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'bank' }
    }]
  }
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  // routes: [...constantRoutes, ...asyncRoutes]
  // 这里不写死：不要把8个页面都加上
  routes: [...constantRoutes]
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
