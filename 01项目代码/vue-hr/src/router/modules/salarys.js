import Layout from '@/layout'
export default {
  path: '/salarys',
  component: Layout,
  children: [
    {
      path: '',
      name: 'salarys',
      component: () => import('@/views/salarys/salarys.vue'),
      meta: { title: '工资', icon: 'nested' }
    }
  ]
}
