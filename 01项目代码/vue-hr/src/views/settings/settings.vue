<template>
  <div class="department-container">
    <div class="app-container">
      <el-card>
        <!-- 具体页面结构 -->
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog=!showDialog"
              >新增角色</el-button>
            </el-row>
            <!-- 新增角色的弹框 -->
            <el-dialog
              title="编辑弹层"
              :close-on-click-modal="false"
              :close-on-press-escape="false"
              :visible.sync="showDialog"
            >
              <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="100px">
                <el-form-item label="角色名称" prop="name">
                  <el-input v-model="roleForm.name" />
                </el-form-item>
                <el-form-item label="角色描述" prop="description">
                  <el-input v-model="roleForm.description" />
                </el-form-item>
              </el-form>
              <!-- 底部 -->
              <el-row slot="footer" type="flex" justify="center">
                <el-col :span="6">
                  <el-button size="small">取消</el-button>
                  <el-button size="small" type="primary" @click="hSubmit">确定</el-button>
                </el-col>
              </el-row>
            </el-dialog>
            <!-- 表格区域 -->
            <el-table :data="roles">
              <el-table-column label="序号" width="120" type="index" />
              <el-table-column label="角色名称" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template v-slot="scope">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary">编辑</el-button>
                  <el-button size="small" type="danger" @click="delRoles(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                layout="prev,pager,next"
                :page-count="0"
                :page-size="pageParams.pagesize"
                :total="total"
                :current-page="pageParams.page"
                background
                @current-change="hCurrentChange"
              />
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getRoles, loadDelRoles, addRoles } from '@/api/settings'
export default {
  data() {
    return {
      roles: [],
      pageParams: {
        page: 1, // 查询的页数
        pagesize: 2 // 每页条数  --- 要与pagination中page-size一致
      },
      total: 0,
      // 新增弹窗
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '描述不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.loadRoles()
  },
  methods: {
    // 调用ajax获取员工列表的函数
    async loadRoles() {
      try {
        // 此处不传值也能接收到???
        const res = await getRoles(this.pageParams)
        console.log('角色管理列表', res)
        this.roles = res.data.rows
        this.total = res.data.total
      } catch (error) {
        console.log(error)
      }
    },
    // 切换分页显示
    hCurrentChange(curPage) {
      // alert(curPage)
      // 1. 更新页码
      this.pageParams.page = curPage
      // 2. 重发请求
      this.loadRoles()
    },

    // 删除请求确认框
    delRoles(id) {
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
      const res = await loadDelRoles(id)
      console.log(res)

      // 判断删除的是否是当前最后一条数据
      // 2. 重发请求
      if (this.roles.length <= 1) {
        this.pageParams.page--
        this.pageParams.page = Math.max(1, this.pageParams.page)
      }
      this.loadRoles()
    },
    // 角色弹窗确定按钮
    hSubmit() {
      this.doAdd(this.roleForm)
    },
    // 角色添加按钮
    async doAdd(data) {
      const res = await addRoles(data)
      // 成功让总页数加一
      this.total++
      this.showDialog = !this.showDialog
      this.endlist()
      this.loadRoles()
      console.log('添加成员返回值', res)
    },
    // 让查询变成最后一页
    endlist() {
      this.pageParams.page = Math.ceil(this.total / this.pageParams.pagesize)
    }
  }
}
</script>
