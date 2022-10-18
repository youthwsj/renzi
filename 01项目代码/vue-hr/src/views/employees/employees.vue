<template>
  <div class="department-container">
    <div class="app-container">
      <!-- 头部公共组件 -->
      <Pagetools>
        <template #left> 总记录条数:20 </template>
        <template #right>
          <el-button type="primary" size="medium" @click="$router.push('/import')">
            导入excel
          </el-button>
          <el-button type="success" size="medium">导出excel</el-button>
          <el-button
            type="warning"
            size="medium"
            @click="hAdd()"
          >新增员工</el-button>
        </template>
      </Pagetools>
      <!-- 表格区域 -->
      <el-card>
        <!-- 具体页面结构 -->
        <el-table border :data="list" :default-sort="{ prop: 'workNumber' }">
          <el-table-column label="序号" type="index" :index="indexMethod" />
          <el-table-column label="姓名" prop="username" />
          <el-table-column label="工号" prop="workNumber" />
          <el-table-column label="聘用形式">
            <template v-slot="scope">
              {{ formatEmployment(scope.row.formOfEmployment) }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName" />
          <el-table-column label="入职时间" prop="timeOfEntry" sortable />
          <el-table-column label="操作" width="280">
            <template v-slot="scope">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">分配角色</el-button>
              <el-button
                type="text"
                size="small"
                @click="delp(scope.row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row
          type="flex"
          justify="center"
          align="middle"
          style="height: 60px"
        >
          <el-pagination
            :current-page="page"
            :page-sizes="[2, 5, 8, 10]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-card>
      <!-- 信息弹框子组件 -->
      <el-dialog
        width="500px"
        title="新增"
        :visible.sync="showdialog"
        :close-on-click-modal="false"
      >
        <EmpDialog @success="addSuccess" @close="showdialog = false" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getEmployees, delEmployee } from '@/api/employees'
// 引入枚举
import EmployeesEnum from '@/constant/employees'
// 引入子组件
import EmpDialog from '@/views/employees/empDialog.vue'

const EMPLOYEES = EmployeesEnum.hireType.reduce((num, item, index) => {
  num[item.id] = item.value
  // console.log('第一个参数', num, '第二个参数', item, '第三个参数下标', index)
  return num
}, {})

export default {
  components: {
    EmpDialog
  },
  data() {
    return {
      list: [],
      page: 1,
      size: 10,
      total: 0,
      showdialog: false
    }
  },
  created() {
    this.loadEmployees()
  },
  methods: {
    // 加载页面数据
    async loadEmployees() {
      const res = await getEmployees({ page: this.page, size: this.size })
      console.log(res)
      this.list = res.data.rows
      this.total = res.data.total
    },
    // 枚举找对应的value
    formatEmployment(id) {
      // const item = EmployeesEnum.hireType.find(item => item.id === id)
      // if (item) {
      //   return item.value
      // } else {
      //   return '未知'
      // }
      return EMPLOYEES[id] || '未知'
    },
    // 每页条数改变
    handleSizeChange(sum) {
      this.page = 1
      this.size = sum
      this.loadEmployees()
    },
    // 当前页码变化
    handleCurrentChange(sum) {
      this.page = sum
      this.loadEmployees()
    },
    // 删除请求确认框
    delp(id) {
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
        const res = await delEmployee(id)
        console.log(res)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      } catch (error) {
        this.$message({
          message: error.message,
          type: 'error'
        })
      }
      // 判断删除的是否是当前最后一条数据
      // 2. 重发请求
      if (this.list.length <= 1) {
        this.page--
        this.page = Math.max(1, this.page)
      }
      this.loadEmployees()
    },
    // 新增按钮
    hAdd() {
      this.showdialog = true
    },
    // 序号连续
    indexMethod(index) {
      return index + 1 + (this.page - 1) * this.size
    },
    // 新增成功
    addSuccess() {
      this.showdialog = false
      this.total++
      this.page = Math.ceil(this.total / this.size)
      this.loadEmployees()
    }
  }
}
</script>
