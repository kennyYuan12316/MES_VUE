import request from '@/utils/request'


export function getDataDicTree() {
  return request(
    {
      url: '/api/DataDic/GetDataDicTree',
      method: 'get'
    }
  )
}


export function getDataDicTable(dicType) {
  return request({
    url: '/api/DataDic/GetDataDicTable',
    method: 'get',
    params: { dicType }
  })
}

export function getDataDicDetailTable(dicCode) {
  return request({
    url: '/api/DataDic/GetDataDicDetailTable',
    method: 'get',
    params: { dicCode }
  })
}

export function addOrUpdateDataDic(dataDic) {
  return request
    ({
      url: '/api/DataDic/AddOrUpdateDataDic',
      method: 'post',
      data: dataDic
    })
}

export function getDataDicBydicCode(dicCode) {
  return request
    ({
      url: '/api/DataDic/GetDataDicBydicCode',
      method: 'get',
      params: { dicCode }
    })
}

export function deleteDataDicByDicCode(dicCode) {
  return request
    ({
      url: '/api/DataDic/DeleteDataDicByDicCode',
      method: 'post',
      data: dicCode
    })
}




