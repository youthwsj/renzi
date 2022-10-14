<template>
  <div style="padding:2em;">
    <el-form ref="empForm" label-width="80px" :model="formData" :rules="rules">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <!-- 日期组件 -->
        <el-date-picker
          v-model="formData.timeOfEntry"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment">
          <!-- [{id: 1, label:'正式'},{id: 2, label:'非正式'}] -->
          <el-option v-for="item in employType" :key="item.id" :value="item.id" :label="item.label" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" @focus="hFocus" />
        <div v-show="isLoad">
          <!-- 部门信息，初始不显示；当部门数据拿回来之后才显示 -->
          <el-tree
            :data="departments"
            :props="{label:'name'}"
            @node-click="hNodeClick"
          />
        </div>
      </el-form-item>
      <el-form-item label="转正时间">
        <el-date-picker
          v-model="formData.correctionTime"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { TYPE_MAP } from '@/constant/index'
import { arrayToTree } from '@/utils/index'
import { getDepartment } from '@/api/department'
import { addEmployee } from '@/api/employees'
export default {
  data() {
    return {
      isLoad: false, // 是否加载完成部门信息
      employType: Object.keys(TYPE_MAP).map(key => { return { id: key, label: TYPE_MAP[key] } }),
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
      },
      departments: []
    }
  },
  created() {
    // this.loadDepartment()
  },
  methods: {
    resetForm() {
      this.formData = {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      }
      this.$refs.empForm.resetFields()
    },
    hNodeClick(data) {
      console.log(data)
      if (data.children.length) {
        // 有子级
        return
      }
      // 点选的是具体的部门，就相当于是选中了
      // 1. 显示数据
      this.formData.departmentName = data.name
      // 2. 把tree收起来
      this.isLoad = false
    },
    hFocus() {
      this.loadDepartment()
    },
    // 加载数据
    async loadDepartment() {
      const res = await getDepartment()
      this.isLoad = true
      // 去掉第一项
      // 第一项就是企业信息，不属于某个部门
      res.data.depts.shift()
      // 数组转成树
      this.departments = arrayToTree(res.data.depts)
    },
    async doAdd() {
      try {
        await addEmployee(this.formData)
        // 通知父组件： 关闭弹层，更新数据
        this.$emit('success')
      } catch {
        this.$message.error('添加失败')
      }
    },
    onSubmit() {
      // 手动兜底校验
      this.$refs.empForm.validate(valid => {
        if (valid) {
          this.doAdd()
        }
      })
    }
  }
}
</script>
