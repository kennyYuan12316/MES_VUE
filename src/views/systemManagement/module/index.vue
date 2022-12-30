<template>
    <div class="module-content">
        <el-row :gutter="20">
            <el-col :span="4" :xs="24">
                <div>
                    <el-input placeholder='请输入模板名称' clearable v-model="filterText" size="small"
                        prefix-icon="el-icon-search" style="margin-bottom: 20px" />
                </div>
                <div>
                    <el-tree :data="moduleArr" :props="defaultProps" @node-click="handleNodeClick" default-expand-all
                        :filter-node-method="filterNode" v-loading="treeLoading" ref="tree"></el-tree>
                </div>
            </el-col>

            <el-col :span="20" :xs="24">
                <el-row :gutter="20">
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
                <el-table :data="moduleTabledata" style="width: 100%" height="83vh" highlight-current-row  size="mini"
                    @current-change="clickOnLine">
                    <el-table-column prop="modCode" label="模块编号"></el-table-column>
                    <el-table-column prop="modName" label="模块名称"></el-table-column>
                    <el-table-column prop="icon" label="模块icon"></el-table-column>
                    <el-table-column prop="rtUrl" label="模块路由"></el-table-column>
                    <el-table-column prop="sort" label="模块排序"></el-table-column>
                    <el-table-column prop="parentId" label="父级模块"></el-table-column>
                    <el-table-column prop="status" label="启用状态">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createDate" label="创建时间"  :formatter="dateFormat"></el-table-column>
                    <el-table-column prop="updateDate" label="修改时间"  :formatter="dateFormat"></el-table-column>
                    <el-table-column prop="createUserId" label="创建用户"></el-table-column>
                    <el-table-column prop="updateUserId" label="修改用户"></el-table-column>
                </el-table>
                <div style="text-align: center; padding: 5px">
                    <el-pagination background :page-size="pageSize" :pager-count="7" :current-page="page"
                        layout="prev, pager, next" :total="total" @current-change="pageChange">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
        <!-- 添加或修改模块对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="640px" append-to-body center :show-close="false"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" label-width="80px" label-position="left" :rules="rules">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="模块编号" prop="modCode">
                            <el-input v-model="form.modCode" placeholder="" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="模块名称" prop="modName">
                            <el-input v-model="form.modName" placeholder="" maxlength="30" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">

                    <el-col :span="12">
                        <el-form-item label="模块路由" prop="rtUrl">
                            <el-input v-model="form.rtUrl" placeholder="" maxlength="50" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="父级模块" prop="parentId">
                            <treeselect v-model="form.parentId" :options="moduleArr" placeholder="" />
                        </el-form-item>

                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="模块排序" prop="sort">
                            <el-input v-model="form.sort" placeholder="" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="启用状态" prop="status">
                            <el-switch v-model="form.status" active-color="#13ce66" inactive-color="#ff4949">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="模块图标" prop="icon">
                            <el-input v-model="form.icon" placeholder="" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="模块描述" prop="desc">
                            <el-input v-model="form.desc" placeholder="" maxlength="30" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <div>
                    <el-transfer v-model="form.btnArr" :props="{
                        key: 'value',
                        label: 'desc'
                    }" :data="transdata" :titles="['可赋权限', '将赋权限']">
                    </el-transfer>
                </div>

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
import { MessageBox, Message } from 'element-ui'
import { GetComponentBtnPower } from "@/api/main/index";
import {
    getModuleTree, getModuleTable, getModuleById, addOrUpdateModuleData,
    getDictDetailForCatCode, deleteModuleDataByModuleId
} from "@/api/systemManagement/module/index";
import { dateFormat, Export2Excel } from "@/utils/utils";
export default {
    name: "moduleManagement",

    components: {
        Treeselect,
    },
    data() {
        const generateData = _ => {
            const transdata = [];
            this.catCode = "BtnPermDic";
            getDictDetailForCatCode(this.catCode).then((res) => {
                let buttonList = JSON.parse(res.data);
                if (buttonList.length > 0) {
                    buttonList.forEach((e) => {
                        transdata.push({
                            value: e.keyCode,
                            desc: e.keyName
                        });
                    });
                }
            });
            return transdata;
        };
        return {
            catCode: null,
            filterText: "",
            treeLoading: true,
            moduleArr: [],
            defaultProps: {
                children: "children",
                label: "label",
            },
            buttonPermissions: null,
            //按钮权限对象
            button: { tlNew: true, tlDel: true, tlEdit: true, tlDel: true, tlExcelImport: true, tlExcelExport: true, tlRefresh: true },
            //模块表格数据
            moduleTabledata: [],
            //当前行
            currentRow: null,
            //当前点中树的父级
            currentParentId: null,
            //当前点中树的集合
            currentIds: [],
            //页数大小
            pageSize: 20,
            //当前页面
            page: 1,
            //总共页数
            total: 1,
            // 是否显示弹出层
            open: false,
            form: {
                modCode: null,
                modName: null,
                icon: null,
                rtUrl: null,
                sort: null,
                parentId: null,
                status: true,
                desc: null,
                btnArr: []
            },
            rules: {
                modCode: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "模块编号不能为空",
                    },
                ],
                modName: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "模块名称不能为空",
                    },
                ],
                icon: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "模块图标不能为空",
                    },
                ],
                rtUrl: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "模块路由不能为空",
                    },
                ],
                sort: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "模块排序不能为空",
                    },
                ],
                parentId: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "父级模块不能为空",
                    },
                ],
                status: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "模块状态不能为空",
                    },
                ],
            },
            title: null,
            transdata: generateData(),
            componentName: "moduleManagement",
            ClickOnData: []
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        },
    },
    async created() {
        this.GetComponentBtnPower();
        await this.getModuleTree();

    },
    methods: {

        handleNodeClick(data) {

            if (data.children.length > 0) {
                this.currentParentId = data
            }
            else
            {
                return;
            }
            this.currentIds = {
                parentId: data.id,
                page: this.page,
                size: this.pageSize
            };
            getModuleTable(this.currentIds).then((res) => {
                let tabArr = JSON.parse(res.data);
                this.moduleTabledata = tabArr;
                this.total = res.total;
            });
        },

        getModuleTree() {
            getModuleTree().then((res) => {
                this.moduleArr = res.data;
                this.treeLoading = false
            });
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        clickOnLine(val) {
            this.currentRow = val;
        },
        pageChange(currentPage) {
            this.currentIds.page = currentPage
            // 分页查询
            getModuleTable(this.currentIds).then((res) => {
                let tabArr = JSON.parse(res.data);
                this.moduleTabledata = tabArr;
                this.total = res.total;
            });
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
        vailPerm(btn) {
            return this.buttonPermissions.indexOf(btn) !== -1;
        },
        handleAdd() {
            this.title = "新增模块"
            this.open = true;
        },
        handleUpdate() {
            this.title = "修改模块";
            if (this.currentRow == null) {
                Message({
                    showClose: true,
                    message: "未选择模块信息" || 'Error',
                    type: 'error',
                    duration: 5 * 1000
                })
                return;
            }
            let currentModcode = this.currentRow.modCode;
            getModuleById(currentModcode).then((res) => {
                this.form = JSON.parse(res.data)
            });
            this.open = true;
        },
        handleDelete() {
            if (this.currentRow == null) {
                Message({
                    showClose: true,
                    message: "未选择模块信息" || 'Error',
                    type: 'error',
                    duration: 5 * 1000
                })
                return;
            }
            let delParas = { modCode: this.currentRow.modCode }
            deleteModuleDataByModuleId(delParas).then((res) => {
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
            this.getModuleTree();
            this.cancel();
            this.moduleTabledata = null;
            this.treeLoading = false;
            console.log(this.currentParentId);
            this.handleNodeClick(this.currentParentId)
        },
        handleImport() { },
        //导出
        handleExport() {

        },
        dateFormat,
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    addOrUpdateModuleData(this.form).then((res) => {
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
                modCode: null,
                modName: null,
                icon: null,
                rtUrl: null,
                sort: null,
                parentId: null,
                status: true,
                desc: null,
                btnArr: []
            };
        },
    }
}
</script>

<style>
.module-content {
    margin: 10px;
    height: calc(89vh);
}
</style>