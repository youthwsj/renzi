// 定义模块，导出这个对象
import Layout from '@/layout'
export default {
  path: '/social_securitys',
  component: Layout,
  children: [
    {
      path: '',
      name: 'social_securitys',
      component: () => import('@/views/social_securitys/social_securitys.vue'),
      meta: { title: '社保管理', icon: 'social_securitys' }
    }
  ]
}
