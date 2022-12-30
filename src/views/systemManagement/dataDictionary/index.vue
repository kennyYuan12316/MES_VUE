<template>
    <div class="dataDic-content">
        <el-row :gutter="15">
            <el-col :span="4" :xs="24">
                <div>
                    <el-input placeholder='请输入字典名称' clearable v-model="filterText" size="small"
                        prefix-icon="el-icon-search" style="margin-bottom: 20px" />
                </div>
                <div>
                    <el-tree :data="dataDicArr" @node-click="handleNodeClick" :filter-node-method="filterNode"
                        v-loading="treeLoading" ref="tree"></el-tree>
                </div>
            </el-col>
            <el-col :span="20" :xs="24">
                <el-row :gutter="20" style="margin-bottom: 10px;">
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                            v-if="button.tlNew">{{ $t("xin-zeng") }}</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="success" plain icon="el-icon-edit" size="mini" @click="handleUpdate"
                            v-if="button.tlEdit">{{ $t("xiu-gai") }}</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleDelete"
                            v-if="button.tlDel">{{ $t("shan-chu") }}</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport"
                            v-if="button.tlExcelImport">{{ $t("dao-ru") }}</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                            v-if="button.tlExcelExport">{{ $t("dao-chu") }}</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="success" plain icon="el-icon-refresh" size="mini" @click="handleRefresh"
                            v-if="button.tlRefresh">刷新</el-button>
                    </el-col>
                </el-row>
                <el-table :data="dataDicTabledata" size="mini" :header-cell-style="headerCellStyle" :border="true"
                    style="width: 100%;" height="40vh" highlight-current-row @current-change="clickOnLine">
                    <el-table-column prop="dicCode" label="字典编号"></el-table-column>
                    <el-table-column prop="dicName" label="字典名称"></el-table-column>
                    <el-table-column prop="dicType" label="字典类型"></el-table-column>
                    <el-table-column prop="status" label="启用状态"></el-table-column>
                    <el-table-column prop="createDate" label="创建时间" :formatter="dateFormat"></el-table-column>
                    <el-table-column prop="updateDate" label="修改时间" :formatter="dateFormat"></el-table-column>
                    <el-table-column prop="createUserId" label="创建用户"></el-table-column>
                    <el-table-column prop="updateUserId" label="修改用户"></el-table-column>
                </el-table>
                <!-- <hr style="margin:0px;height:5px;border:0px;background-color:#D5D5D5;color:#D5D5D5;" /> -->
                <el-table :data="dataDicDetailTabledata" :header-cell-style="headerCellStyle" :border="true" size="mini"
                    style="width: 100%; margin-top: 10px" height="43vh" highlight-current-row>
                    <el-table-column prop="pk" label="字典主键"></el-table-column>
                    <el-table-column prop="pn" label="字典名称"></el-table-column>
                    <el-table-column prop="sort" label="排序"></el-table-column>
                    <el-table-column prop="v1" label="值1"></el-table-column>
                    <el-table-column prop="v2" label="值2"></el-table-column>
                    <el-table-column prop="v3" label="值3"></el-table-column>
                    <el-table-column prop="v4" label="值4"></el-table-column>
                    <el-table-column prop="v5" label="值5"></el-table-column>
                    <el-table-column prop="v6" label="值6"></el-table-column>
                    <el-table-column prop="createDate" label="创建时间" :formatter="dateFormat"></el-table-column>
                    <el-table-column prop="createUserId" label="创建用户"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <!-- 添加或修改数据字典对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body center :show-close="false"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" label-width="80px" label-position="left" :rules="rules">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="字典编号" prop="dicCode">
                            <el-input v-model="form.dicCode" placeholder="输入字典编号" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="字典名称" prop="dicName">
                            <el-input v-model="form.dicName" placeholder="输入字典名称" maxlength="30" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="字典类型" prop="dicType">
                            <!-- <treeselect v-model="form.dicType" :options="dataDicArr" @input="InsertdataDicArr" /> -->
                            <el-select style="width:280px" v-model="form.dicType" allow-create default-first-option filterable value-key="name"
                                @blur="nameblur()" ref="dicTypeSel">
                                <el-option v-for="item in dataDicArr" :key="item.label" :label="item.label" :value="item" />
                            </el-select>
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="启用状态" prop="status">
                            <el-switch v-model="form.status" active-color="#13ce66" inactive-color="#ff4949">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div style="margin-bottom: 10px;">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini"
                        @click="handleAddDetail">新增明细</el-button>
                    <el-button type="danger" plain icon="el-icon-delete" size="mini"
                        @click="handleDeleteDetail">删除明细</el-button>
                </div>
                <el-table :data="form.detailTable" class="table1" :header-cell-style="headerCellStyle" :border=true
                    size="mini" height="40vh" @selection-change="handleDetailSelectionChange" ref="tb">
                    <el-table-column type="selection" width="30" />
                    <el-table-column type="index" label="序号" width="50"> </el-table-column>
                    <!-- <el-table-column label="序号">
                        <template slot-scope="scope">
                            <el-input type="index" ></el-input>
                        </template>
                    </el-table-column> -->

                    <el-table-column label="字典主键">
                        <template slot-scope="scope">
                            <el-input size="mini" v-model="scope.row.pk"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="字典名称">
                        <template slot-scope="scope">
                            <el-input size="mini" v-model="scope.row.pn"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="值1">
                        <template slot-scope="scope">
                            <el-input size="mini" v-model="scope.row.v1"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="值2">
                        <template slot-scope="scope">
                            <el-input size="mini" v-model="scope.row.v2"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="值3">
                        <template slot-scope="scope">
                            <el-input size="mini" v-model="scope.row.v3"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="值4">
                        <template slot-scope="scope">
                            <el-input size="mini" v-model="scope.row.v4"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="值5">
                        <template slot-scope="scope">
                            <el-input size="mini" v-model="scope.row.v5"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="值6">
                        <template slot-scope="scope">
                            <el-input size="mini" v-model="scope.row.v6"></el-input>
                        </template>
                    </el-table-column>
                </el-table>


            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">{{
                        $t("que-ding")
                }}</el-button>
                <el-button @click="cancel">{{ $t("qu-xiao") }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { MessageBox, Message } from 'element-ui';
import {
    getDataDicTree, getDataDicTable, getDataDicDetailTable, addOrUpdateDataDic
    , getDataDicBydicCode, deleteDataDicByDicCode
} from "@/api/systemManagement/dataDictionary/index";
import { dateFormat, Export2Excel } from "@/utils/utils";
import { GetComponentBtnPower } from "@/api/main/index";
export default {
    name: "dataDicManagement",
    components: {
        Treeselect,
    },
    data() {

        return {
            dataDicArr: [],
            treeLoading: true,
            buttonPermissions: null,
            //按钮权限对象
            button: { tlNew: true, tlDel: true, tlEdit: true, tlDel: true, tlExcelImport: true, tlExcelExport: true, tlRefresh: true },
            //模块表格数据
            dataDicTabledata: [],

            dataDicDetailTabledata: [],
            //当前行
            currentRow: null,
            //当前点中树的父级
            currentParentId: null,
            //当前点中树的集合
            currentIds: null,
            // 是否显示弹出层
            open: false,
            title: null,
            filterText: null,
            componentName: "dataDicManagement",
            detailTable: [],
            //选中的表数据
            checkedDetail: [],
            form: {
                dicCode: null,
                dicName: null,
                dicType: null,
                status: true,
                detailTable: [{
                    pk: null,
                    pn: null,
                    v1: null,
                    v2: null,
                    v3: null,
                    v4: null,
                    v5: null,
                    v6: null
                }]

            },
            rules: {
                dicCode: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "字典编号不能为空",
                    },
                ],
                dicName: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "字典名称不能为空",
                    },
                ],
                dicType: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "字典类型不能为空",
                    },
                ],
                status: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "字典状态不能为空",
                    },
                ],
            },
        }

    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        },
    },
    created() {
        this.GetComponentBtnPower();
        this.getDataDicTree();

    },
    methods: {
        handleNodeClick(data) {
            if(data!=null)(this.currentParentId = data)
            getDataDicTable(this.currentParentId.label).then((res) => {
                let tabArr = JSON.parse(res.data);
                this.dataDicTabledata = tabArr;
            });
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 获取按钮权限
        GetComponentBtnPower() {
            GetComponentBtnPower(this.componentName).then((res) => {
                let data = JSON.parse(res.data);
                this.buttonPermissions = data.map((f) => {
                    return f.keyCode;
                });
                this.buttonPermissions.forEach((f) => {
                    // 将后台权限属性加入到button对象中
                    this.$set(this.button, f, true);
                });
            });
        },
        getDataDicTree() {
            getDataDicTree().then((res) => {
                this.dataDicArr = res.data;
                this.treeLoading = false
            });
        },
        handleAdd() {
            this.title = "新增数据字典"
            this.open = true;
        },
        handleUpdate() {
            this.title = "修改数据字典";
            if (this.currentRow == null) {
                Message({
                    showClose: true,
                    message: "未选择模块信息" || 'Error',
                    type: 'error',
                    duration: 5 * 1000
                })
                return;
            }
            let currentDiccode = this.currentRow.dicCode;
            getDataDicBydicCode(currentDiccode).then((res) => {
                this.form = JSON.parse(res.data)
            });
            this.open = true;
        },
        handleDelete() {
            if (this.currentRow == null) {
                Message({
                    showClose: true,
                    message: "未选择数据字典信息" || 'Error',
                    type: 'error',
                    duration: 5 * 1000
                })
                return;
            }
            let delParas = { dicCode: this.currentRow.dicCode }
            deleteDataDicByDicCode(delParas).then((res) => {
                this.handleRefresh()
                Message({
                    showClose: true,
                    message: res.message,
                    type: 'success',
                    duration: 5 * 1000
                })
                return;
            });

        },
        handleRefresh() {
            this.treeLoading = true;
            this.getDataDicTree();
            this.cancel();
            this.dataDicTabledata = null;
            this.treeLoading = false;
            console.log(this.currentParentId);
            this.handleNodeClick(this.currentParentId)
        },
        headerCellStyle({ row, rowIndex, columnIndex }) {
            return {
                background: '#f5f7fa',
                color: '#606266'
            }
        },
        handleImport() { },
        //导出
        handleExport() {

        },
        clickOnLine(val) {

            console.log(val)
            if (val != null) { this.currentRow = val }

            getDataDicDetailTable(this.currentRow.dicCode).then((res) => {
                let tabArr = JSON.parse(res.data);
                this.dataDicDetailTabledata = tabArr;
            });

        },
        dateFormat,
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    addOrUpdateDataDic(this.form).then((res) => {
                        this.handleRefresh()
                        this.$message({
                            showClose: true,
                            message: res.message,
                            type: "success",
                            duration: 3 * 1000,
                        });

                    });
                } else {
                    this.$message({
                        showClose: true,
                        message: this.$t('shu-ju-bu-wan-zheng'),
                        type: "warning",
                        duration: 3 * 1000,
                    });
                }
            });
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 清空表单
        reset() {
            this.title = "";
            this.form = {
                dicCode: null,
                dicName: null,
                dicType: null,
                status: true,
                detailTable: [{
                    pk: null,
                    pn: null,
                    v1: null,
                    v2: null,
                    v3: null,
                    v4: null,
                    v5: null,
                    v6: null
                }]

            };
        },
        handleAddDetail() {
            if (this.form.detailTable == undefined) {
                this.form.detailTable = new Array();
            }
            let obj = {};
            this.form.detailTable.push(obj);
        },
        handleDeleteDetail() {
            if (this.checkedDetail.length == 0) {
                this.$alert("请先选择要删除的数据", "提示", {
                    confirmButtonText: "确定",
                });
            } else {
                this.form.detailTable.splice(this.checkedDetail[0].index - 1, 1);
            }
        },
        rowClassName({ row, rowIndex }) {
            console.log('rowIndex', rowIndex);
            row.index = rowIndex + 1;
        },
        handleDetailSelectionChange(selection) {
            if (selection.length > 1) {         //删除一行
                this.$refs.tb.clearSelection();//清空用户的选择
                this.$refs.tb.toggleRowSelection(selection.pop());//切换某一行的选中状态
            } else {
                this.checkedDetail = selection;
            }
        },
        nameblur()
        {
            let dicType=this.$refs.dicTypeSel.selectedLabel
        }
        
    },
}
</script>

<style>
.dataDic-content {
    margin: 10px;
    height: calc(89vh);
}

.el-table--mini td,
.el-table--mini th {
    padding: 0px 0;
}

.el-table .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 30px;
    padding: 0;
}

.el-table .el-input__inner {

    padding: 5px;

}



/* el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
    padding-left: 0;
}

el-table .cell, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell {
    padding-left: 0px;
} */
</style>