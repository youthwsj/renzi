<template>
  <el-form ref="deptForm" :rules="rules" :model="form" label-width="120px">
    <el-form-item label="部门名称" prop="name">
      <el-input v-model="form.name" style="width:80%" placeholder="1-50个字符" />
    </el-form-item>
    <el-form-item label="部门编码" prop="code">
      <el-input v-model="form.code" style="width:80%" placeholder="1-50个字符" />
    </el-form-item>
    <el-form-item label="部门负责人" prop="manager">
      <el-select v-model="form.manager" style="width:80%" placeholder="请选择">
        <el-option
          v-for="item in list"
          :key="item.id"
          :value="item.username"
          :label="item.username"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="部门介绍" prop="introduce">
      <el-input v-model="form.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="small" @click="hSubmit">确定</el-button>
      <el-button size="small" @click="hCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import { getEmployeeSimple } from '@/api/employees'
import { addDepartments, getDepartDetail, updateDepartments } from '@/api/department'
export default {
  props: {
    pid: {
      required: true,
      type: String
    },
    isEdit: {
      required: true,
      type: Boolean
    },
    originList: {
      required: true,
      type: Array
    }
  },
  data() {
    const validCode = (rule, value, callback) => {
      console.log(value, this.originList)
      // const obj = this.originList.find(item=>item.code === value)
      // 添加子部门， 部门code不能与originList中的code有重复

      // 1.已经存在的部门编号
      let existCodeList = this.originList.map(item => item.code) // ['XZB', 'CWB', ..... ]
      // 如果是编辑状态，把 当前编辑的部门编号排除在外
      if (this.isEdit) {
        // (1) 根据当前的编号找到对应的部门的code
        const curDep = this.originList.find(item => item.id === this.pid)
        const curCode = curDep.code
        //  (2) 排除当前正在编辑的部门在外
        existCodeList = existCodeList.filter(item => item !== curCode)
      }

      // if(this.originList.map(item=>item.code).includes(value)){
      // 2. 在已经存在的部门做判断
      if (existCodeList.includes(value)) {
        callback(new Error(value + ':编码被占用了'))
      } else {
        callback()
      }
    }

    // 校验部门名称
    const validName = (rule, value, callback) => {
      console.log(value, this.originList)
      // 1. 当前被占用的部门名字
      //    添加时：在所有的部门中，找pid为当前父组件中点击添加时，拿到的部门的id
      let existNameList = this.originList.filter(item => item.pid === this.pid).map(item => item.name) // ['xxxx', 'yyyy']

      if (this.isEdit) {
        // 编辑时： this.pid 保存的是当前在父组件中被点击的部门的id
        // 被占用的部门名字 = 当前被编辑的部门的同级部门 - 当前被编辑的部门
        // (1) 根据当前的部门的id，找到pid
        const obj = this.originList.find(item => item.id === this.pid)
        const pid = obj.pid

        // 当前被编辑的部门的同级部门 - 当前被编辑的部门
        existNameList = this.originList.filter(item => item.pid === pid && item.id !== this.pid).map(item => item.name)

        console.log('existNameList', existNameList)
      }

      // 2. 检查当前的名称是否存在
      if (existNameList.includes(value)) {
        callback(new Error(value + ':名称被占用了'))
      } else {
        callback()
      }
    }

    return {
      list: [], // 所有的员工信息
      form: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          { validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          { validator: validCode, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能为空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍要求1-300个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    console.log('组件创建了。。。。')
    this.loadEmployees()
    // // 如果当前是编辑状态，发请求获取部门的详情
    // if(this.isEdit) {
    //   this.loadDepartmentDetail()
    // }
  },
  methods: {
    // 做添加
    async doAdd() {
      const d = { ...this.form, pid: this.pid }
      await addDepartments(d)

      // 通知父组件：关闭弹层，更新数据
      this.$emit('success')
    },
    // 做修改
    async doEdit() {
      await updateDepartments(this.form)
      // 通知父组件：关闭弹层，更新数据
      this.$emit('success')
    },
    hSubmit() {
      // 1. todos 表单校验
      this.$refs.deptForm.validate(valid => {
        if (valid) {
          // 2. 具体做添加 | 编辑
          this.isEdit ? this.doEdit() : this.doAdd()
        }
      })
    },
    resetForm() {
      console.log('重置表单的方法')
      this.$refs.deptForm.resetFields()
    },
    hCancel() {
      this.$emit('close')
    },
    async loadDepartmentDetail() {
      // 根据当前的id去拿详情
      const res = await getDepartDetail(this.pid)
      console.log('res', res)

      // 数据回填
      this.form = res.data
    },
    async loadEmployees() {
      const res = await getEmployeeSimple()
      this.list = res.data
    }
  }
  // watch: {
  //   pid(newVal, oldVal){
  //     console.log(newVal)
  //     // 只有编辑时，才去获取初始值
  //     if(this.isEdit){
  //       this.loadDepartmentDetail()
  //     }
  //   }
  // }
}
</script>
