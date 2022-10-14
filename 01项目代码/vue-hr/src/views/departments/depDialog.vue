<template>
  <div>
    这里将会有一个表单

    <el-form>

      <el-form-item label="部门名称" label-width="100px">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="部门编码" label-width="100px">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="部门负责人" label-width="100px">
        <el-select v-model="form.manager">
          <el-option
            v-for="item in list"
            :key="item.id"
            :value="item.username"
            :label="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" label-width="100px">
        <el-input v-model="form.introduce" />
      </el-form-item>

      <el-form-item>
        <el-button>取消{{ pid }}</el-button>
        <el-button type="primary" @click="hSubmit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { getSimpleEmployee, addDepartment } from '@/api/department'
export default {
  props: {
    pid: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: {
        name: '',
        introduce: '',
        manager: '',
        code: ''
      },
      list: []
    }
  },
  created() {
    this.loadSimpleEmployee()
  },
  methods: {
    async loadSimpleEmployee() {
      const res = await getSimpleEmployee()

      // console.log(res.data)
      this.list = res.data
    },
    async doAdd() {
      // 调用接口
      try {
        await addDepartment({ ...this.form, pid: this.pid })

        // 通知父组件操作成功
        this.$emit('success')
      } catch (err) {
        console.log(err)
      }
    },
    hSubmit() {
      this.doAdd()
    }
  }
}
</script>
