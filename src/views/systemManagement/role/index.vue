<template>
    <div class="role-content">
        <el-row :gutter="15">
            <el-col :span="14" :xs="24">
                <el-card>
                    <el-table :data="roleMasterTable" style="width: 100%" height="83vh" highlight-current-row ref="roleTable"
                        :border="true" size="mini" @current-change="clickOnLine">
                        <el-table-column prop="roleId" label="角色编号"></el-table-column>
                        <el-table-column prop="roleName" label="角色名称"></el-table-column>
                        <el-table-column prop="createUser" label="创建用户"></el-table-column>
                        <el-table-column prop="createDate" label="创建时间" :formatter="dateFormat"></el-table-column>
                        <el-table-column prop="updateUser" label="更新用户"></el-table-column>
                        <el-table-column prop="updateDate" label="更新时间" :formatter="dateFormat"></el-table-column>
                    </el-table>
                </el-card>
            </el-col>
            <el-col :span="10" :xs="24">
                <el-row :gutter="20" style="margin: 10px 10px;">
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
                <div>
                    <el-tree :data="moduleArr" :props="defaultProps" show-checkbox node-key="id" default-expand-all
                        ref="tree"></el-tree>
                </div>

            </el-col>
        </el-row>
        <!-- 添加或修改角色对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body center :show-close="false"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" label-width="80px" label-position="left" :rules="rules">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="角色编号" prop="roleId">
                            <el-input v-model="form.roleId" placeholder="输入角色编号" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="角色名称" prop="roleName">
                            <el-input v-model="form.roleName" placeholder="输入角色名称" maxlength="30" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <div style="height:40vh;overflow: auto;">
                    <el-tree :data="moduleArr" :props="defaultProps" show-checkbox node-key="id" default-expand-all
                        ref="treeDetail"></el-tree>
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
import {
    getRoleTable, addOrUpdateRoleData,
    deleteRoleDataByRoleId, getRoleDetailTable
} from "@/api/systemManagement/role/index";

import {
    getModuleDetailTree
} from "@/api/systemManagement/module/index";

import { dateFormat, Export2Excel } from "@/utils/utils";
import { GetComponentBtnPower } from "@/api/main/index";
export default {
    name: "roleManagement",
    components: {
        Treeselect,
    },
    data() {
        return {
            filterText: "",
            roleMasterTable: [],
            moduleArr: [],
            defaultProps: {
                children: "children",
                label: "label",
            },
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            isAdd: false,
            isDelete: false,
            //弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            currentRow: null,
            currentIds: [],
            buttonPermissions: null,
            componentName: "roleManagement",
            currentParentId: null,
            //按钮权限对象
            button: { tlNew: true, tlDel: true, tlEdit: true, tlDel: true, tlExcelImport: true, tlExcelExport: true, tlRefresh: true },
            // button: { },
            treeLoading: true,
            form: {
                roleName: null,
                roleId: null,
                permList: []
            },
            rules: {
                roleName: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "角色名称不能为空",
                    },
                ],
                roleId: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "角色编号不能为空",
                    },
                ],
            },
        };
    },
    async created() {
        this.GetComponentBtnPower();
        await this.getRoleTable();
        await this.getModuleTree();
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        },
    },
    methods: {
        getRoleTable() {
            return new Promise((resolve, reject) => {
                getRoleTable().then((res) => {
                    console.log(res)
                    this.roleMasterTable = res.data;
                    resolve();

                });
            });
        },
        getModuleTree() {
            return new Promise((resolve, reject) => {
                getModuleDetailTree(false).then((res) => {
                    this.moduleArr = res.data;
                    this.treeLoading = false
                });
            });
        },
        getCheckedNodes() {
            console.log(this.$refs.treeDetail.getCheckedNodes());
        },
        handleRefresh() {
            this.getRoleTable();
            this.$refs.tree.setCheckedKeys([]);
            // if (this.isDelete == false) {
            //     this.clickOnLine(this.currentRow)
            // }
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
        handleAdd() {
            this.title = "添加角色信息";
            this.open = true;
            this.isAdd = true;
            this.isDelete = false;
        },
        handleUpdate() {
            this.title = "修改角色信息";
            this.isAdd = false;
            this.open = true;
            this.isDelete = false;
            if (this.currentRow == null) {
                Message({
                    showClose: true,
                    message: "未选择角色信息" || 'Error',
                    type: 'error',
                    duration: 5 * 1000
                })
                return;
            }
            getRoleDetailTable(this.currentRow.roleId).then((res) => {
                let roleDetailArr = res.data;
                console.log(roleDetailArr)
                this.$refs.treeDetail.setCheckedKeys(roleDetailArr);
                this.form.roleId = this.currentRow.roleId;
                this.form.roleName = this.currentRow.roleName;
            });

        },
        handleDelete() {
            if (this.currentRow == null) {
                Message({
                    showClose: true,
                    message: "未选择角色信息" || 'Error',
                    type: 'error',
                    duration: 5 * 1000
                })
                return;
            }
            let delParas = { roleId: this.currentRow.roleId }
            deleteRoleDataByRoleId(delParas).then((res) => {
                this.isDelete = true
                this.handleRefresh()
                this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'success',
                    duration: 5 * 1000
                })
                return;
            });
        },
        handleImport() { },
        //导出
        handleExport() {

        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        submitForm() {
            let nodedata = this.$refs.treeDetail.getCheckedNodes()
            let currentRoleOpre = []
            nodedata.forEach((f) => {
                // 将后台权限属性加入到button对象中
                currentRoleOpre.push(f.id)
            });
            this.form.permList = currentRoleOpre.filter(f => {
                if (f.indexOf('_') != -1)
                    return f
            })
            this.$refs.form.validate((valid) => {
                if (valid) {
                    addOrUpdateRoleData(this.form).then((res) => {
                        if (this.isAdd == true) {
                            this.currentRow = {
                                roleId: this.form.roleId,
                                roleName: this.form.roleName
                            }

                        }
                        this.handleRefresh()
                        this.$refs.treeDetail.setCheckedKeys([]);
                        this.$message({
                            showClose: true,
                            message: res.message,
                            type: "success",
                            duration: 3 * 1000,
                        });
                        this.open = false
                        this.reset();
                        
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
        clickOnLine(val) {
            console.log(val)
            if (val != null) {
                this.currentRow = val
                getRoleDetailTable(this.currentRow.roleId).then((res) => {
                    let roleDetailArr = res.data;
                    console.log(roleDetailArr)
                    this.$refs.tree.setCheckedKeys(roleDetailArr);
                });
            }
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
            this.$refs.treeDetail.setCheckedKeys([]);
        },
        // 清空表单
        reset() {
            this.title = "";
            this.form = {
                roleName: null,
                roleId: null,
                permList: []
            };
            
        },
        dateFormat,
        vailPerm(btn) {
            return this.buttonPermissions.indexOf(btn) !== -1;
        },
    },
};
</script>

<style>

</style>