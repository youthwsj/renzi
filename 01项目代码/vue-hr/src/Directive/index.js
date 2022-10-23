import store from '@/store'

export default {
  install: function(Vue) {
    Vue.directive('allow', {
      inserted(el, binging) {
        const points = store.state.user.userInfo.roles.points
        if (points && points.includes(binging.value)) {
          console.log(points)
        } else {
          el.parentNode.removeChild(el)
        }
      }
    })
  }
}
