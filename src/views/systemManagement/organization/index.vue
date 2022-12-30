<template>
  <div class="organization-content">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div>
          <el-input
            :placeholder="$t('qing-shu-ru-bu-men-ming-cheng')"
            clearable
            v-model="filterText"
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div>
          <el-tree
            :data="deptArr"
            :props="defaultProps"
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
            v-loading="treeLoading"
            ref="tree"
            default-expand-all
          ></el-tree>
        </div>
      </el-col>
      <!--部门数据-->
      <el-col :span="20" :xs="24">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-if="button.tlNew"
              >{{ $t("xin-zeng") }}</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-edit"
              size="mini"
              @click="handleUpdate"
              v-if="button.tlEdit"
              >{{ $t("xiu-gai") }}</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              v-if="button.tlDel"
              >{{ $t("shan-chu") }}</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-if="button.tlExcelImport"
              >{{ $t("dao-ru") }}</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-if="button.tlExcelExport"
              >{{ $t("dao-chu") }}</el-button
            >
          </el-col>
        </el-row>
        <el-table
          :data="OrganizationTabledata"
          style="width: 100%"
          height="83vh"
          highlight-current-row
          @current-change="clickOnLine"
          size="mini"
        >
          <el-table-column
            fixed
            prop="deptId"
            label="部门编号"
            width="140"
          ></el-table-column>
          <el-table-column
            prop="deptName"
            label="部门名称"
            width="240"
          ></el-table-column>
          <el-table-column
            prop="status"
            label="启用状态"
          ></el-table-column>
          <el-table-column
            prop="parentId"
            label="父级ID"
          ></el-table-column>
          <el-table-column
            prop="createUser"
            label="创建用户"
          ></el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
          ></el-table-column>
        </el-table>
        <div style="text-align: center; padding: 5px">
          <el-pagination
            background
            :page-size="pageSize"
            :pager-count="7"
            :current-page="page"
            layout="prev, pager, next"
            :total="total"
            @current-change="pageChange"
          >
          </el-pagination>
        </div>
      </el-col>
    </el-row>

    <!-- 添加或修改组织架构对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      center
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        ref="form"
        :model="form"
        label-width="68px"
        label-position="left"
        :rules="rules"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="$t('dan-wei-bian-hao-0')" prop="deptId">
              <el-input
                v-model="form.deptId"
                :placeholder="$t('qing-shu-ru-dan-wei-bian-hao')"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('shang-ji-bu-men')" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="deptArr"
                :placeholder="$t('xuan-ze-shang-ji-bu-men')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item :label="$t('dan-wei-ming-cheng-0')" prop="deptName">
              <el-input
                v-model="form.deptName"
                :placeholder="$t('qing-shu-ru-dan-wei-ming-cheng')"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('shi-fou-qi-yong')" prop="status">
              <el-switch
                v-model="form.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      
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
  getOrganizationTree as getOrganizationTreeApi,
  PostOrganizationTable,
  AddOrUpdateOrganizationData,
  getDeptById,
  GetAllOrganization,
} from "@/api/organization/index";
import { dateFormat, Export2Excel } from "@/utils/utils";
import { GetComponentBtnPower } from "@/api/main/index";
export default {
  name: "organizationManagement",
  components: {
    Treeselect,
  },
  data() {
    return {
      filterText: "",
      OrganizationTabledata: [],
      deptArr: [],
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
      isAdd: false,
      // 是否显示弹出层
      open: false,
      form: {
        deptId: null,
        deptName: null,
        //设置为null treeselect不会显示unknown
        parentId: null,
        status: true
      },
      rules: {
        deptId: [
          {
            required: true,
            trigger: "blur",
            message: "部门编号不能为空",
          },
        ],
        deptName: [
          {
            required: true,
            trigger: "blur",
            message: "部门名称不能为空",
          },
        ],
        parentId: [
          {
            required: true,
            trigger: "blur",
            message: "父级菜单不能为空",
          },
        ],
      },
      currentRow: null,
      page: 1,
      pageSize: 10,
      currentIds: [],
      total: 1,
      buttonPermissions: null,
      componentName: "organizationManagement",
        //按钮权限对象
        // button: { tlNew: true, tlDel: true, tlEdit: true, tlDel: true, tlExcelImport: true, tlExcelExport: true, tlRefresh: true },
        button: {},
      treeLoading: true,
    };
  },
  async created() {
    this.GetComponentBtnPower();
    await this.getOrganizationTree();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
      var ids = [];
      if (data.children.length > 0) {
        data.children.forEach((e) => {
          ids.push(e.id);
        });
      } else {
        ids.push(data.id);
      }
      console.log(ids);
      this.currentIds = {
        deptIdArr: ids,
      };
      PostOrganizationTable(this.currentIds, 1, this.pageSize).then((res) => {
        let tabArr = JSON.parse(res.data);
        this.OrganizationTabledata = tabArr;
        this.total = res.total;
      });
    },
    getOrganizationTree() {
      return new Promise((resolve, reject) => {
        getOrganizationTreeApi().then((res) => {
          this.deptArr = res.data;
          this.treeLoading = false;
          resolve();
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
      this.title = this.$t("xin-zeng-zu-zhi-jia-gou");
      this.open = true;
      this.isAdd = true;
    },
    handleUpdate() {
      this.title = this.$t('xiu-gai-zu-zhi-jia-gou');
      let currentDeptId = this.currentRow.FC_DeptID;
      getDeptById(currentDeptId).then((res) => {
        this.form = JSON.parse(res.data);
      });
      this.open = true;
      this.isAdd = false;
    },
    handleDelete() {},
    handleImport() {},
    //导出
    handleExport() {
      const header = [
        {
          title: this.$t("dan-wei-bian-hao-0"),
          column: "FC_DeptID",
        },
        {
          title: this.$t("dan-wei-ming-cheng-0"),
          column: "FC_GovName",
        },
        {
          title: this.$t("ji-bie"),
          column: "FN_Level",
        },
        {
          title: this.$t("erp-bian-hao"),
          column: "FC_ERPNo",
        },
        {
          title: this.$t("chuang-jian-yong-hu"),
          column: "FC_CUserID",
        },
        {
          title: this.$t("chuang-jian-ri-qi"),
          column: "FD_CDate",
        },
        {
          title: this.$t("geng-xin-yong-hu"),
          column: "FC_UUserID",
        },
        {
          title: this.$t("geng-xin-ri-qi"),
          column: "FD_UDate",
        },
        {
          title: this.$t("miao-shu-0"),
          column: "FC_Description",
        },
      ];
      GetAllOrganization().then((res) => {
        Export2Excel(header, res.data, this.componentName);
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          AddOrUpdateOrganizationData(this.form).then(async (res) => {
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
      this.currentRow = val;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.isAdd = false;
      this.reset();
    },
    // 清空表单
    reset() {
      this.title = "";
      this.form = {
        deptId: null,
        deptName: null,
        status: true,
        parentId: null
      };
      // this.resetForm("form");
    },
    dateFormat,
    pageChange(currentPage) {
      this.page = currentPage;
      // 分页查询
      PostOrganizationTable(this.currentIds, this.page, this.pageSize).then(
        (res) => {
          let tabArr = JSON.parse(res.data);
          this.OrganizationTabledata = tabArr;
          this.total = res.total;
        }
      );
    },
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
</style>