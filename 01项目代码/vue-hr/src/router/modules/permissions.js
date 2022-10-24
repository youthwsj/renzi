import Layout from '@/layout'
export default {
  path: '/permissions',
  component: Layout,
  children: [
    {
      path: '',
      name: 'permissions',
      component: () => import('@/views/permissions/permissions.vue'),
      meta: { title: 'route.permissions', icon: 'link' }
    }
  ]
}
