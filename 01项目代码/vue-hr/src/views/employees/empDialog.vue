<template>
  <!-- 表单 -->
  <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
    <el-form-item label="姓名" prop="username">
      <el-input v-model="formData.username" style="width:90%" placeholder="请输入姓名" />
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
      <el-input v-model="formData.mobile" style="width:90%" placeholder="请输入手机号" />
    </el-form-item>
    <el-form-item label="入职时间" prop="timeOfEntry">
      <el-date-picker v-model="formData.timeOfEntry" style="width:90%" placeholder="请选择入职时间" />
    </el-form-item>
    <el-form-item label="聘用形式" prop="formOfEmployment">
      <el-select v-model="formData.formOfEmployment" style="width:90%" placeholder="请选择">
        <el-option v-for="item in emphireType " :key="item.id" :label="item.value" :value="item.id" />
      </el-select>
    </el-form-item>
    <el-form-item label="工号" prop="workNumber">
      <el-input v-model="formData.workNumber" style="width:90%" placeholder="请输入工号" />
    </el-form-item>
    <el-form-item label="部门" prop="departmentName">
      <el-input
        v-model="formData.departmentName"
        style="width:90%"
        placeholder="请选择部门"
        @focus="hfoucs"
      />
      <el-tree
        v-show="showtree"
        :data="treeData"
        :props="{label:'name'}"
        @node-click="gettree"
      />
    </el-form-item>
    <el-form-item label="转正时间" prop="correctionTime">
      <el-date-picker v-model="formData.correctionTime" style="width:90%" placeholder="请选择转正时间" />
    </el-form-item>
    <el-form-item>
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="hSubmit">确定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { addEmployees } from '@/api/employees'
// 引入枚举
import EmployeesEnum from '@/constant/employees'
import { getDepartments } from '@/api/department'
import { array2Tree } from '@/utils/index'
export default {
  data() {
    return {
      // 树状结构部门
      treeData: [],
      showtree: false,
      //   聘用形式数组
      emphireType: EmployeesEnum.hireType,
      //    表单数据
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadDepartments()
  },
  methods: {
    // 确认按钮
    hSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          // 做添加
          this.hadd()
          this.$emit('close')
        }
      })
    },
    // 增加数据
    async hadd() {
      try {
        const res = await addEmployees(this.formData)
        console.log(res)
        this.$message({
          type: 'success',
          message: res.message
        })
        this.$emit('success')
      } catch (error) {
        this.$message({
          type: 'error',
          message: error
        })
      }
    },
    // 获取树状结构
    async loadDepartments() {
      const res = await getDepartments()
      this.treeData = array2Tree(res.data.depts, '')
      console.log(res, this.treeData)
    },
    // 选择部门
    hfoucs() {
      this.showtree = true
    },
    // 确认部门
    gettree(data, node, me) {
      console.log(data, node, me)
      if (!data.children.length) {
        this.formData.departmentName = data.name
        this.showtree = false
      }
    },
    // 去清空表单
    resetForm() {
      this.$refs.addForm.resetFields()
    }
  }
}
</script>
