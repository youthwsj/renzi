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
              >新增角色</el-button>
            </el-row>
            <!-- 表格区域 -->
            <el-table :data="roles">
              <el-table-column label="序号" width="120" type="index" />
              <el-table-column label="角色名称" width="240" prop="name" />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作">
                <template>
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary">编辑</el-button>
                  <el-button size="small" type="danger">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="height: 60px">
              <!-- 分页组件 -->
              <el-pagination
                layout="prev,pager,next"
                :page-size="pageParams.pagesize"
                :total="total"
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
import { getRoles } from '@/api/settings'
export default {
  data() {
    return {
      roles: [],
      pageParams: {
        page: 1, // 查询第一页
        pagesize: 2 // 每页两条  --- 要与pagination中page-size一致
      },
      total: 0
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
    }
  }
}
</script>
