<template>
  <!-- // 分配角色 -->
  <div>
    <el-checkbox-group v-model="roleIds">
      <!-- 选中了某一项，值就是label，会装入v-model设置的数组 -->
      <!-- <el-checkbox label="A">apple</el-checkbox> -->
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>

    <div style="margin-top: 20px; text-align: right">
      <el-button type="primary" @click="hSave">确定</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </div>
  </div>
</template>
<script>
import { getRoles } from '@/api/roles.js'
import { getUserDetailById } from '@/api/user.js'
import { assignRoles } from '@/api/employees'

export default {
  props: {
    curId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 保存选中的角色的id
      roleIds: [],
      list: []
    }
  },
  created() {
    // 加载所有的角色
    this.loadRoles()

    // 加载当前的用户具备的角色
    this.loadRolesById()
  },
  methods: {
    async hSave() {
      // 1. 调用接口
      await assignRoles({ id: this.curId, roleIds: this.roleIds })
      // 2. 通知父组件关闭弹层
      this.$emit('success')
    },
    async loadRolesById() {
      // 根据用户的id获取他的角色
      const res = await getUserDetailById(this.curId)
      console.log('res', res)

      // 回填
      this.roleIds = res.data.roleIds
    },
    async loadRoles() {
      // pagesize是一个权宜之计： 接口中没有提供一次获取全部的角色的接口
      const res = await getRoles({ page: 1, pagesize: 100 })
      this.list = res.data.rows
    },
    closeDialog() {

    }
  }
}
</script>
