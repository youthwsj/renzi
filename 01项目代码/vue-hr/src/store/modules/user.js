// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }
import { resetRouter } from '@/router'
import { setToken, getToken } from '@/utils/auth'
import { login, getProfile, getUserDetailById } from '@/api/user'

export default {
  namespaced: true,
  state: {
    // 从本地取token作为初值
    token: getToken(),
    userInfo: {}
  },
  mutations: {
    // 名字(state, 参数) { }
    setToken(state, newToken) {
      // 1. 保存到vuex
      state.token = newToken
      // 2. 持久化
      setToken(newToken)
    },
    setUserInfo(state, newInfo) {
      state.userInfo = newInfo
    }
  },
  actions: {
    // 定义了一个action，退出：删除用户数据
    userLogout(context) {
      context.commit('setToken', '')
      context.commit('setUserInfo', {})
      resetRouter()
    },

    // 名字(context, 参数){ }
    async userLogin(context, data) {
      const res = await login(data)
      // console.log('token', res.data)
      // 调用mutation保存token
      context.commit('setToken', res.data)
    },

    // 获取用户的信息
    async getUserInfo(context) {
      // console.log('action getUserInfo')
      // 1. 发请求- 请求基本信息
      const res = await getProfile()
      // console.log('获取用户的信息ID', res.data.userId)
      // 2. 发请求- 请求详细信息（头像）
      const res2 = await getUserDetailById(res.data.userId)
      // console.log('res2:----------', res2.data)
      // 3. 保存到state
      context.commit('setUserInfo', { ...res.data, ...res2.data })
    }
  }
}

