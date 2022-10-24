import Layout from '@/layout'
export default {
  path: '/departments',
  component: Layout,
  children: [
    {
      path: '',
      name: 'departments',
      component: () => import('@/views/departments/departments.vue'),
      meta: { title: 'route.departments', icon: 'eye' }
    }
  ]
}
