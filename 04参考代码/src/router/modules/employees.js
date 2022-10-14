// 定义模块，导出这个对象
import Layout from '@/layout'
export default {
  path: '/employees',
  component: Layout,
  children: [
    {
      path: '',
      name: 'employees',
      component: () => import('@/views/employees/employees.vue'),
      meta: { title: '员工管理', icon: 'employees' }
    },
    {
      path: 'detail',
      name: 'detail',
      component: () => import('@/views/employees/detail.vue'),
      hidden: true
    }
  ]
}
