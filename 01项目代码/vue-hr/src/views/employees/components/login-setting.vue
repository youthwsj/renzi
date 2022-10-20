<template>
  <el-form
    ref="userForm"
    :model="userInfo"
    :rules="rules"
    label-width="120px"
    style="margin-left: 120px; margin-top: 30px"
  >
    <el-form-item label="姓名:" prop="username">
      <el-input v-model="userInfo.username" style="width:300px" />
    </el-form-item>
    <el-form-item label="密码:" prop="password">
      <el-input v-model="userInfo.password" disabled type="password" show-password style="width:300px" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="hSave()">更新</el-button>
      <el-button @click="$router.back()">返回</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getUserDetailById, saveUserDetailById } from '@/api/user'
export default {
  data() {
    return {
      userId: this.$route.query.id,
      userInfo: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', triggler: 'blur' }],
        password: [{ required: true, message: '密码不能为空', triggler: 'blur' }]
      }
    }
  },
  created() {
    this.loadUserDetailById()
  },
  methods: {
    // 获取数据
    async loadUserDetailById() {
      if (!this.$route.query.id) {
        this.$message.success('请先选择用户')
        this.$router.push('/employees')
      }
      //   调用api接口
      const res = await getUserDetailById(this.userId)
      console.log(res)
      this.userInfo = res.data
    },
    // 更新按钮
    hSave() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.doSave()
        }
      })
    },
    // 调用接口
    async doSave() {
      try {
        const res = await saveUserDetailById(this.userInfo)
        console.log('保存个人信息之后的结果是', res)
        // 1. 提示
        this.$message.success('保存成功')
      } catch (err) {
        this.$message.error(err.message)
      }
    }
  }

}
</script>
