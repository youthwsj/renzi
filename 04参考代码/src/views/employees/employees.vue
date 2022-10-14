<template>
  <div class="employees-container">
    <div class="app-container">
      <PageTools title="总记录数据20条">
        <!-- v-if="$store.state.user.userInfo.roles.points.includes('import_excel')" -->
        <el-button
          v-allow="'import_excel'"
          type="warning"
          size="small"
          @click="$router.push('/import')"
        >excel {{ $t('route.import') }}</el-button>
        <!-- v-if="$store.state.user.userInfo.roles.points.includes('export_excel')" -->
        <el-button
          v-allow="'export_excel'"
          type="danger"
          size="small"
          @click="hExportExcel"
        >
          <!-- 如果vuex中points有 “export_excel” 就创建按钮 -->
          excel导出
        </el-button>
        <el-button
          v-allow="'add_employee'"
          type="primary"
          size="small"
          @click="showDialog = true"
        >
          新增员工
        </el-button>
      </PageTools>
      <el-card style="margin-top: 10px;">
        <el-table border :data="employee" :default-sort="{prop: 'timeOfEntry'}">
          <el-table-column type="index" label="序号" />
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="staffPhoto" label="头像">
            <template slot-scope="scope">
              <ImageHolder :src="scope.row.staffPhoto" />
            </template>
          </el-table-column>
          <el-table-column prop="workNumber" sortable label="工号" />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template slot-scope="scope">
              {{ format(scope.row.formOfEmployment) }}
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" sortable label="入职时间" />
          <!-- <el-table-column prop="username" label="账户状态" /> -->
          <el-table-column label="操作" width="280">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="$router.push('/employees/detail?id='+scope.row.id)">{{ $t('table.view') }}</el-button>
              <el-button type="text" size="small" @click="hAssign(scope.row.id)">分配角色</el-button>
              <el-button type="text" size="small" @click="hDel(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            :total="total"
            :current-page="page"
            :page-size="size"
            :page-sizes="[2,5,10,20]"
            layout="total,sizes,prev, pager, next"
            @current-change="hCurrentChange"
            @size-change="hSizeChange"
          />
        </el-row>
      </el-card>
    </div>

    <!-- 取消esc，遮罩点击关闭弹框的效果 -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="添加"
      :visible.sync="showDialog"
      @close="hClose"
    >
      <!-- <EmpDialog v-if="showDialog" @success="hSuccess" /> -->
      <EmpDialog ref="empDialog" @success="hSuccess" />
    </el-dialog>

    <el-dialog :visible.sync="showDialogRole">
      <AssignRole v-if="showDialogRole" :cur-id="curId" @success="hSuccessRole" />
    </el-dialog>
  </div>
</template>
<script>
import { TYPE_MAP } from '@/constant/index'

import { getEmployee, delEmployee } from '@/api/employees'
import EmpDialog from './EmpDialog.vue'
import AssignRole from './AssignRole.vue'
export default {
  components: { EmpDialog, AssignRole },
  data() {
    return {
      employee: [],

      // 分页
      total: 0,
      page: 1,
      size: 2,
      showDialog: false, // 添加 员工
      showDialogRole: false, // 设置角色

      curId: '' // 当前的员工id
    }
  },
  created() {
    this.loadEmployee()

    setTimeout(() => {
      this.$i18n.locale = 'zh'
    }, 3000)
  },
  methods: {
    // 子组件保存角色成功
    hSuccessRole() {
      this.showDialogRole = false

      this.$message.success('保存成功')
    },
    hAssign(id) {
      // 1. 显示弹框
      this.showDialogRole = true

      // 2. 保存id
      this.curId = id
    },
    // rows: [{mobile:'13600000001', usename:'吕勇锐'}, {mobile:'13600000002', usename:'袁永安'}]
    //
    // data:
    //  [
    //   ["13600000001", "吕勇锐"]
    //   ["13600000002", "袁永安"]
    //  ]
    formatData(rows) {
      // 表头
      // 英文的表头['mobile', 'usename']，要转换成中文的 ['手机号', '用户名']
      const enHeader = Object.keys(rows[0])

      const mapObj = {
        'id': '编号',
        'password': '密码',
        'mobile': '手机号',
        'username': '姓名',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门',
        'staffPhoto': '头像地址'
      }
      const header = enHeader.map(en => mapObj[en])

      // 内容
      const data = rows.map(obj => {
        // 把聘用格式进行转换
        // obj.formOfEmployment ====> 1, 2
        obj.formOfEmployment = TYPE_MAP[obj.formOfEmployment]
        return Object.values(obj)
      })

      return { header, data }
    },
    async hExportExcel() {
      // 1. 发请求拿数据
      const res = await getEmployee({ page: this.page, size: this.size })
      // 2. 对数据进行格式转换
      const { header, data } = this.formatData(res.data.rows)
      // 3. 导出
      console.log('员工信息', header, data)

      import('@/vendor/Export2Excel').then(excel => {
        // 准备数据
        // const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
        // const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
        // const list = this.list
        // const data = this.formatJson(filterVal, list)

        // 生成excel
        excel.export_json_to_excel({
          header, // 表头 必填
          data, // 具体数据 必填
          filename: '员工信息', // 文件名称
          autoWidth: true, // 宽度是否自适应
          bookType: 'xlsx' // 生成的文件类型
        })
      })
    },
    hClose() {
      // 清空子组件的表单数据 & 校验结果
      // 思路：在子组件内部提供一个方法，在父组件调用
      this.$refs.empDialog.resetForm()
    },
    // 子组件添加成功
    hSuccess() {
      console.log('子组件添加成功')
      // 1. 关闭弹层
      this.showDialog = false
      // 2. 更新数据
      this.loadEmployee()
    },
    async doDel(id) {
      // 1. 调用接口做删除
      await delEmployee(id)
      // 判断如果当前删除是表格中最后一条数据，要把页码-1
      if (this.employee.length === 1) {
        if (this.page > 1) {
          this.page--
        }
      }
      // 2. 提示用户，删除成功了
      this.$message.success('删除成功')
      // 3. 重新加载
      this.loadEmployee()
    },
    // 用户点击了删除
    hDel(id) {
      // 弹框确认删除
      // await this.$confirm('确认要删除吗？', '系统提示')
      // this.doDel(id)

      this.$confirm('确认要删除吗？', '系统提示').then(() => {
        this.doDel(id)
      }).catch(() => {})
    },
    // 更改每页显示几条数据
    hSizeChange(curPagesize) {
      console.log(curPagesize)
      // 1. 更新参数
      this.size = curPagesize
      this.page = 1
      // 2. 重发请求
      this.loadEmployee()
    },
    // 自动接收当前的页码
    hCurrentChange(curPage) {
      console.log(curPage)
      // 1. 更新页码
      this.page = curPage
      // 2. 重发请求
      this.loadEmployee()
    },
    format(type) {
      return TYPE_MAP[type] || '未知'
    },
    async loadEmployee() {
      const res = await getEmployee({ page: this.page, size: this.size })
      console.log('员工信息', res)
      // 保存
      this.employee = res.data.rows
      this.total = res.data.total
    }
  }
}
</script>
