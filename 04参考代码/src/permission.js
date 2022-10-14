import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import getPageTitle from '@/utils/get-page-title'
import { asyncRoutes8 } from '@/router/index.js'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 白名单: 不需要token就可直接访问的页面： /login, /regisiter, /404, ....
const whiteList = ['/login', '/404']
// 导航守卫
// 路由变化都会调用 回调函数 ===> 导航守卫
//
// 正常放行：next()
// 进入其他页面： next('/pagexxx')
router.beforeEach(async(to, from, next) => {
  console.log('守卫1', from.path)
  // 启动页面跳转进度条
  NProgress.start()

  // console.log('从', from.path)
  // console.log('去', to.path)
  // 获取token
  const token = store.state.user.token
  if (token) {
    // 是去登录么？
    if (to.path === '/login') {
      // 有了token就不能去登录页，直接跳到主页
      console.log('你已经登录了，就不能访问login,直接进入主页')
      next('/')
      NProgress.done()
    } else {
      // 有token, 要正常访问页面
      // 发请求拿信息:调用action
      // ( .vue, this.$store.dispatch())
      // 是否有个人信息？
      const userInfo = store.state.user.userInfo
      if (!userInfo.userId) {
        // 1. 获取权限信息
        const res = await store.dispatch('user/getUserProfile')
        // 根据用户的权限信息，从asyncRoutes8过滤出一部分
        // res.data.roles.menus: ['employees', 'permissions', 'approvals',....]
        const menus = res.data.roles.menus
        const filterRoutes = asyncRoutes8.filter(item => {
          const name = item.children[0].name
          return menus.includes(name)
        })
        console.log('路由守卫', filterRoutes, asyncRoutes8, res.data.roles.menus)
        // （1）可以让我们在地址栏中访问页面
        // 让404在整个路由配置的最后面
        filterRoutes.push({ path: '*', redirect: '/404', hidden: true })
        router.addRoutes(filterRoutes)

        //  (2) 把动态的路由添加到vuex
        store.commit('menu/updateMenuList', filterRoutes)

        next({
          ...to,
          replace: true
        })
      } else {
        next()
      }
    }
  } else {
    // 是否访问白名单中的页面
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 没有token, 去的不是login
      next('/login')
      NProgress.done()
    }
  }
})

// 路由守卫可以写多个
router.beforeEach((to, from, next) => {
  console.log('守卫2', to.meta.title)
  document.title = getPageTitle(to.meta.title)
  next()
})

router.afterEach((to, from) => {
  console.log('页面跳转结束', to.path)
  NProgress.done()
})

// import { Message } from 'element-ui'

// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
