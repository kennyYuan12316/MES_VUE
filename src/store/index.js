import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
//解决页面刷新vuex值消失
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)
// 创建PERSIST_PATHS变量 存储要持久化的模块
const PERSIST_PATHS = ['user']
const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    tagsView,
    permission
  },
  getters,
  // 新增规则保存vuex的值
  plugins: [createPersistedState({
    storage: window.sessionStorage,
    // 在此使用
    paths: PERSIST_PATHS
  })]
})

export default store
