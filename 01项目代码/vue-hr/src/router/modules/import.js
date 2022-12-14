
/* Layout */
import Layout from '@/layout'

export default {
  path: '/import',
  component: Layout,
  hidden: true,
  children: [
    {
      path: '',
      name: 'import',
      component: () => import('@/views/import/index.vue')
    }
  ]
}
