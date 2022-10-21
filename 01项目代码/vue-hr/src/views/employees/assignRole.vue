<template>
  <!-- // 分配角色 -->
  <div>
    <el-checkbox-group v-model="roleIds">
      <!-- 注意：label决定当前选中的值 -->
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <div style="margin-top: 20px; text-align: right">
      <el-button type="primary" @click="hSubmit">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>
<script>
import { getRoles, getUserDetailById, assignRoles } from '@/api/settings'
export default {
  props: {
    curEmployeId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      roleIds: [],
      roleList: []
    }
  },
  created() {
    this.loadRoles()
  },
  methods: {
    closeDialog() {
      this.$emit('success')
    },
    // 设置角色
    async  hSubmit() {
      const res = await assignRoles({ id: this.curEmployeId, roleIds: this.roleIds })
      console.log(res)
      this.$emit('success')
    },
    // 加载页面
    async loadRoles() {
      const res = await getRoles({ page: 1, size: 1000 })
      const res2 = await getUserDetailById(this.curEmployeId)
      console.log('角色列表', res, '角色信息', res2)
      //   获取角色列表
      this.roleList = res.data.rows
      //   获取员工的角色
      this.roleIds = res2.data.roleIds
    }
  }
}
</script>
<style lang="sass">

</style>
