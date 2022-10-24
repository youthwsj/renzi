import Layout from '@/layout'
export default {
  path: '/employees',
  component: Layout,
  children: [
    {
      path: '',
      name: 'employees',
      component: () => import('@/views/employees/employees.vue'),
      meta: { title: 'route.users', icon: 'form' }
    },
    {
      path: '/employees/detail',
      name: 'detail',
      hidden: true,
      component: () => import('@/views/employees/detail.vue')
    }
  ]
}
