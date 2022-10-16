<template>
  <div>
    <el-form ref="deptForm" :rules="rules" :model="form">
      <el-form-item label="部门名称" prop="name" label-width="100px">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code" label-width="100px">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager" label-width="100px">
        <el-select v-model="form.manager">
          <el-option
            v-for="item in list"
            :key="item.id"
            :value="item.username"
            :label="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍" label-width="100px">
        <el-input v-model="form.introduce" type="textarea" />
      </el-form-item>

      <el-form-item>
        <el-button @click="hCancel">取消{{ pid }}</el-button>
        <el-button type="primary" @click="hSubmit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  getSimpleEmployee,
  addDepartment,
  getDepartDetail,
  updateDepartment } from '@/api/department'
export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    pid: {
      type: String,
      required: true
    },
    isEdit: {
      type: Boolean,
      required: true
    },
    originList: {
      type: Array,
      required: true
    }
  },
  data() {
    // 自定义编码重复验证函数
    const validCode = (rule, value, callback) => {
      let codeList = this.originList.map(item => item.code)
      console.log(codeList)
      if (this.isEdit) {
        // 排除当前的用户值pid
        codeList = this.originList.filter(item => item.id !== this.pid).map(item => item.code)
      }
      // 判断code是否重复
      if (codeList.includes(value)) {
        callback(new Error('编码' + value + '已经存在'))
      } else {
        callback()
      }
    }
    // 自定义名称重复验证
    const validName = (rule, value, callback) => {
      let nameList = this.originList.filter(item => item.pid === this.pid).map(item => item.name)
      // console.log(nameList)
      if (this.isEdit) {
        nameList = this.originList.filter(item => item.pid === this.item.pid && item.id !== this.pid).map(item => item.name)
        console.log(nameList)
      }
      if (nameList.includes(value)) {
        callback(new Error(`名称${value}已经存在`))
      } else {
        callback()
      }
    }
    return {
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 2, max: 50, message: '部门名称要求2-50个字符', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 2, max: 50, message: '部门编码要求2-50个字符', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'change' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 10, max: 300, message: '部门介绍要求10-300个字符', trigger: 'blur' }
        ]
      },
      form: {
        name: '',
        introduce: '',
        manager: '',
        code: ''
      },
      list: []
    }
  },
  watch: {
    // 'pid': {
    //   handler: async function(newl, oldv) {
    //     console.log('新值', newl, '旧值', oldv)
    //     if (this.isEdit) {
    //       await this.loadgetDepartDetail()
    //     }
    //   },
    //   immediate: true
    // }
  },
  created() {
    this.loadSimpleEmployee()
    // this.loadgetDepartDetail()
  },
  methods: {
    // 获取用户表单信息
    async loadgetDepartDetail() {
      if (this.isEdit) {
        // alert('现在是编辑，要去获取详情')
        const res = await getDepartDetail(this.pid)
        // console.log('现在是编辑，要去获取详情', res)
        this.form = res.data
      }
    },
    async loadSimpleEmployee() {
      const res = await getSimpleEmployee()
      // console.log(res.data)
      this.list = res.data
    },
    // 添加信息
    async doAdd() {
      console.log(this.item)
      // 调用接口
      try {
        await addDepartment({ ...this.form, pid: this.pid })
        // 通知父组件操作成功
        this.$emit('success')
      } catch (err) {
        console.log(err)
      }
    },
    // 修改信息
    async doEdit() {
      // 调用接口
      try {
        await updateDepartment(this.form)
        // 通知父组件操作成功
        this.$emit('success')
      } catch (err) {
        console.log(err)
      }
    },
    // 判断弹框来确认不同对信息操作
    hSubmit() {
      this.$refs.deptForm.validate(vaild => {
        if (vaild) {
          this.isEdit ? this.doEdit() : this.doAdd()
        }
      })
      // if (this.isEdit) {
      //   this.doEdit()
      // } else {
      //   this.doAdd()
      // }
    },
    // 取消关闭
    hCancel() {
      this.$emit('close')
    },
    // 清空表单
    resetForm() {
      this.$refs.deptForm.resetFields()
      // console.log('resetForm')
    }
  }
}
</script>
