import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 假设这个项目中有 三个页面是不需要token 就可以访问的: /login, /404, /abc

// 白名单： 不需要登录就可以直接访问的页面集合
const whiteList = ['/login', '/404', '/abc']

router.beforeEach((to, from, next) => {
  // console.log('beforeEach - 2 ')
  // 切换标题
  // console.log(to)
  // document.title = to.meta.title + 'xxxxx系统'
  document.title = getPageTitle(to.meta.title)
  next()
})

router.beforeEach(async(to, from, next) => {
  // console.log('beforeEach - 1 ')
  NProgress.start()
  // 1. 如果有token&&去登录页            ===> 让它去主页
  // 2. 如果没有token && 去的不是登录     ===> 去登录页
  const token = store.state.user.token
  if (token && to.path === '/login') {
    console.log('有了token,login就不能访问!')
    next('/')
    NProgress.done()
  } else if (!token && whiteList.includes(to.path) === false) {
    console.log('没有登录 && 访问的页面不是: /login, /404, /abc 中的一个')
    next('/login')
    NProgress.done()
  } else {
    // 调用action,获取用户个人信息，保存到vuex
    // if('没有用户信息' && 有token) {
    if (!store.state.user.userInfo.userId && token) {
      await store.dispatch('user/getUserInfo')
    }
    next()
  }
})

router.afterEach((to, from) => {
  NProgress.done()
})

//
// import { Message } from 'element-ui'

// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

//

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
