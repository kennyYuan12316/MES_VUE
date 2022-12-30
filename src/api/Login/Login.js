import request from '@/utils/request'
/**
 * 
 * @param {userName,password} user 
 */
export function Login(user) {
  return request({
    url: '/api/LogIn/ValidateLogin',
    method: 'post',
    data: user
  })
}

export function getInfo(token) {
  return request({
    url: '/api/LogIn/getInfo',
    method: 'get',
    params: { token }
  })
}