<template>
  <div class="department-container">
    <div class="app-container">
      <el-card>
        <!-- 具体页面结构 -->
        工资
        <button @click="click">动态添加一个路由配置</button>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    click() {
      this.$router.addRoutes([
        {
          path: '/abc',
          // 路由懒加载
          // 只有当访问了/login时，才会加载组件 （@/views/login/index）
          // component: () => import('@/views/login/index'),

          component: () => import('@/views/abc/abc'),
          hidden: true
        }
      ])
    }
  }
}
</script>
