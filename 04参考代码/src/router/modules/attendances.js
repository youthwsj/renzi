// 定义模块，导出这个对象
import Layout from '@/layout'
export default {
  path: '/attendances',
  component: Layout,
  children: [
    {
      path: '',
      name: 'attendances',
      component: () => import('@/views/attendances/attendances.vue'),
      meta: { title: '考勤管理', icon: 'attendances' }
    }
  ]
}
