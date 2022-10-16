<template>
  <div class="department-container">
    <div class="app-container">
      <el-card>
        <!-- 用一个行列布局 -->
        <!-- el的栅格系统： 一行分24列 -->
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          style="height: 40px"
        >
          <el-col :span="20">
            <svg-icon icon-class="bank" />
            <span>威龙食品</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <!-- 两个内容 -->
              <el-col>负责人</el-col>
              <!-- 下拉菜单 element -->
              <el-col>
                <el-dropdown>
                  <span> 操作<i class="el-icon-arrow-down" /> </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native="hAdd('')"
                    >添加子部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- 主体 -->
        <el-tree icon-class="list" :data="list" default-expand-all>
          <template v-slot="scope">
            <el-row
              type="flex"
              justify="space-between"
              align="middle"
              style="height: 40px; width: 100%"
            >
              <el-col :span="20">
                <span>{{ scope.data.name }}</span>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="end">
                  <!-- 两个内容 -->
                  <el-col>{{ scope.data.manager }}</el-col>
                  <!-- 下拉菜单 element -->
                  <el-col>
                    <el-dropdown>
                      <span> 操作<i class="el-icon-arrow-down" /> </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          @click.native="hAdd(scope.data.id)"
                        >添加子部门</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="hEDit(scope.data)"
                        >编辑部门</el-dropdown-item>
                        <el-dropdown-item
                          @click.native="hDel(scope.data.id)"
                        >删除部门</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-tree>
      </el-card>
    </div>

    <el-dialog
      ref="deptDialog"
      :close-on-click-modal="false"
      :title="(isEdit?'编辑':'添加')+'部门'"
      :visible.sync="showDialog"
      @close="hDialogClose"
    >
      <depDialog
        ref="refDeptDialog"
        :item="item"
        :origin-list="originList"
        :is-edit="isEdit"
        :pid="curId"
        @close="hClose"
        @success="hSuccess"
      />
    </el-dialog>
  </div>
</template>
<script>
import { getDepartments, delDepartment } from '@/api/department'
import { array2Tree } from '@/utils/index'
import depDialog from './depDialog.vue'
export default {
  components: { depDialog },
  // 1. vuex: actions
  // 2. 路由跳转
  // 3. 组件created
  data() {
    return {
      item: {},
      curId: '',
      showDialog: false,
      // 区分编辑和添加
      isEdit: '',
      // 依赖一份树形数据
      list: [
        {
          name: '财务部',
          manager: '刘备',
          children: [
            {
              name: '财务核算部',
              manager: '张飞'
            },
            {
              name: '税务核算部',
              manager: '关羽'
            }
          ]
        },
        {
          name: '财务部',
          manager: '刘备',
          children: [
            {
              name: '财务核算部',
              manager: '张飞'
            },
            {
              name: '税务核算部',
              manager: '关羽'
            }
          ]
        }
      ],
      originList: []
    }
  },
  created() {
    this.loadDepartments()
  },
  methods: {
    // 收到子组件的事件: 操作成功
    hSuccess() {
      // alert('收到子组件的事件: 操作成功')
      // 1. 关闭弹层
      this.showDialog = false
      // 2. 更新数据
      this.loadDepartments()
    },
    async doDel(id) {
      // 1. 调用接口做删除
      await delDepartment(id)
      this.$message.success('删除成功')
      // 2. 重发请求
      this.loadDepartments()
    },
    // 删除部门
    hDel(id) {
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
    // 编辑部门
    hEDit(data) {
      console.log('当前员工内容', data)
      this.curId = data.id
      this.isEdit = true
      // 2. 点击编辑部门，显示弹框
      this.showDialog = true
      // 4.赋值当前内容
      this.item = data
      // 解决点击不更新修改数据的bug
      this.$nextTick(() => {
        console.log('找子组件', this.$refs.showDialog)
        // 通过子组件获取信息列表
        this.$refs.refDeptDialog.loadgetDepartDetail()
      })
    },
    // 添加部门
    hAdd(id) {
      // 1. 获取当前被点击的部门的id
      console.log(id)
      this.curId = id
      // 2. 点击添加部门，显示弹框
      this.showDialog = true
      // 3.区分添加和编辑
      this.isEdit = false
    },
    async loadDepartments() {
      const res = await getDepartments()
      res.data.depts.shift()
      // 根据业务的需要，去掉数组第一个元素
      // console.log(res.data.depts)
      // 渲染数据
      this.list = array2Tree(res.data.depts, '')
      this.originList = res.data.depts.map(({ id, pid, name, code }) => {
        return { id, pid, name, code }
      })
    },
    // 关闭弹框 取消
    hClose() {
      this.showDialog = false
    },
    // 调用子组件清空表单
    hDialogClose() {
      // console.log('close')
      this.$refs.refDeptDialog.resetForm()
    }
  }
}
</script>
