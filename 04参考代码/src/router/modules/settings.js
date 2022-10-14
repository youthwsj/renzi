// 定义模块，导出这个对象
import Layout from '@/layout'
export default {
  path: '/settings',
  component: Layout,
  children: [
    {
      path: '',
      name: 'settings',
      component: () => import('@/views/settings/settings.vue'),
      meta: { title: '角色管理', icon: 'settings' }
    }
  ]
}
