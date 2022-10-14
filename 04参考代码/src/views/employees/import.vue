<template>
  <div>
    <upload-excel-component
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    />
  </div>
</template>
<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { formatExcelDate } from '@/utils/index.js'
import { importEmployees } from '@/api/employees'
export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    // 成功读出excel文件的内容
    async handleSuccess({ results, header }) {
      try {
        this.tableData = results
        this.tableHeader = header
        // 1. 按接口文档要求，对读入的excel数据做格式转换
        const newData = this.transExcel(results, header)
        console.log('转换之后的数据', newData)
        // 2. 调用接口发请求
        await importEmployees(newData)
        this.$message.success('导入成功')
        this.$router.push('/employees')
      } catch (err) {
        console.log(err)
        this.$message.error(err)
      }
    },
    // 按接口文档要求，对读入的excel数据做格式转换
    // results excel表格的内容
    //    [
    //       {'姓名'：'小张'， '手机号': '13712345678'}
    //    ]

    //  目标
    //  [
    //     {'username'：'小张'，'mobile': '13712345678'}
    //  ]
    transExcel(results, header) {
      console.log('转换之前的数据', results, header)
      const mapInfo = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName',
        '聘用形式': 'formOfEmployment'
      }
      // 处理数据
      // 字段全是中文的，后端要求是英文的
      // 1.找到所有的中文的key
      const zhKeys = Object.keys(results[0])
      console.log(zhKeys)
      // results是从excel读入的内容
      return results.map(item => {
        // 创建一个新对象：它的key是英文的，value是item的值是一致的
        const obj = {}
        zhKeys.forEach(zhkey => {
          const enKey = mapInfo[zhkey]
          // 如果是日期，要做额外的转换
          if (enKey === 'timeOfEntry' || enKey === 'correctionTime') {
            obj[enKey] = new Date(formatExcelDate(item[zhkey]))
          } else {
            obj[enKey] = item[zhkey]
          }
        })
        return obj
      })
    }
  }
}
</script>
