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

// 用来将平铺的数组转树状结构
/**
 *
arr = [
  { 'id': '29', 'pid': '',     'name': '总裁办' },
  { 'id': '2c', 'pid': '',     'name': '财务部' },
  { 'id': '2d', 'pid': '2c',   'name': '财务核算部'},
  { 'id': '2f', 'pid': '2c',   'name': '薪资管理部'},
  { 'id': 'd2', 'pid': '',     'name': '技术部'},
  { 'id': 'd3', 'pid': 'd2',   'name': 'Java研发部'}
]
// 输入 arr 输出tree
// 递归
// 1. 定义函数，它能从指定的数组中找指定pid的children
    arr2tree(arr, '') ==> [
      { 'id': '29', 'pid': '','name': '总裁办'},
      { 'id': '2c', 'pid': '','name': '财务部' },
      { 'id': 'd2', 'pid': '','name': '技术部'}
    ]
    2. 对结果中的每一个元素，继续找chilren： pid 是当前元素的id。例如 '2c'
     arr2tree(arr,'2c') ===> [
      { 'id': '2d', 'pid': '2c', 'name': '财务核算部'},
      { 'id': '2f', 'pid': '2c', 'name': '薪资管理部'},
     ]

tree = [
  { 'id': '29', 'pid': '',     'name': '总裁办' },
  { 'id': '2c', 'pid': '',     'name': '财务部', children: [
      { 'id': '2d', 'pid': '2c',   'name': '财务核算部'},
      { 'id': '2f', 'pid': '2c',   'name': '薪资管理部'}]
  },
  { 'id': 'd2', 'pid': '',     'name': '技术部', children: [
    { 'id': 'd3', 'pid': 'd2',   'name': 'Java研发部'}]
  }
]

 */

// 在arr数组中，找出pid为第二个参数的元素
export function array2Tree(arr, pid) {
  const tree = arr.filter(item => item.pid === pid)
  // { 'id': '29', 'pid': '',     'name': '总裁办', },
  // { 'id': '2c', 'pid': '',     'name': '财务部' },
  // { 'id': 'd2', 'pid': '',     'name': '技术部'},
  tree.forEach(item => {
    item.children = array2Tree(arr, item.id)
  })

  return tree
}
