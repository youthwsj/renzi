
/* Layout */
import Layout from '@/layout'

export default {
  path: '/import',
  component: Layout,
  children: [
    {
      path: '',
      name: 'import',
      component: () => import('@/views/import/index.vue')
    }
  ]
}
