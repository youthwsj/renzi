// 全局组件 头部小横框
import Pagetools from '@/components/Pagetools'
// 全局组件 Excel
import UploadExcel from '@/components/UploadExcel'
// 全局组件 上传头像
import UploadImg from '@/components/UploadImg'
// 全局组件 头像组件
import ImageHolder from '@/components/ImageHolder'
// 全局语言转换
import Lang from '@/components/lang'
export default {
  install(Vue) {
    Vue.component('Pagetools', Pagetools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('UploadImg', UploadImg)
    Vue.component('ImageHolder', ImageHolder)
    Vue.component('Lang', Lang)
  }
}

