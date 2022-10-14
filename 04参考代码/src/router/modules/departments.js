import Layout from '@/layout'
export default {
  // hidden: false,
  path: '/departments',
  component: Layout,
  children: [
    {
      path: '',
      name: 'departments',
      component: () => import('@/views/departments/departments.vue'),
      // vue路由约定的属性，是可选的
      meta: { title: '部门管理', icon: 'link' }
    }
  ]
}
