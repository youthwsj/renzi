<template>
  <div>子组件
    <el-tree
      ref="refTree"
      show-checkbox
      :data="list"
      :props="{label:'name'}"
      default-expand-all
      check-strictly
      node-key="id"
    />
    <el-button size="small" @click="hCancel()">取消</el-button>
    <el-button size="small" type="primary" @click="hSave()">确定</el-button>
  </div>
</template>

<script>
import { getPermissionList } from '@/api/permisson'
import { getRoleDetail, assignPerm } from '@/api/settings'
import { array2Tree } from '@/utils/index'
export default {
  props: {
    curId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      // 权限点列表
      list: [],
      keys: []
    }
  },
  created() {
    this.loadPermissionList()
    // this.lodaRoleDetail()
  },
  methods: {
    resetTree() {
      this.$refs.refTree.setCheckedKeys([])
    },
    // 获取当前角色权限 数据回填
    async lodaRoleDetail() {
      const res = await getRoleDetail(this.curId)
      console.log(res)
      this.keys = res.data.permIds
      this.$refs.refTree.setCheckedKeys(this.keys)
    },
    // 取消按钮
    hCancel() {
    // 通过父组件去关闭弹层
      this.$emit('close')
    },
    // 加载角色列表
    async  loadPermissionList() {
      const res = await getPermissionList()
      console.log(res)
      this.list = array2Tree(res.data, '0')
    },
    // 确认添加
    async hSave() {
      const list = this.$refs.refTree.getCheckedKeys()
      try {
        const res = await assignPerm({ id: this.curId, permIds: list })
        this.$message.success(res.message)
        console.log(res)
      } catch (error) {
        this.$message.error(error.message)
      }
      this.$emit('close')
    }
  }
}
</script>

<style>

</style>
