<template>
  <el-image :src="src" alt="" class="img-container">
    <template #error>
      <div>
        <img src="@/assets/common/bigUserHeader.png" alt="">
      </div>
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
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped lang="scss">
// 样式穿透， 有三种写法：
// 1. >>>       在less中使用
// 2. /deep/    在less中使用
// 3. ::v-deep  在scss中使用
.img-container {
  border-radius: 50%;
  ::v-deep img{
    width: 100px;
    height: 100px;
  }
}
</style>
