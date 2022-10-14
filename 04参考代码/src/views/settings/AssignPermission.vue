<template>
  <div>
    这里在不久的将来要放入一个分配权限的 tree
    {{ roleId }}
    <!-- check-strictly
      在显示复选框的情况下，
      是否严格的遵循父子不互相关联的做法 -->
    <el-tree
      ref="tree"
      check-strictly
      :data="list"
      :props="{label: 'name'}"
      show-checkbox
      default-expand-all
      node-key="id"
    />
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small">取消</el-button>
        <el-button size="small" type="primary" @click="hSubmit">确定</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  getPermissionList
} from '@/api/permission'
import { arrayToTree } from '@/utils/index.js'
import { getRoleDetail, assignPerm } from '@/api/setting'
export default {
  props: {
    roleId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      list: []
    }
  },
  created() {
    // 1. 获取所有的权限点
    this.loadPermission()

    // 2. 根据当前的角色id，去获取这个角色所具有的权限点信息
    // this.loadPermissionById()
  },
  methods: {
    async hSubmit() {
      // 1. 组装参数（按接口文档的要求）
      const permIds = this.$refs.tree.getCheckedKeys() // 当前用户选中的节点的 id
      console.log('permIds', permIds)
      // 2. 调用api
      await assignPerm({ id: this.roleId, permIds: permIds })
      // 3. 关闭弹框
      this.$emit('success')
    },
    async loadPermission() {
      const res = await getPermissionList()
      this.list = arrayToTree(res.data)
    },
    async loadPermissionById() {
      const res = await getRoleDetail(this.roleId)
      console.log('当前的角色id', res)
      // 当前角色的权限是： res.data.permIds
      // 回填
      this.$refs.tree.setCheckedKeys(res.data.permIds)
    }
  }
}
</script>
