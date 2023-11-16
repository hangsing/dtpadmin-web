import request from '@/utils/request'

export function get(param) {
  const params = {
    param,
    page: 0,
    size: 9999
  }
  return request({
    url: 'api/asset/detail',
    method: 'get',
    params
  })
}

export function apply(data) {
  return request({
    url: 'api/asset/apply',
    method: 'put',
    data
  })
}

