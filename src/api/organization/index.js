import request from '@/utils/request'

export function getOrganizationTree() {
    return request(
        {
            url: '/api/Organization/GetOrganizationMenu',
            method: 'post'
        }
    )
}

export function PostOrganizationTable(ids, page, size) {
    return request(
        {
            url: `/api/Organization/PostOrganizationTable/${page}/${size}`,
            method: 'post',
            data: ids
        }
    )
}


export function GetAllOrganization() {
    return request(
        {
            url: `/api/Organization/GetAllOrganization`,
            method: 'get',
        }
    )
}
/**
 * 
 * @param {组织架构} data 
 * @returns 
 */
export function AddOrUpdateOrganizationData(data) {
    return request({
        url: '/api/Organization/AddOrUpdate',
        method: 'post',
        data
    })
}

export function getDeptById(id) {
    return request({
        url: "/api/Organization/getDeptById",
        method: 'get',
        params: {
            deptId: id
        }
    })
}