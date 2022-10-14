// 导出vue的插件,在main.js中被使用
// 注册全局组件
import PageTools from '@/components/PageTools/index.vue'
import MyCom1 from '@/components/MyCom1/index.vue'
import UploadImg from '@/components/UploadImg/index.vue'
import ImageHolder from '@/components/ImageHolder/index.vue'
import Lang from '@/components/Lang/index.vue'
import ScreenFull from '@/components/ScreenFull/index.vue'
export default {
  install(Vue) {
    console.log('插件加载中.......')
    Vue.component('PageTools', PageTools)
    Vue.component('UploadImg', UploadImg)
    Vue.component('MyCom1', MyCom1)
    Vue.component('ImageHolder', ImageHolder)
    Vue.component('LangIndex', Lang)
    Vue.component('ScreenFull', ScreenFull)
    Vue.prototype.num = 10000
    Vue.prototype.hello = () => {
      alert('hello')
    }
  }
}
