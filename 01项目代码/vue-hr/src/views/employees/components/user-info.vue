<template>
  <div class="user-info">
    <!-- 个人信息 -->
    <el-form label-width="220px">
      <!--手机 -->

      <el-form-item label="手机">
        <el-input v-model="userInfo.mobile" disabled style="width:220px" />
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
        <UploadImg v-model="userInfo.staffPhoto">
          <img>
        </uploadimg>
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

import { getUserDetailById, saveUserDetailById } from '@/api/user'
export default {
  data() {
    return {
      userId: this.$route.query.id,
      userInfo: {
        mobile: '',
        timeOfEntry: '',
        staffPhoto: ''
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
      this.doSave()
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

<style scoped lang="scss">
  .user-info{
    padding-top:20px;
  }
</style>
