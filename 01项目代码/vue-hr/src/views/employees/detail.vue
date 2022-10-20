<template>
  <div class="employees-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <LoginSetting />
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <UserInfo />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <JobInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import JobInfo from '@/views/employees/components/job-info.vue'
import LoginSetting from '@/views/employees/components/login-setting.vue'
import UserInfo from '@/views/employees/components/user-info.vue'
export default {
  components: {
    JobInfo,
    LoginSetting,
    UserInfo
  },
  data() {
    return {
    }
  }
}
</script>
