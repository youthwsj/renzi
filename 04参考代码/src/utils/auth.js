// cookie localstorage 都可以做持久化  --- 页面刷新数据还在

import Cookies from 'js-cookie'

const TokenKey = 'hr_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  // Cookies.set(属性名，属性值)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
