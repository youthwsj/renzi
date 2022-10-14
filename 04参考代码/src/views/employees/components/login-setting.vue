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
      <el-button type="primary" @click="hSave">更新</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getUserDetailById, saveUserDetailById } from '@/api/user.js'
export default {
  data() {
    return {
      userInfo: {
        username: '',
        password: ''
      }
    }
  },
  created() {
    this.loadUserInfoById()
  },
  methods: {
    async doSave() {
      await saveUserDetailById(this.userInfo)
      this.$message.success('修改成功')
    },
    hSave() {
      // 表单校验
      this.doSave()
    },
    async loadUserInfoById() {
      const res = await getUserDetailById(this.$route.query.id)
      console.log('loadUserInfoById', res)
      this.userInfo = res.data
      // this.userInfo.username = res.data.username
      // this.userInfo.password = res.data.password
    }
  }
}
</script>
