import { login, userProfile, userInfo } from '@/api/user'
import { resetRouter } from '@/router'
import { getToken, setToken } from '@/utils/auth'

export default {
  namespaced: true,
  state: () => {
    return {
      // 保存token
      // 初始值: 如果本地有就使用，没有就是''
      token: getToken() || '',
      // 用户信息
      userInfo: {}
    }
  },
  mutations: {
    // 设置userInfo
    setUserInfo(state, newUserInfo) {
      state.userInfo = newUserInfo
    },
    // 定义mutation去修改token
    // mutation的名字(state, newToken){}
    setToken(state, newToken) {
      // 1. 保存token到state
      state.token = newToken
      // 2. 调用封装好的函数，做持久化
      setToken(newToken)
    }
  },
  actions: {
    // 登录
    // data 用户名密码
    async userLogin(context, data) {
      console.log(3)
      // console.log('login', context, data)
      const res = await login(data)
      console.log(res.data)
      context.commit('setToken', res.data)
    },
    // 获取用户的信息
    async getUserProfile(context) {
      // 1. 获取用户的档案（没有头像，有id）
      const res = await userProfile()

      // 2. 获取用户的信息（传入id， 有头像）
      const resInfo = await userInfo(res.data.userId)
      console.log('resInfo', resInfo)
      // 合并两个请求拿到的数据
      const obj = { ...res.data, ...resInfo.data }
      // 3. 调用mutation保存到state
      context.commit('setUserInfo', obj)

      return res
    },
    // 用户退出
    logout(context) {
      context.commit('setUserInfo', {})
      context.commit('setToken', '')
      // A 模块中调用B模块的mutation
      context.commit('menu/resetMenu', null, { root: true })
      // 清空menus中的数据
      // 重置路由
      resetRouter()
    }
  },
  getter: {}
}
