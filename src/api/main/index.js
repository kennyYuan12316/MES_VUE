import request from '@/utils/request'

/**
 * 获取用户菜单树
 * @param {} userId 
 * @returns 
 */
export function getMenu(userId) {
    return request(
        {
            url: '/api/Main/GetTreeMenu',
            method: 'post',
            params: { userId }
        }
    )
}
/**
 * 获取组件按钮权限
 * tlBack
    tlConfim
    tlDel
    tlEdit
    tlExcelExport
    tlExcelImport
    tlNew
    tlOpen
    tlprint
    tlRefresh
 * @param {*} componetName 
 * @returns 
 */
export function GetComponentBtnPower(componetName) {
    return request(
        {
            url: '/api/Main/GetComponentBtnPower',
            method: 'get',
            params: { componetName }
        }
    )
}