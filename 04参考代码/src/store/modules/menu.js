// 所有的路由配置
import { constantRoutes } from '@/router/index.js'
export default {
  namespaced: true,
  state() {
    return {
      menuList: [...constantRoutes]
    }
  },
  mutations: {
    // 把动态路由部分添加到菜单
    updateMenuList(state, asyncRoutes) {
      state.menuList.push(...asyncRoutes)
      // state.menuList = [...constantRoutes, ...asyncRoutes]
    },
    resetMenu(state) {
      console.log('resetMenu')
      state.menuList = [...constantRoutes]
    }
  }
}

