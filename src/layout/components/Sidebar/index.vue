<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg"
        :text-color="variables.menuText" :unique-opened="true" :active-text-color="variables.menuActiveText"
        :collapse-transition="false" mode="vertical"
        @open="handleOpen" 
        :default-openeds="openeds"
        >
        <!-- 遍历路由树 -->
        <sidebar-item v-for="route in requestMenus" :key="route.id" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
import { TreeMenu } from "@/api/Test/Tree";
import { getMenu } from "@/api/main/index";
export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      requestMenus: [],
      openeds:['/systemManagement/systemManagement']
    };
  },
  computed: {
    ...mapGetters(["sidebar", "userId"]),
    routes() {
      return this.$router.options.routes;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
   
    showLogo() {
      // return this.$store.state.settings.sidebarLogo;
      return "true";
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  created() {
    // 页面创建时获取菜单，算是初始化
    this.menus(this.userId);
  },
  methods: {
    menus(userId) {
      // 添加loading
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      // 后台获取菜单树
      getMenu(userId).then((res) => {
        // 关闭loading
        loading.close();
        this.requestMenus = res.data;
      });
      // this.requestMenus = this.listToTree(TreeMenu, -1);
    },
    handleOpen(index) {
      console.log(index);
    },
    listToTree(list, parentId) {
      // 递归转换
      const tree = [];
      for (let i = 0; i < list.length; i++) {
        const temp = list[i];
        temp.meta = { title: temp.title, icon: temp.icon };
        if (temp.parentId === parentId) {
          // 递归子节点
          temp.children = this.listToTree(list, temp.id);
          tree.push(temp);
        }
      }
      return tree;
    },
  },
};
</script>
