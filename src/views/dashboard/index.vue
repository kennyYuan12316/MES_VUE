<template>
  <div class="dashboard-container">
    <!-- <iframe
      id="iframeContain"
      name="iframeContain"
      seamless
      scrolling="yes"
      :src="iframeURL"
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-top-navigation'"
    >
      您当前的浏览器不支持页面上的功能，请升级您当前的浏览器版本或使用谷歌浏览器访问当前页面
    </iframe> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
  data() {
    return {
      iframeURL: "http://localhost:5050/Main.aspx",
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    // margin: 30px;
    background-image: url("~@/assets/WelcomeBack.jpg");
    min-height: calc(100vh - 85px);
    background-size: cover;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
/** iframe样式 */
#iframeContain {
  width: 100%;
  height: 800px;
}
</style>
