// 定义模块，导出这个对象
import Layout from '@/layout'
export default {
  path: '/permission',
  component: Layout,
  children: [
    {
      path: '',
      name: 'permissions',
      component: () => import('@/views/permission/permission.vue'),
      meta: { title: '权限管理', icon: 'settings' }
    }
  ]
}
