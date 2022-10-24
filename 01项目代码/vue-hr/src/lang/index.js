import Vue from 'vue'
import VueI18n from 'vue-i18n'
import locale from 'element-ui/lib/locale'
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
// 引入自定义中文包
import customZH from './zh'
// 引入自定义英文包
import customEN from './en'

Vue.use(VueI18n)

// 创建国际化插件的实例
const i18n = new VueI18n({

  locale: 'zh', // 指定语言类型

  messages: { // 固定写法
    en: {
      ...elementEN,
      ...customEN // 将自定义英文包加入
    },
    zh: {
      ...elementZH,
      ...customZH // 将自定义中文包加入
    }
  }
})

// 配置elementUI 语言转换关系
locale.i18n((key, value) => i18n.t(key, value))

export default i18n
