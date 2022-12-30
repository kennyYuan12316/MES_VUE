import request from '@/utils/request'

export function getOrganizationTree() {
    return request(
        {
            url: '/api/Organization/GetOrganizationMenu',
            method: 'post'
        }
    )
}

export function getAccoutByDeptIdTable(deptId) {
    return request({
        url: '/api/Account/GetAccoutByDeptIdTable',
        method: 'get',
        params: { deptId }
    })
}

export function addOrUpdateAccountData(acctRolePermVM) {
    return request({
        url: '/api/Account/AddOrUpdateAccountData',
        method: 'post',
        data: acctRolePermVM
    })
}

export function getPermDataByAcctId(acctId) {
    return request({
        url: '/api/Account/GetPermDataByAcctId',
        method: 'get',
        params: {acctId}
    })
}
export function getAccountRolePermByAccountId(acctId) {
    return request({
        url: '/api/Account/GetAccountRolePermByAccountId',
        method: 'get',
        params: {acctId}
    })
}
export function deleteAccountRolePermByAccountId(acctId) {
    return request({
        url: '/api/Account/DeleteAccountRolePermByAccountId',
        method: 'post',
        data:acctId
    })
}








