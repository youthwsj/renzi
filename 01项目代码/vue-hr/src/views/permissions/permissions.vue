<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 添加弹框 -->
      <el-dialog
        center
        width="600px"
        :title="isEdit?'修改权限':'添加权限'"
        :visible.sync="showDialog"
        :close-on-click-modal="false"
        @close="doclose"
      >
        <el-form
          ref="refFormData"
          :model="formData"
          label-width="90px"
          :rules="rules"
        >
          <el-form-item label="权限名称" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="权限标识" prop="code">
            <el-input v-model="formData.code" />
          </el-form-item>
          <el-form-item label="权限描述" prop="description">
            <el-input v-model="formData.description" />
          </el-form-item>
          <el-form-item label="权限启用">
            <el-switch
              v-model="formData.enVisible"
              active-text="启用"
              active-value="1"
              inactive-text="不启用"
              inactive-value="0"
            />
          </el-form-item>
          <el-form-item>
            <template>
              <div style="text-align: left;padding-left:20px">
                <el-button @click="showDialog = false">取消</el-button>
                <el-button type="primary" @click="hSubmit">确定</el-button>
              </div>
            </template>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right;padding: auto;">
          <el-button type="primary" size="small" @click="hadd('1', '0')">添加权限</el-button>
        </div>
        <el-table border :data="list" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button v-show="scope.row.type===1" type="text" @click="hadd('2', scope.row.id)">添加</el-button>
              <el-button type="text" @click="hEdit(scope.row.id,scope)">编辑</el-button>
              <el-button v-if="scope.row.children.length===0" type="text" @click="hdel(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getPermissionList, addPermission, delPermission, getPermissionDetail
  , updatePermission } from '@/api/permisson'
import { array2Tree } from '@/utils/index'
export default {
  components: {

  },
  data() {
    // 自定义编码重复验证函数
    const validCode = (rule, value, callback) => {
      let codeList = this.initialList.map(item => item.code)
      console.log(codeList)
      if (this.isEdit) {
        // 排除当前的用户值pid
        codeList = this.initialList.filter(item => item.id !== this.pid).map(item => item.code)
      }
      // 判断code是否重复
      if (codeList.includes(value)) {
        callback(new Error('标识' + value + '已经存在'))
      } else {
        callback()
      }
    }
    // 自定义名称重复验证
    const validName = (rule, value, callback) => {
      let nameList = this.initialList.filter(item => item.pid === this.pid).map(item => item.name)
      // console.log(nameList)
      if (this.isEdit) {
        nameList = this.initialList.filter(item => item.pid === this.item.pid && item.id !== this.pid).map(item => item.name)
        console.log(nameList)
      }
      if (nameList.includes(value)) {
        callback(new Error(`名称${value}已经存在`))
      } else {
        callback()
      }
    }
    return {
      // 弹窗布尔值
      showDialog: false,
      // 当前点击id
      pid: '',
      // 初始数据
      initialList: [],
      // 页面表格数据
      list: [],
      // 弹窗数据
      formData: {
        name: '',
        code: '',
        description: '',
        enVisible: '0',
        type: '',
        pid: ''
      },
      // 是否编辑弹窗
      isEdit: false,
      // 验证规则
      rules: {
        name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' },
          { validator: validName, required: true, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '角色标识不能为空', trigger: 'blur' },
          { validator: validCode, required: true, trigger: 'blur' }
        ],
        description: [{ required: true, message: '描述不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.loadPermissionList()
  },
  methods: {
    // 获取表格数据
    async loadPermissionList() {
      const res = await getPermissionList()
      console.log('基本数据', res)
      this.initialList = res.data
      this.list = array2Tree(res.data, '0')
      console.log(this.list)
    },
    // 添加表单弹框
    hadd(type, pid) {
      this.pid = pid
      this.showDialog = true
      this.isEdit = false
      this.formData.pid = pid
      this.formData.type = type
    },
    // 添加
    async doAdd() {
      try {
        const res = await addPermission(this.formData)
        console.log(res)
        this.$message.success(res.message)
        this.showDialog = false
        this.loadPermissionList()
      } catch (error) {
        this.$message.error(error.message)
      }
    },
    // 确认按钮
    hSubmit() {
      this.$refs.refFormData.validate((valid) => {
        if (valid) {
          this.isEdit ? this.doEdit() : this.doAdd()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 关闭函数
    doclose() {
      this.formData = {
        name: '',
        code: '',
        description: '',
        enVisible: '0',
        type: '',
        pid: ''
      }
      this.$refs.refFormData.resetFields()
      // this.$refs.refFormData.clearValidate()
      console.log('关闭弹框')
    },
    // 删除请求确认框
    hdel(id) {
      // 确认框
      this.$confirm('是否要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 删除操作
          this.doDel(id)
        })
        .catch(() => {})
    },
    // 删除调用api
    async doDel(id) {
      try {
        const res = await delPermission(id)
        console.log(res)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        // 2. 重发请求
        this.loadPermissionList()
      } catch (error) {
        this.$message({
          message: error.message,
          type: 'error'
        })
      }
    },
    // 编辑弹窗 数据回填
    async hEdit(id, scope) {
      this.pid = id
      console.log(scope)
      this.showDialog = true
      this.isEdit = true
      const res = await getPermissionDetail(id)
      this.formData = res.data
    },
    // 编辑确认弹窗
    async doEdit() {
      try {
        const res = await updatePermission(this.formData)
        console.log(res)
        this.loadPermissionList()
        this.showDialog = false
        this.$message.success(res.message)
      } catch (error) {
        this.$message.error(error.message)
      }
    }
  }
}
</script>
