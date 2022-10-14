<template>
  <div class="user-info">
    <!-- 个人信息 -->
    <el-form label-width="220px">
      <!--手机 -->

      <el-form-item label="手机">
        <el-input v-model="userInfo.mobile" style="width:220px" />
      </el-form-item>

      <!-- 工号 入职时间 -->

      <el-form-item label="入职时间">
        <el-date-picker
          v-model="userInfo.timeOfEntry"
          type="date"
          class="inputW"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>

      <!-- 员工照片 -->

      <el-form-item label="员工头像">
        <!-- 放置上传图片 -->
        <UploadImg v-model="userInfo.staffPhoto" />
      </el-form-item>

      <!-- 保存个人信息 -->
      <el-form-item>
        <el-button type="primary" @click="hSave">保存更新</el-button>
        <el-button @click="$router.back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getUserDetailById, saveUserDetailById } from '@/api/user.js'

export default {
  data() {
    return {
      userInfo: {
        mobile: '',
        timeOfEntry: '',
        staffPhoto: '' // 初始为空
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

<style scoped lang="scss">
  .user-info{
    padding-top:20px;
  }
</style>
