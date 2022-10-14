import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// 全局注册组件
Vue.component('svg-icon', SvgIcon)

// 提前把所有.svg图片加载进来
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
