<template>
  <el-form
    ref="userForm"
    :model="userInfo"
    label-width="120px"
    style="margin-left: 120px; margin-top: 30px"
  >
    <el-form-item label="姓名:">
      <el-input v-model="userInfo.username" style="width:300px" />
    </el-form-item>
    <el-form-item label="密码:">
      <el-input v-model="userInfo.password" type="password" style="width:300px" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary">更新</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      }
    }
  }
}
</script>
