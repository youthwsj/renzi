<template>
  <el-image :src="src">
    <!-- 如果src属性对应的图片加载失败，显示error插槽的内容 -->
    <template slot="error">
      <img src="./head.jpg">
    </template>
  </el-image>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
/* 父组件下 + scoped  想选中子组件的样式，要加样式穿透 */
/deep/ img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
