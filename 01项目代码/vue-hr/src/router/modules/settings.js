import Layout from '@/layout'
export default {
  path: '/settings',
  component: Layout,
  children: [
    {
      path: '',
      name: 'settings',
      component: () => import('@/views/settings/settings.vue'),
      meta: { title: 'route.manage', icon: 'password' }
    }
  ]
}
