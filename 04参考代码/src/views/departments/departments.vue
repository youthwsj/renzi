<template>
  <div class="department-container">
    <div class="app-container">
      <el-card>
        <!-- 用一个行列布局 -->
        <el-row type="flex" justify="space-between" align="middle" style="height: 40px">
          <el-col :span="20">
            <svg-icon icon-class="bank" /><span>江苏传智播客教育科技股份有限公司</span>
          </el-col>
          <el-col :span="4">
            <el-row type="flex" justify="end">
              <!-- 两个内容 -->
              <el-col>负责人</el-col>
              <!-- 下拉菜单 element -->
              <el-col>
                <el-dropdown>
                  <span>
                    操作<i class="el-icon-arrow-down" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <!-- 一级部门的pid就是'' -->
                    <el-dropdown-item @click.native="hAdd('')">添加一级部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <!-- 主体 -->
        <el-tree
          default-expand-all
          :data="data"
          :props="defaultProps"
        >
          <template slot-scope="{node, data}">
            <el-row type="flex" justify="space-between" align="middle" style="height: 40px;width:100%;">
              <el-col :span="20">
                <svg-icon icon-class="bank" /><span>{{ node.label }}</span>
              </el-col>
              <el-col :span="4">
                <el-row type="flex" justify="end">
                  <!-- 两个内容 -->
                  <el-col>{{ data.manager }}</el-col>
                  <!-- 下拉菜单 element -->
                  <el-col>
                    <el-dropdown>
                      <span>
                        操作<i class="el-icon-arrow-down" />
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="hAdd(data.id)">添加子部门</el-dropdown-item>
                        <el-dropdown-item @click.native="hEdit(data.id)">编辑部门</el-dropdown-item>
                        <el-dropdown-item @click.native="hDel(data.id)">删除部门</el-dropdown-item>
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

    <!-- close:是el-dialog自带的 -->
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="isEdit ? '编辑部门': '添加部门'"
      :visible.sync="showDialog"
      @close="hDialogClose"
    >
      <DeptDialog
        ref="refDeptDialog"
        :origin-list="originList"
        :is-edit="isEdit"
        :pid="curId"
        @success="hSuccess"
        @close="hClose"
      />
    </el-dialog>
  </div>
</template>
<script>
import { arrayToTree } from '@/utils/index'
import { getDepartment, delDepartment } from '@/api/department'
import DeptDialog from './deptDialog.vue'
export default {
  components: { DeptDialog },
  data() {
    return {
      isEdit: false, // 记录当前是否处于编辑
      curId: '', // 当前选中的部门ID
      showDialog: false, // 是否显示弹层
      // 保存数据
      data: [],
      // 设置具体的替换类名
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 收集数据提供给子组件做表单校验时，使用
      originList: []
    }
  },
  created() {
    // 发请求
    this.loadDepartment()
  },
  methods: {
    hDialogClose() {
      // 找到子组件，调用它的重置表单的方法
      console.log('弹框关闭了')
      this.$refs.refDeptDialog.resetForm()
    },
    // 子组件抛出了关闭事件
    hClose() {
      // alert('子组件抛出了关闭事件')
      this.showDialog = false
    },
    hSuccess() {
      // 子组件内部的操作成功了
      // 1. 关闭弹层
      this.showDialog = false
      // 2. 更新数据
      this.loadDepartment()
    },
    // 用户点了添加
    hAdd(id) {
      // 1. 显示弹框
      this.showDialog = true
      // 2. 拿到当前的id，方便传给子组件
      console.log(id)
      this.curId = id

      // 3. 设置状态为编辑
      this.isEdit = false
    },
    // 用户点击编辑
    hEdit(id) {
      // 1. 更新当前的id
      this.curId = id
      // 2. 设置状态为编辑
      this.isEdit = true
      // 3. 打开弹框
      this.showDialog = true

      // 找到子组件，要求它发请求，获取详情
      // 父组件中调用子组件的方法？
      this.$nextTick(() => {
        console.log(this.$refs.refDeptDialog)
        // 获取子组件的实例
        // 调用它的方法
        this.$refs.refDeptDialog.loadDepartmentDetail()
      })
    },
    async doDel(id) {
      // 1. 调用接口，做删除
      await delDepartment(id)

      // 2. 提示一下
      this.$message.success('删除成功')
      // 3. 更新数据
      this.loadDepartment()
    },
    // 用户点击删除
    hDel(id) {
      this.$confirm('你确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.doDel(id)
      }).catch(() => {})
    },
    // 加载数据
    async loadDepartment() {
      const res = await getDepartment()
      console.log('res', res)
      // 去掉第一项
      // 第一项就是企业信息，不属于某个部门
      res.data.depts.shift()

      console.log('res.data.depts', res.data.depts)

      // 收集数据提供给子组件做表单校验时，使用
      this.originList = res.data.depts.map(item => {
        return {
          id: item.id,
          pid: item.pid,
          name: item.name,
          code: item.code
        }
      })
      // 数组转成树
      this.data = arrayToTree(res.data.depts)
    },
    handleNodeClick(data) {
      console.log(data)
    }
  }
}
</script>
