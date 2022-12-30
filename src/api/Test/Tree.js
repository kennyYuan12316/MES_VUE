
var data = `[
    {

        "id":0,
        "parentId":-1,
        "title":"仪表盘",
        "path":"",
        "icon":"dashboard",
        "sortNumber":1,
        "status":"1"

    },
    {
        "id":1,
        "parentId":0,
        "title":"仪表盘",
        "path":"/dashboard",
        "icon":"dashboard",
        "sortNumber":1,
        "status":"1"
    },
    {
        "id":2,
        "parentId":0,
        "title":"表单",
        "path":"/form/index",
        "icon":"form",
        "sortNumber":2,
        "status":"1"
    },
    {
        "id":3,
        "parentId":0,
        "title":"nested",
        "path":"",
        "icon":"nested",
        "sortNumber":1,
        "status":"1"
    },
    {
        "id":4,
        "parentId":3,
        "title":"menu1",
        "path":"/menu1",
        "icon":null,
        "sortNumber":1,
        "status":"1"
    },
    {
        "id":7,
        "parentId":3,
        "title":"menu2",
        "path":"/nested/menu2",
        "icon":null,
        "sortNumber":2,
        "status":"1"
    },
    {
        "id":5,
        "parentId":4,
        "title":"menu1-1",
        "path":"/nested/menu1/menu1-1",
        "icon":null,
        "sortNumber":1,
        "status":"1"
    },
    {
        "id":6,
        "parentId":4,
        "title":"menu1-2",
        "path":"/nested/menu1/menu1-2",
        "icon":null,
        "sortNumber":2,
        "status":"1"
    },
    {
        "id":7,
        "parentId":0,
        "title":"MES",
        "path":"http://10.0.100.3:1003/Main.aspx",
        "icon":"link",
        "sortNumber":2,
        "status":"1"
    }
]`


export const TreeMenu = JSON.parse(data)