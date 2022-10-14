<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <!-- 这里的添加是页面级别的权限 ，type=1, pid=0  -->
          <el-button type="primary" size="small" @click="hAdd(1,'0')">添加权限</el-button>
        </div>
        <el-table border :data="list" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- type为1表示页面级别的权限，它可以继续做添加=== 这个页面上的按钮级别的权限
              这里的添加是按钮级别的权限 ，type=2, pid= scope.row.id?
              -->
              <el-button v-if="scope.row.type===1" type="text" @click="hAdd(2, scope.row.id)">添加</el-button>
              <el-button type="text" @click="hEdit(scope.row.id)">编辑</el-button>
              <!-- 没有children，则删除可以看见 -->
              <el-button v-if="scope.row.children.length===0" type="text" @click="hDel(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 添加/编辑权限 -->
    <el-dialog :title="isEdit? '编辑' : '添加'" :visible.sync="showDialog" @close="hClose">
      <!-- 表单内容 -->
      <el-form ref="refForm" :model="formData" label-width="100px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" />
        </el-form-item>
        <el-form-item label="权限启用">
          <el-switch
            v-model="formData.enVisible"
            active-text="开启"
            active-value="1"
            inactive-text="关闭"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div style="text-align: right;">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="hSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionList,
  addPermission,
  delPermission,
  getPermissionDetail,
  updatePermission
} from '@/api/permission'

import { arrayToTree } from '@/utils/index.js'
export default {
  data() {
    return {
      list: [],

      // 表单
      showDialog: false, // 是否显示弹层
      formData: {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型
      },
      isEdit: false
    }
  },
  created() {
    this.loadPermission()
  },
  methods: {

    async hEdit(id) {
      this.isEdit = true
      // 1. 弹框
      this.showDialog = true
      // 2. 发请求，根据id拿到详情
      const res = await getPermissionDetail(id)
      console.log(res)
      this.formData = res.data
    },
    hDel(id) {
      // 1. 用户确认
      this.$confirm('确认要删除吗？', '系统提示').then(async() => {
        // 2. 调用接口
        await delPermission(id)
        // 3. 提示
        this.$message.success('删除成功')
        // 4. 重发请求
        this.loadPermission()
      }).catch(() => {

      })
    },
    hClose() {
      console.log('xxxx')
      // 1. 强制重置表单内容
      this.formData = {
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        enVisible: '0', // 开启
        pid: '', // 添加到哪个节点下
        type: '' // 类型
      }
      // 关闭弹框要做的事
      // resetFields:清空校验失败的提示信息
      this.$refs.refForm.resetFields()
    },
    async doEdit() {
      // 1. 编辑功能
      await updatePermission(this.formData)
      // 2.关闭弹框
      this.showDialog = false
      // 3.提示
      this.$message.success('修改成功')
      // 4.刷新页面
      this.loadPermission()
    },
    async doAdd() {
      this.isEdit = false
      // 1. 核心添加功能
      await addPermission(this.formData)
      // 2.关闭弹框
      this.showDialog = false
      // 3.提示
      this.$message.success('添加成功')
      // 4.刷新页面
      this.loadPermission()
    },
    hSubmit() {
      // 表单校验
      this.isEdit ? this.doEdit() : this.doAdd()
    },
    hAdd(type, pid) {
      console.log(type, pid)

      // 保存type,pid
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    async loadPermission() {
      const res = await getPermissionList()
      this.list = arrayToTree(res.data)
    }
  }
}
</script>
