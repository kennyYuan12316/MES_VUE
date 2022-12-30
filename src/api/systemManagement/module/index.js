import request from '@/utils/request'

export function getModuleTree() {
    return request(
        {
            url: '/api/Module/GetModuleTree',
            method: 'get'
        }
    )
}

export function getModuleTable(moduleData) {
    return request(
        {
            url: `/api/Module/PostModuleTable`,
            method: 'post',
            data: moduleData
        }
    )
}
export function getModuleById(moduleId) {
    return request(
        {
            url: `/api/Module/GetModuleById`,
            method: 'get',
            params: { moduleId }
        }
    )
}

export function addOrUpdateModuleData(moduleData) {
    return request(
        {
            url: `/api/Module/AddOrUpdateModuleData`,
            method: 'post',
            data: moduleData
        }
    )
}

export function getDictDetailForCatCode(catCode) {
    return request(
        {
            url: `/api/Module/GetDictDetailForCatCode`,
            method: 'get',
            params: { catCode }
        }
    )
}
export function deleteModuleDataByModuleId(delParas) {
    return request(
        {
            url: `/api/Module/DeleteModuleDataByModuleId`,
            method: 'post',
            data:delParas
        }
    )
}


export function getModuleDetailTree(disableStatus) {
    return request(
        {
            url: '/api/Module/GetModuleDetailTree',
            method: 'get',
            params:{disableStatus}
        }
    )
}




