
// 全局指令
import store from '@/store'
export default {
  install(Vue) {
    Vue.directive('allow', {
      // 当被绑定的元素插入到 DOM 中时inserted会自动执行
      inserted: function(el, binding) {
        // el: 就是dom元素
        // binding: 就是一个对象，.value就是绑定的值
        // $store.state.user.userInfo.roles.points.includes('import_excel')
        if (!store.state.user.userInfo.roles.points.includes(binding.value)) {
          console.log(el, '不可见')
          // 删除el
          // 父元素.removeChild(子元素)
          el.parentNode.removeChild(el)
        } else {
          console.log(el, '可见')
        }
        // console.log(el, binding.value)
      }
    })
  }
}

