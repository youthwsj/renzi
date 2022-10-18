<template>
  <el-button :style="{'margin-left':'400px'}">
    <UploadExcel :on-success="handleSuccess" />
  </el-button>
</template>

<script>
// Excel时间转换正常时间
import { formatExcelDate } from '@/utils/index'
import { addDatchEmployees } from '@/api/employees'

export default {
  name: 'Import',
  methods: {
    // Excel导入成功
    async handleSuccess({ results, header }) {
    // results每列 header表头
      console.log('读出来的excel的内容是', results, header)
      try {
        const res = this.transExcel(results)
        const data = await addDatchEmployees(res)
        this.$message({
          type: 'success',
          message: data.message
        })
        this.$router.back()
      } catch (error) {
        this.$message({
          type: 'error',
          message: error.message
        })
      }
      // const result = [
      //   {
      //     '姓名': '小张',
      //     '手机号': '13800000252',
      //     '入职日期': 44505,
      //     '转正日期': 44892,
      //     '工号': '9002',
      //     '部门': '总裁办'
      //   },
      //   {
      //     '姓名': '小李',
      //     '手机号': '13810000512',
      //     '入职日期': 44506,
      //     '转正日期': 44893,
      //     '工号': 9006,
      //     '部门': '总裁办'
      //   }
      // ]

    // const data = transExcel(result)
    // 每个属性名都要是中文
    },
    // 转换数据函数
    transExcel(results) {
      const mapInfo = {
        入职日期: 'timeOfEntry',
        手机号: 'mobile',
        姓名: 'username',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName',
        聘用形式: 'formOfEmployment'
      }
      // 写代码
      return results.map((item) => {
      // 拿到每一行的key
        const zhkeys = Object.keys(item)
        // 创建生成的新的对象
        const obj = {}
        // 遍历拿到的中文key
        zhkeys.forEach((zhkey) => {
        // 把中文名通过 mapInfo替换为英文
          const enkey = mapInfo[zhkey]
          // 把英文名的key给value 并给obj
          obj[enkey] = item[zhkey]
          if (enkey === 'timeOfEntry' || enkey === 'correctionTime') {
          // 如果是时间 调用formatExcelDate 并且 new Date 为标准时间
            obj[enkey] = new Date(formatExcelDate(obj[enkey], '/'))
          }
        })
        return obj
      })
    }
  }
}
</script>
