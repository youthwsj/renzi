const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.userInfo.username,
  staffPhoto: function(state) { return state.user.userInfo.staffPhoto }
}
export default getters
