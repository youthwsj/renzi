import Layout from '@/layout'
export default {
  path: '/approvals',
  component: Layout,
  children: [
    {
      path: '',
      name: 'approvals',
      component: () => import('@/views/approvals/approvals.vue'),
      // meta是vue路由对象的一部分
      // 它的值就是一个对象
      meta: { title: '审批', icon: 'tree-table', a: 1, b: 2 }
    }
  ]
}
