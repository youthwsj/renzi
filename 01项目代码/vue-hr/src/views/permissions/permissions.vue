<template>
  <div class="department-container">
    <div class="app-container">
      <el-card>
        <!-- 具体页面结构 -->
        <Pagetools>
          <template #left>
            左侧插槽
          </template>
          <template #right>
            <el-button type="success">按钮</el-button>
          </template>
        </Pagetools>
      </el-card>
    </div>
  </div>
</template>
<script>
import Pagetools from '@/components/Pagetools'
export default {
  components: {
    Pagetools
  },
  data() {
    return {

    }
  }
}
</script>
