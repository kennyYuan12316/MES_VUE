import request from '@/utils/request'

export function getRoleTable() {
    return request(
        {
            url: '/api/Role/GetRoleTable',
            method: 'get'
        }
    )
}



export function getRoleDetailTable(roleId) {
    return request(
        {
            url: `/api/Role/GetRoleDetailTable/${roleId}`,
            method: 'get',
        }
    )
}



export function addOrUpdateRoleData(rolePermData) {
    return request(
        {
            url: `/api/Role/AddOrUpdateRoleData`,
            method: 'post',
            data: rolePermData
        }
    )
}

export function deleteRoleDataByRoleId(roldId) {
    return request(
        {
            url: `/api/Role/DeleteRoleDataByRoleId`,
            method: 'post',
            data: roldId
        }
    )
}


export function getRoleDataByAcctId(acctId) {
    return request(
        {
            url: `/api/Role/GetRoleDataByAcctId`,
            method: 'get',
            params:{acctId} 
        }
    )
}


