/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

// 把平铺的数组 转成 树形结构
// export function arrayToTree(list){

//   // 1. 定义两个变量
//   const treeList = [], map = {}

//   // 2. 建立一个映射关系，并给每个元素补充children属性.
//   // 映射关系: 目的是让我们能通过id快速找到对应的元素
//   // 补充children：让后边的计算更方便
//   list.forEach(item => {
//     if (!item.children) {
//       item.children = []
//     }
//     map[item.id] = item
//   })

//   // 循环
//   list.forEach(item => {
//     // 对于每一个元素来说，先找它的上级
//     //    如果能找到，说明它有上级，则要把它添加到上级的children中去
//     //    如果找不到，说明它没有上级，直接添加到 treeList
//     const parent = map[item.pid]
//     // 如果存在上级则表示item不是最顶层的数据
//     if (parent) {
//       parent.children.push(item)
//     } else {
//       // 如果不存在上级 则是顶层数据,直接添加
//       treeList.push(item)
//     }
//   })
//   // 返回
//   return treeList
//   // return [{ label: xxx, children: [{label: xxxx, children: [] }]}]
// }

// [
//   { 'id': '29', 'pid': '',     'name': '总裁办' },
//   { 'id': '2c', 'pid': '',     'name': '财务部' },
//   { 'id': '2d', 'pid': '2c',   'name': '财务核算部'},
//   { 'id': '2f', 'pid': '2c',   'name': '薪资管理部'},
//   { 'id': 'd2', 'pid': '',     'name': '技术部'},
//   { 'id': 'd3', 'pid': 'd2',   'name': 'Java研发部'}
// ]
export function arrayToTree(list) {
  const map = {}
  const treeList = []
  // 1.
  //  创建一个 map 结构。key是id值，value是对象本身,同时给每个对象添加children属性
  list.forEach(item => {
    item.children = []
    map[item.id] = item
  })
  // 2. 对list的每一项item
  //  找上级obj
  //    有上级，就把item添加到obj的children
  //    没有上级，就是一级部门，直接添加到treeList
  console.log(map)
  list.forEach(item => {
    const pid = item.pid // ===> 'd2'
    const obj = map[pid]
    if (obj) {
      obj.children.push(item)
    } else {
      treeList.push(item)
    }
  })
  console.log(list)
  // 3. 返回
  return treeList
}

// [
//   { 'id': '29', 'pid': '',     'name': '总裁办' },
//   { 'id': '2c', 'pid': '',     'name': '财务部' },
//   { 'id': '2d', 'pid': '2c',   'name': '财务核算部'},
//   { 'id': '2f', 'pid': '2c',   'name': '薪资管理部'},
//   { 'id': 'd2', 'pid': '',     'name': '技术部'},
//   { 'id': 'd3', 'pid': 'd2',   'name': 'Java研发部'}
// ]

// treeList: []
// map: {
//   '29': { 'id': '29', 'pid': '',     'name': '总裁办' },
//   '2c': { 'id': '2c', 'pid': '',     'name': '财务部', children:[{ 'id': '2d', 'pid': '2c',   'name': '财务核算部'},{ 'id': '2f', 'pid': '2c',   'name': '薪资管理部'}] },
//   '2d': { 'id': '2d', 'pid': '2c',   'name': '财务核算部'},
//   '2f': { 'id': '2f', 'pid': '2c',   'name': '薪资管理部'},
//   'd2': { 'id': 'd2', 'pid': '',     'name': '技术部'},
//   'd3': { 'id': 'd3', 'pid': 'd2',   'name': 'Java研发部'}
// }

// treeList: [
//   { 'id': '29', 'pid': '',     'name': '总裁办' }
//   { 'id': '2c', 'pid': '',     'name': '财务部', children:[{ 'id': '2d', 'pid': '2c',   'name': '财务核算部'},{ 'id': '2f', 'pid': '2c',   'name': '薪资管理部'} }
//   { 'id': 'd2', 'pid': '',     'name': '技术部', children:[{ 'id': 'd3', 'pid': 'd2',   'name': 'Java研发部'}]}
// ]

// 把excel文件中的日期格式的内容转回成标准时间
// https://blog.csdn.net/qq_15054679/article/details/107712966
export function formatExcelDate(numb, format = '/') {
  const time = new Date((numb - 25567) * 24 * 3600000 - 5 * 60 * 1000 - 43 * 1000 - 24 * 3600000 - 8 * 3600000)
  time.setYear(time.getFullYear())
  const year = time.getFullYear() + ''
  const month = time.getMonth() + 1 + ''
  const date = time.getDate() + ''
  if (format && format.length === 1) {
    return year + format + month + format + date
  }
  return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
}
