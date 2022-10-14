<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="hAdd"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table :data="roles">
              <el-table-column label="序号" type="index" width="120" />
              <el-table-column label="角色名称" prop="name" width="240" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button size="small" type="success" @click="hAssign(scope.row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="hEdit(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="hDel(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件

              current-change: 翻页时执行回调
              size-change: 每页几条 改变执行
              total： 一共有几条数据
              current-page： 当前的页码
              page-size： 每页显示几条
              page-sizes： 可以自己选择的 每页几条 数据
              layout： 整体的布局
              -->
              <el-pagination
                :total="total"
                :current-page="page"
                :page-size="pagesize"
                :page-sizes="[1, 2, 3, 4]"
                layout="sizes,prev,pager,next"
                @current-change="hCurrentChange"
                @size-change="hSizeChange"
              />
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 新增弹框 -->
    <el-dialog
      :title="isEdit ? '编辑' : '添加'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="showDialog"
      @close="hClose"
    >
      <el-form ref="roleForm" :rules="rules" :model="roleForm" label-width="100px">
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

    <el-dialog
      :title="1 ? '编辑' : '添加'"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="showDialogPermission"
    >
      <AssignPermission ref="refPerm" :role-id="roleId" @success="hSuccess" />
    </el-dialog>
  </div>
</template>

<script>
import AssignPermission from './AssignPermission.vue'
import { getRoles, delRole, addRole, editRole } from '@/api/roles.js'
export default {
  components: { AssignPermission },
  data() {
    return {
      pagesize: 2, // 一页2条数据
      page: 1, // 当前页码
      total: 0, // 总条数
      roles: [],
      isEdit: false,
      // 表单
      rules: {
        name: [{ required: true, message: '角色不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '描述不能为空', trigger: 'blur' }]
      },
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },

      showDialogPermission: false, // 分配权限
      roleId: ''
    }
  },
  created() {
    this.loadRoles()
  },
  methods: {
    // 用户分配权限成功
    hSuccess() {
      // 关闭
      this.showDialogPermission = false
      // 提示
      this.$message.success('成功')
    },
    // 用户点击分配权限
    hAssign(id) {
      // 1. 显示弹框
      this.showDialogPermission = true
      // 2. 保存id
      this.roleId = id

      // 3. 找到子组件，调用它的方法发请求，获取当前角色具备的权限
      this.$nextTick(() => {
        this.$refs.refPerm.loadPermissionById()
        // console.log('this.$refs.refPerm', this.$refs.refPerm)
      })
    },
    hClose() {
      // 重置表单
      this.$refs.roleForm.resetFields()
    },
    // 用户点击了编辑
    //
    hEdit(data) {
      this.isEdit = true
      // console.log(data) // {id,name, description}
      // 1. 弹框
      this.showDialog = true
      // 2. 数据回填
      this.roleForm = { ...data }
      // this.roleForm = {id: data.id, name: data.name, description: data.description}
    },
    async doAdd() {
      try {
        // 1. 添加
        await addRole(this.roleForm)
        // 2. 重发请求
        //    进入到最后一页去看刚才添加的数据
        // ceil向上取整 64 / 4 ===> 16
        //             65 / 4 ===> 17
        this.total++
        this.page = Math.ceil(this.total / this.pagesize) // 最后一页

        this.loadRoles()
        // 3. 提示
        this.$message.success('添加成功')
        // 4. 关闭弹框
        this.showDialog = false
      } catch (error) {
        console.log(error)
        this.$message.error('添加失败')
      }
    },
    async doEdit() {
      try {
        // 1. 修改
        await editRole(this.roleForm)
        // 2. 重发请求
        this.loadRoles()
        // 3. 提示
        this.$message.success('修改成功')
        // 4. 关闭弹框
        this.showDialog = false
      } catch (error) {
        console.log(error)
        this.$message.error('修改失败')
      }
    },
    hSubmit() {
      // 确认
      // 表单校验
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          // if(this.isEdit){
          //   this.doEdit()
          // } else {
          //   this.doAdd()
          // }
          this.isEdit ? this.doEdit() : this.doAdd()
        }
      })
    },
    hAdd() {
      // 点击添加
      this.showDialog = true
      this.isEdit = false
    },
    async doDel(id) {
      try {
        // 1. 删除
        await delRole(id)
        // 2. 提示
        this.$message.success('删除成功')
        // 3. 重发请求
        // 判断是否表格中只有一条数据 && 页码>1
        // 删除了最后一条独立的数据（当前页就只有这一条数据）
        if (this.roles.length === 1 && this.page > 1) {
          this.page--
        }

        this.loadRoles()
      } catch (err) {
        console.log(err)
      }
    },
    // 用户点击删除
    hDel(id) {
      // 提示确认删除吗？
      this.$confirm('确认删除吗？', '系统提示').then(() => {
        this.doDel(id)
      }).catch(() => {})
    },
    // 更改每页显示几条数据
    hSizeChange(curPagesize) {
      console.log(curPagesize)
      // 1. 更新参数
      this.pagesize = curPagesize
      this.page = 1
      // 2. 重发请求
      this.loadRoles()
    },
    // 自动接收当前的页码
    hCurrentChange(curPage) {
      console.log(curPage)
      // 1. 更新页码
      this.page = curPage
      // 2. 重发请求
      this.loadRoles()
    },
    async loadRoles() {
      try {
        const res = await getRoles({ page: this.page, pagesize: this.pagesize })
        this.total = res.data.total
        this.roles = res.data.rows
      } catch (error) {
        console.dir(error)
        this.$message.error('加载失败')
      }
    }
  }
}
</script>
