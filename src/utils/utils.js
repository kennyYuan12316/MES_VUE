
import moment from 'moment'
import i18n from '@/locales/i18n';
/**
 * el-table 时间格式化
 */
export function dateFormat(row, column) {

    var date = row[column.property];

    if (date == undefined) {
        return ''
    }
    return moment(date).format("YYYY-MM-DD HH:mm:ss")
}

/**
 * 导出excel
 * @param {*} data 
 */
export function Export2Excel(header, Tabledata, TableName) {
    import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = header.map(f => {
            return f.title;
        });
        const filterVal = header.map(f => {
            return f.column;
        })
        const data = formatJson(filterVal, Tabledata);

        excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: TableName,
            autoWidth: true,
            bookType: "xlsx",
        });
    })
}


// 格式化excel导出的数据
function formatJson(filterVal, jsonData) {
    return jsonData.map((v) => {
        return filterVal.map((j) => {
            return v[j];
        });
    });
}