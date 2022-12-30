<template>
    <div class="account-content">
        <el-row :gutter="15">
            <!--部门数据-->
            <el-col :span="4" :xs="24">
                <div>
                    <el-input :placeholder="$t('qing-shu-ru-bu-men-ming-cheng')" clearable v-model="filterText"
                        size="small" prefix-icon="el-icon-search" style="margin:10px 10px" />
                </div>
                <div>
                    <el-tree :data="deptArr" :props="defaultProps" @node-click="handleNodeClick" default-expand-all
                        :filter-node-method="filterNode" v-loading="treeLoading" ref="tree"></el-tree>
                </div>
            </el-col>
            <!--用户数据-->
            <el-col :span="16" :xs="24">

                <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);margin-top: 10px;padding: 10px;">
                    <el-row :gutter="20" >
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
                    <el-table :data="accountTabledata" style="width: 100%;margin-top: 10px" height="40vh" highlight-current-row
                        :border="true" size="mini" @current-change="clickOnLine"
                        :cell-style="{ 'text-align': 'center' }"
                        :header-cell-style="{ color: '$a9b5cd', 'text-align': 'center' }">
                        <el-table-column prop="acctName" label="用户名称"></el-table-column>
                        <el-table-column prop="acctId" label="用户ID"></el-table-column>
                        <el-table-column prop="phone" label="电话"></el-table-column>
                        <el-table-column prop="email" label="邮箱"></el-table-column>
                        <el-table-column prop="image" label="图片路径"></el-table-column>
                        <el-table-column prop="gender" label="性别">
                            <template slot-scope="scope">
                                <el-radio disabled v-model="scope.row.gender" :label="true">男</el-radio>
                                <el-radio disabled v-model="scope.row.gender" :label="false">女</el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="启用状态">
                            <template slot-scope="scope">
                                <el-switch disabled v-model="scope.row.status" active-color="#13ce66"
                                    inactive-color="#ff4949">
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column prop="deptId" label="部门编号"></el-table-column>
                    </el-table>

                    <el-table :data="roleTabledata" style="width: 100%" height="43vh" highlight-current-row :border="true"
                    size="mini">
                    <el-table-column prop="roleName" label="角色名称"></el-table-column>
                    <el-table-column prop="roleCode" label="角色编号"></el-table-column>
                </el-table>
                </div>

                
            </el-col>
            <!--权限列表-->
            <el-col :span="4" :xs="24">
                <div style="padding-right:15px;padding-top: 8px;height: 88vh;">
                    <el-card class="box-card" style="height:100%;overflow: auto;">
                        <el-tree :data="moduleArr" :props="defaultProps" show-checkbox node-key="id" default-expand-all
                            ref="tree"></el-tree>
                    </el-card>

                </div>
            </el-col>
        </el-row>

        <!-- 添加或修改用户对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body center :show-close="false"
            :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" label-width="80px" label-position="left" :rules="rules">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="工号" prop="acctId">
                            <el-input v-model="form.acctId" placeholder="请输入工号" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="用户姓名" prop="acctName">
                            <el-input v-model="form.acctName" placeholder="请输入用户姓名" maxlength="30" />
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="部门" prop="deptId">
                            <treeselect v-model="form.deptId" :options="deptArr" placeholder="请选择部门" />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="角色" prop="roleList">
                            <!-- <treeselect v-model="form.dicType" :options="dataDicArr" @input="InsertdataDicArr" /> -->
                            <el-select v-model="form.roleList" multiple placeholder="请选择角色" ref="roleSelect">
                                <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName"
                                    :value="item.roleId" />
                            </el-select>
                        </el-form-item>
                    </el-col>

                </el-row>

                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="电话" prop="phone">
                            <el-input v-model="form.phone" placeholder="请输入电话" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮件" prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮件" maxlength="30" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <el-form-item label="头像" prop="image">
                            <el-input v-model="form.image" placeholder="请选择头像" maxlength="30" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="性别" prop="gender">
                            <el-radio v-model="form.gender" :label="true">男</el-radio>
                            <el-radio v-model="form.gender" :label="false">女</el-radio>
                        </el-form-item>

                    </el-col>
                    <el-col :span="5">
                        <el-form-item :label="$t('shi-fou-qi-yong')" prop="status">
                            <el-switch v-model="form.status" active-color="#13ce66" inactive-color="#ff4949">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div style="height:25vh;overflow: auto;">
                    <el-tree :data="moduleOperArr" :props="defaultProps" show-checkbox node-key="id" default-expand-all
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
    getOrganizationTree as getOrganizationTreeAPI,
    getPermDataByAcctId, getAccoutByDeptIdTable, addOrUpdateAccountData,
    getAccountRolePermByAccountId, deleteAccountRolePermByAccountId
} from "@/api/systemManagement/account/index";
import {
    getModuleDetailTree
} from "@/api/systemManagement/module/index";
import { getRoleTable, getRoleDataByAcctId } from "@/api/systemManagement/role";
import { dateFormat, Export2Excel } from "@/utils/utils";
import { GetComponentBtnPower } from "@/api/main/index";
export default {
    name: "accountManagement",
    components: {
        Treeselect,
    },
    data() {
        return {
            filterText: "",
            accountTabledata: [],
            roleTabledata: [],
            deptArr: [],
            moduleArr: [],

            defaultProps: {
                children: "children",
                label: "label",
            },
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            //弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            form: {
                acctName: null,
                acctId: null,
                phone: null,
                email: null,
                image: null,
                gender: true,
                status: true,
                deptId: null,
                roleList: null,
                acctOprsList: null
            },
            rules: {
                acctName: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "姓名不能为空",
                    },
                ],
                acctId: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "工号不能为空",
                    },
                ],
                deptId: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "部门不能为空",
                    },
                ],
                roleList: [
                    {
                        required: true,
                        trigger: "blur",
                        message: "角色不能为空",
                    },
                ],
            },
            currentRow: null,
            currentIds: [],
            buttonPermissions: null,
            componentName: "accountManagement",
            currentParentId: null,
            //按钮权限对象
            button: { tlNew: true, tlDel: true, tlEdit: true, tlDel: true, tlExcelImport: true, tlExcelExport: true, tlRefresh: true },
            // button: { },
            treeLoading: true,
            moduleOperArr: [],
            roleList: null,
        };
    },
    async created() {
        this.GetComponentBtnPower();
        await this.getOrganizationTree();
        await this.getModuleDetailTree(true);
        await this.getModuleDetailTree(false);
        await this.getRoleTable()
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        },
    },
    methods: {
        handleNodeClick(data) {
            if (data != null) (this.currentParentId = data)
            getAccoutByDeptIdTable(this.currentParentId.id).then((res) => {
                let tabArr = res.data;
                this.accountTabledata = tabArr;
            });

        },
        getRoleTable() {
            return new Promise((resolve, reject) => {
                getRoleTable().then(res => {

                    this.roleList = res.data;
                    resolve()
                })
            })
        },
        getOrganizationTree() {
            return new Promise((resolve, reject) => {
                getOrganizationTreeAPI().then((res) => {
                    console.log(res)
                    this.deptArr = res.data;
                    this.treeLoading = false;
                    resolve();

                });
            });
        },
        getModuleDetailTree(disable) {
            return new Promise((resolve, reject) => {
                getModuleDetailTree(disable).then((res) => {
                    if (!disable)
                        this.moduleOperArr = res.data
                    else
                        this.moduleArr = res.data;
                    this.treeLoading = false
                    resolve()
                });
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
        handleAdd() {
            this.title = "添加用户信息";
            this.open = true;
        },
        handleUpdate() {
            if (this.currentRow) {
                this.title = "修改用户信息";

                getAccountRolePermByAccountId(this.currentRow.acctId).then((res) => {
                    this.form = res.data
                    this.$refs.treeDetail.setCheckedKeys(this.form.acctOprsList);
                });
                this.open = true;
            } else {
                this.$message({
                    type: 'error',
                    message: '请选择数据',
                    duration: 2 * 1000,
                    showClose: true
                })
            }

        },
        handleDelete() {
            if (this.currentRow == null) {
                Message({
                    showClose: true,
                    message: "未选择用户信息" || 'Error',
                    type: 'error',
                    duration: 5 * 1000
                })
                return;
            }
            let delParas = { acctId: this.currentRow.acctId }
            deleteAccountRolePermByAccountId(delParas).then((res) => {
                this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'success',
                    duration: 5 * 1000
                })


                if (this.currentParentId != null) {
                    getAccoutByDeptIdTable(this.currentParentId.id).then((res) => {
                        let tabArr = res.data;
                        this.accountTabledata = tabArr;
                    });
                }

            });

        },
        handleImport() { },
        //导出
        handleExport() {

        },
        handleRefresh() {
            this.accountTabledata = null;
            this.roleTabledata = null;
            this.$refs.tree.setCheckedKeys([]);
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
            this.form.acctOprsList = currentRoleOpre.filter(f => {
                if (f.indexOf('_') != -1)
                    return f
            })
            this.$refs.form.validate((valid) => {
                if (valid) {
                    console.log(this.form)
                    addOrUpdateAccountData(this.form).then(async (res) => {
                        this.$message({
                            showClose: true,
                            message: res.message,
                            type: "success",
                            duration: 3 * 1000,
                        });
                        this.treeLoading = true;
                        await this.getOrganizationTree();
                        this.cancel();
                        this.OrganizationTabledata = null;
                        this.treeLoading = false;

                        if (this.currentParentId != null) {
                            getAccoutByDeptIdTable(this.currentParentId.id).then((res) => {
                                let tabArr = res.data;
                                this.accountTabledata = tabArr;
                            });
                        }



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
            if (val != null) {
                this.currentRow = val
                getRoleDataByAcctId(this.currentRow.acctId).then((res) => {
                    let tabArr = res.data;
                    this.roleTabledata = tabArr;
                });
                getPermDataByAcctId(this.currentRow.acctId).then((res) => {
                    let PermDetailArr = res.data;
                    this.$refs.tree.setCheckedKeys(PermDetailArr);
                });

            }
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
                acctName: null,
                acctId: null,
                phone: null,
                email: null,
                image: null,
                gender: true,
                status: true,
                deptId: null,
                roleList: null,
                acctOprsList: null
            }
            this.$refs.treeDetail.setCheckedKeys([]);
        },
        dateFormat,
        vailPerm(btn) {
            return this.buttonPermissions.indexOf(btn) !== -1;
        },
    },
};
</script>

<style>
.organization-content {
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
</style>