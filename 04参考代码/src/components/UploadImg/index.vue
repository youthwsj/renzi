<template>
  <div>
    <!--
      show-file-list: 是否显示上传的文件列表
      action: '#' 用来指定文件要上传的地址，由于我们需要定制上传动作
             这里设为#
      :http-request：自定义上传行为（重点，在这里写代码把图片上传腾讯云）

      on-success: 上传成功之后的回调
      before-upload： 上传之前的检查
    -->
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :http-request="upload"
      :before-upload="beforeAvatarUpload"
    >
      <!-- 如果有图就显示，否则显示一个加号图标 -->
      <img v-if="value" :src="value" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
  </div>
</template>

<script>
// 下面的代码是固定写法
const COS = require('cos-js-sdk-v5')
// 填写自己腾讯云cos中的key和id (密钥)
const cos = new COS({
  SecretId: 'AKIDnQntiGYZJo38xWprc6JFvKTLwGJ7euud', // 身份识别ID
  SecretKey: 'TgdJjyykFTQ6ZtxkHXYJn2zg6G9m8D1Y' // 身份秘钥
})

export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },
  methods: {
    // 自定义的上传的动作
    upload(res) {
      // res.file就是我们当前要上传的文件
      // 写代码把图片上传腾讯云
      cos.putObject({
        Bucket: 'wh76-1258898967', /* 存储桶 */
        Region: 'ap-nanjing', /* 存储桶所在地域，必须字段 */
        Key: res.file.name, /* 文件名 */
        StorageClass: 'STANDARD', // 上传模式, 标准模式
        Body: res.file // 上传文件对象
      }, (err, data) => {
        console.log(err || data)
        // 上传成功之后
        if (data.statusCode === 200) {
          // `https:${data.Location}` 就是新的图片上传到存储桶之后的地址
          // 回传给父
          this.$emit('input', `https:${data.Location}`)
        }
      })
    },
    beforeAvatarUpload(file) {
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isPNG) {
        this.$message.error('上传头像图片只能是 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isPNG && isLt2M
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
