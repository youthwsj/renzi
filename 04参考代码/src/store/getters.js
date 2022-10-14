// getters可以用来简化在组件中获取模块数据的方法
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name(state) { return state.user.name },
  staffPhoto: state => state.user.userInfo.staffPhoto
}
export default getters
