/**
 * @description: 接口数据转换为excel需要的二维数据
 * @param {*}
 * @return {*}
 */

export function transSourceDataToArray(sourceData, header) {
  const newArr = [] // 产出的二维数组
  // 具体的转换逻辑
  sourceData.forEach(item => {
    const arr = []
    Object.keys(item).forEach(key => {
      // 增加一些判断处理 通过表头中拥有的字段名称去筛选添加
      if (Object.values(header).includes(key)) {
        arr.push(item[key])
      }
    })
    newArr.push(arr)
  })
  return newArr
}

/**
 * @description: excel插件转换完的数据格式转成接口需要的格式
 * @param {*} results
 * @return {*}
 */
export function transExcelDataToSouceData(results) {
  const userRelations = {
    '入职日期': 'timeOfEntry',
    '手机号': 'mobile',
    '姓名': 'username',
    '转正日期': 'correctionTime',
    '工号': 'workNumber'
  }
  const newArr = []
  // 将所有的中文key转换成英文key 然后添加到新数组中
  results.forEach(item => {
    const map = {}
    Object.keys(item).forEach(key => {
      map[userRelations[key]] = item[key]
    })
    newArr.push(map)
  })
  // 时间处理
  newArr.forEach(item => {
    Object.keys(item).forEach(key => {
      if (['correctionTime', 'timeOfEntry'].includes(key)) {
        item[key] = new Date(formatDate(item[key], '/'))
      }
    })
  })
  return newArr
}

export function formatDate(numb, format) {
  const time = new Date((numb - 1) * 24 * 3600000 + 1)
  time.setYear(time.getFullYear() - 70)
  const year = time.getFullYear() + ''
  const month = time.getMonth() + 1 + ''
  const date = time.getDate() - 1 + ''
  if (format && format.length === 1) {
    return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
  }
  return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
}
