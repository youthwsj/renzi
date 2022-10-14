<template>
  <el-dropdown @command="handleCommand">
    <div>
      <svg-icon style="color:#fff;font-size:20px" icon-class="eye" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="'zh'=== $i18n.locale" command="zh">中文</el-dropdown-item>
      <el-dropdown-item :disabled="'en'=== $i18n.locale" command="en">EN</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  methods: {
    handleCommand(command) {
      // 切换语言
      this.$i18n.locale = command
      this.$message('click on item ' + command)
    }
  }
}
</script>
