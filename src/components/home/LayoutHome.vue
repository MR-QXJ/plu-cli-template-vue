<template>
  <div class="h100 w100 home">
    <a-layout class="h100 w100">
      <a-layout-sider
        breakpoint="lg"
        collapsedWidth="80"
        collapsible
        :trigger="null"
        width="200"
        v-model="collapsed"
      >
        <div :class="['w100', 'logo', collapsed ? 'logo-only' : '']">
          <i class="logo-img" />
          <span class="logo-name" v-show="!collapsed">平台名称</span>
        </div>
        <div class="nav" id="nav">
          <div class="w100 nav-loading" v-show="loading">
            <a-spin :spinning="loading" />
          </div>
          <a-menu
            :inlineCollapsed="collapsed"
            :inlineIndent="24"
            mode="inline"
            :openKeys="openKeys"
            :selectedKeys="selectedKeys"
            @openChange="openChangeHandle"
            @click="navClickHandle"
            v-show="!loading"
          >
            <template v-for="menu in navMenus">
              <a-menu-item
                :key="menu.key"
                v-if="dataIsNullArray(menu.children).length === 0"
              >
                <i
                  class="nav-menu-icon"
                  :style="getNavMenuIcon(navIcons, menu)"
                  v-if="menu.key !== navKey && navIcons[menu.key]"
                />
                <i
                  class="nav-menu-icon"
                  :style="getNavMenuIcon(navIconsSelected, menu)"
                  v-if="menu.key === navKey && navIconsSelected[menu.key]"
                />
                <span class="nav-menu-title" :title="menu.title" v-cloak>{{
                  menu.title
                }}</span>
              </a-menu-item>
              <sub-menu
                :key="menu.key"
                :menu-info="menu"
                :nav-icons="navIcons"
                v-else
              />
            </template>
          </a-menu>
        </div>
      </a-layout-sider>
      <a-layout>
        <a-layout-header>
          <div class="h100 w100 header-content">
            <div class="h100 header-content-left">
              <a
                class="trigger"
                @click="triggerHandle"
                :style="{
                  transform: `rotate(${collapsed ? '180deg' : '0'})`
                }"
              >
                <i class="icon iconfont iconmenu-fold" />
              </a>
            </div>
            <div class="h100 header-content-center">
              <slot name="head-center"></slot>
            </div>
            <div class="h100 header-content-right">
              <slot name="head-right"></slot>
            </div>
          </div>
        </a-layout-header>
        <a-layout-content class="h100">
          <div class="h100 w100 content-wrapper" id="contentWrapper">
            <router-view ref="child" />
          </div>
          <div class="h100 w100 content-loading" v-if="contentloading">
            <a-spin />
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import {
  clearArray,
  dataIsNullArray,
  dataIsNullStr,
  dataIsNullNumber,
  deepFindFamilyUp
} from "utils/tool";
// import { getPowerFuns } from "utils/api";
import { mapActions, mapGetters } from "vuex";
import SubMenu from "components/pub/SubMenu";
export default {
  components: {
    SubMenu
  },
  props: {
    //导航菜单数据
    navMenus: {
      type: Array,
      default: () => []
    },
    //菜单项key映射图标名
    iconMap: {
      type: Object,
      default: () => {
        //示例数据
        return {
          "4028900f6dcd3b23016dde131dc3008f": {
            icon: "home", //常态图标名
            iconSelected: "home-selected" //选中图标名
          },
          "4028900f6dcd3b23016dde149b900091": {
            icon: "dangerpoint",
            iconSelected: "dangerpoint-selected"
          },
          "4028900f70f0ae3a017176565ded011f": {
            icon: "sitepatrol",
            iconSelected: "sitepatrol-selected"
          },
          "4028900f6dcd3b23016dde516a8900a3": {
            icon: "warninglog",
            iconSelected: "warninglog-selected"
          },
          "4028900f6dcd3b23016dde169ff30094": {
            icon: "monitorlog",
            iconSelected: "monitorlog-selected"
          }
        };
      }
    },
    //菜单项图标文件夹名: src=>assets=>imgs=>pub=>xx (getNavIcons设置路径)
    iconRoot: {
      type: String,
      default: "home"
    }
  },
  data() {
    return {
      loading: false, //正在加载全部
      contentloading: false, //正在加载content
      collapsed: false, //菜单折叠
      openKeys: [], //当前展开的菜单项key
      selectedKeys: [], //当前选中的菜单项key
      navKey: "", //点击选中的菜单key
      navIcons: [], //常态菜单图标
      navIconsSelected: [], //选中菜单图标
      navRootKeys: [] //菜单第一级key
    };
  },
  created() {
    this.getNavMenus();
  },
  mounted() {
    this.collapsed = document.body.clientWidth <= 1600;
  },
  methods: {
    ...mapActions(["setNavMenus", "setNavMenuKey"]),
    dataIsNullArray,
    openChangeHandle(openKeys) {
      console.log("有子级的菜单展开/收起回调");
      //展开当前并收起其他菜单项
      const latestOpenKey = openKeys.find(
        key => this.openKeys.indexOf(key) === -1
      );
      if (this.navRootKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys;
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : [];
      }
    },
    navClickHandle(item) {
      console.log("点击菜单项");
      const key = dataIsNullStr(item.key);
      if (key === "") {
        return;
      }
      const itemData = this.getNavClickedData(this.navMenus, key);
      setTimeout(() => {
        const isDiy = dataIsNullNumber(itemData.isSys, 1) === 0;
        const path = dataIsNullStr(itemData.url);
        if (!isDiy) {
          clearArray(this.selectedKeys);
          this.selectedKeys.push(key);
          this.navKey = key;
          this.setNavMenuKey(key);
          //跳转路由，对应权限菜单数据url
          // this.$router.push({
          //   path: `/${path}`
          // });
          return;
        }
        clearArray(this.selectedKeys);
        if (this.navKey !== "") {
          this.selectedKeys.push(this.navKey);
        }
        window.open(encodeURI(path));
      }, 300);
    },
    // 获取点击导航菜单数据
    getNavClickedData(menus, clickKey) {
      let item = null;
      menus.map(menu => {
        if (!item) {
          const key = dataIsNullStr(menu.key, "-1");
          if (key === clickKey) {
            item = JSON.parse(JSON.stringify(menu));
          }
          const children = dataIsNullArray(menu.children);
          if (children.length > 0) {
            item = this.getNavClickedData(children, clickKey);
          }
        }
      });
      return item;
    },
    triggerHandle() {
      this.loading || (this.collapsed = !this.collapsed);
    },
    getNavMenuIcon(icons, menu) {
      return {
        background: `url(${icons[menu.key]}) center center / contain no-repeat`
      };
    },
    //根据key获取menu图标
    getNavIcons(menus) {
      const iconRoot = this.iconRoot;
      menus.map(menu => {
        const key = dataIsNullStr(menu.key, "-1");
        const mapObj = this.iconMap[key];
        if (key !== "-1" && mapObj) {
          const icon = mapObj.icon;
          const iconSelected = mapObj.iconSelected;
          icon &&
            (this.navIcons[
              key
            ] = require(`../../assets/imgs/pub/${iconRoot}/${icon}.png`));
          iconSelected &&
            (this.navIconsSelected[
              key
            ] = require(`../../assets/imgs/pub/${iconRoot}/${iconSelected}.png`));
        }
        const children = dataIsNullArray(menu.children);
        if (children.length > 0) {
          this.getNavIcons(children);
        }
      });
    },
    // 获取权限菜单
    getNavMenus() {
      this.loading = true;
      // const params = {
      //   // pKey: dataIsNullStr(this.navMenuPKey)
      // };
      // getPowerFuns(null, params).then(res => {
      //权限菜单请求返回数据示例
      const res = {
        code: 0,
        data: [
          {
            key: "4028900f6dcd3b23016dde131dc3008f",
            title: "首页",
            parentId: "ff80808168600b4701686022ef240007",
            order: null,
            level: 1,
            children: null,
            url: "/main",
            isPermission: 1
          },
          {
            key: "4028900f6dcd3b23016dde149b900091",
            title: "选项1",
            parentId: "ff80808168600b4701686022ef240007",
            order: null,
            level: 1,
            children: null,
            url: "/item1",
            isPermission: 1
          },
          {
            key: "4028900f70f0ae3a017176565ded011f",
            title: "选项2",
            parentId: "/",
            order: null,
            level: 1,
            children: [
              {
                key: "4028900f70f0ae3a01717657c4850121",
                title: "选项2-1",
                parentId: "4028900f70f0ae3a017176565ded011f",
                order: null,
                level: 2,
                children: null,
                url: "/item2-1",
                isPermission: 1
              },
              {
                key: "4028900f6dcd3b23016dde1522ca0092",
                title: "选项2-2",
                parentId: "4028900f70f0ae3a017176565ded011f",
                order: null,
                level: 2,
                children: null,
                url: "/item2-2",
                isPermission: 1
              }
            ],
            isPermission: 1
          },
          {
            key: "4028900f6dcd3b23016dde516a8900a3",
            title: "选项3",
            parentId: "ff80808168600b4701686022ef240007",
            order: null,
            level: 1,
            children: null,
            url: "/item3",
            isPermission: 1
          },
          {
            key: "4028900f6dcd3b23016dde169ff30094",
            title: "选项4",
            parentId: "ff80808168600b4701686022ef240007",
            order: null,
            level: 1,
            children: null,
            url: "/item4",
            isPermission: 1
          }
        ],
        message: "success",
        timestamp: 1620810841080
      };
      this.loading = false;
      const code = dataIsNullNumber(res.code);
      if (code === 0) {
        const data = dataIsNullArray(res.data);
        this.setNavMenus(JSON.parse(JSON.stringify(data)));
        clearArray(this.navRootKeys);
        this.navIcons = JSON.parse(JSON.stringify({}));
        clearArray(this.selectedKeys);
        clearArray(this.openKeys);
        if (data.length > 0) {
          this.getNavIcons(data);
          this.getNavRootKeys(data);
          const routeName = dataIsNullStr(this.$route.name);
          let menu = this.getNavMenuByRoute(data, routeName);
          if (!menu) {
            menu = this.getNavDefSelectedMenu(data);
          }
          const key = dataIsNullStr(menu.key, "-1");
          if (key !== "-1") {
            this.selectedKeys.push(key);
            const menus = deepFindFamilyUp(data, key);
            if (menus.length > 1) {
              const keyPath = this.getNavKeyPath(menus);
              this.openKeys = JSON.parse(JSON.stringify(keyPath));
            }
            this.navClickHandle(menu);
          }
        }
      }
      // });
    },
    // 获取导航菜单第一级keys
    getNavRootKeys(menus) {
      menus.map(menu => {
        const key = dataIsNullStr(menu.key, "-1");
        if (key !== "-1") {
          this.navRootKeys.push(key);
        }
      });
    },
    // 根据路由获取导航菜单
    getNavMenuByRoute(menus, routeName) {
      let item = null;
      menus.map(menu => {
        if (!item) {
          const url = dataIsNullStr(menu.url, "");
          if (url === routeName) {
            item = JSON.parse(JSON.stringify(menu));
          }
          const children = dataIsNullArray(menu.children);
          if (children.length > 0) {
            item = this.getNavMenuByRoute(children, routeName);
          }
        }
      });
      return item;
    },
    // 获取导航默认选择菜单
    getNavDefSelectedMenu(menus) {
      let item = null;
      menus.map(menu => {
        if (!item) {
          const children = dataIsNullArray(menu.children);
          if (children.length === 0) {
            item = JSON.parse(JSON.stringify(menu));
          }
          if (children.length > 0) {
            item = this.getNavDefSelectedMenu(children, menu);
          }
        }
      });
      return item;
    },
    // 获取导航当前菜单路径
    getNavKeyPath(menus) {
      const keyPath = [];
      menus.map(menu => {
        const key = dataIsNullStr(menu.key, "-1");
        if (key !== "-1") {
          keyPath.push(key);
        }
      });
      return keyPath;
    }
  },
  computed: {
    ...mapGetters(["navMenus", "navMenuPKey"])
  },
  watch: {
    collapsed(value) {
      if (value) {
        clearArray(this.openKeys);
      } else {
        let menus = [];
        if (this.selectedKeys.length > 0) {
          menus = JSON.parse(
            JSON.stringify(
              deepFindFamilyUp(this.navMenus, this.selectedKeys[0])
            )
          );
        }
        if (menus.length > 1) {
          const keyPath = this.getNavKeyPath(menus);
          this.openKeys = JSON.parse(JSON.stringify(keyPath));
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
// 侧边栏背景
$bg-sider: #00474b;
// 侧边栏展开时,多级菜单的子级背景
$bg-submenu-child-open: #157174;
// 侧边栏收起时,多级菜单选中时的父背景
$bg-submenu-parent-select-close: #318db3;
// trigger图标颜色
$color-trigger: #00736e;

.home {
  .ant-layout-sider {
    background-color: $bg-sider;
    .logo {
      @include flex;
      @include flex-secondary-axis-center;
      background: url("../../assets/imgs/pub/home/bg-sider.png") 0 0;
      background-repeat: repeat-x;
      height: 60px;
      padding-left: 7px;

      &.logo-only {
        @include flex-primary-axis-center;
        padding-left: 0;

        .logo-img {
          margin-left: 0;
          margin-right: 0;
        }
      }
      .logo-img {
        @include bg("pub/nav.png", center, center, "../../");
        background-size: 33px 34px;
        display: block;
        height: 34px;
        margin-left: 18px;
        margin-right: 20px;
        width: 33px;
      }
      .logo-name {
        @include text-ellipsis;
        color: $color-white;
        font-size: 18px;
        font-weight: bold;
      }
    }
    .nav {
      height: calc(100% - 60px);
      overflow-x: hidden;
      overflow-y: auto;
      position: relative;

      .nav-loading {
        @include flex;
        @include flex-primary-axis-center;
        margin-top: 30px;
      }
    }
  }
  .ant-layout-header {
    background-color: #002526;
    height: 60px;
    line-height: 60px;
    padding: 0 24px;

    .header-content {
      @include flex;
      @include flex-primary-axis-between;

      .header-content-left {
        @include flex;
        @include flex-secondary-axis-center;

        .trigger {
          display: block;
          flex-shrink: 0;
          height: 20px;
          line-height: 20px;
          margin-right: 20px;
          text-align: center;
          width: 20px;

          .icon {
            color: $color-trigger;
            font-size: 20px;
          }
        }
      }
      .header-content-center {
        @include flex;
        @include flex-secondary-axis-center;
      }
      .header-content-right {
        @include flex;
        @include flex-secondary-axis-center;
      }
    }
  }
  .ant-layout-content {
    @include flex;
    @include flex-column;
    background-color: $color-background;
    overflow: hidden;
    position: relative;
    .content-wrapper {
      flex-shrink: 1;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 0 24px;
      position: relative;
    }
    .content-loading {
      @include flex;
      @include flex-primary-axis-center;
      @include flex-secondary-axis-center;
      background-color: $color-background;
      left: 0;
      position: absolute;
      top: 0;
      z-index: 1;
    }
  }
}

//antd菜单样式覆盖
//收起侧边栏时菜单项tooltip图标
.nav-menu-icon {
  display: inline-block;
  margin-right: 10px;
  height: 14px;
  width: 14px;
  transform: translateY(2px);
  -moz-transform: translateY(2px);
  -webkit-transform: translateY(2px);
  -o-transform: translateY(2px);
}
.ant-layout-sider-collapsed {
  .nav-menu-icon {
    margin-right: 0;
  }
  .nav-menu-title {
    display: none;
  }
}
.ant-menu-inline,
.ant-menu-vertical,
.ant-menu-vertical-left {
  border-right-width: 0;

  // 未收缩的选中菜单（没有子菜单）
  .ant-menu-item-selected {
    color: $color-white;
  }
}
// 未收缩非顶级菜单背景色
/deep/ .ant-menu-submenu > .ant-menu {
  background-color: $bg-submenu-child-open !important;
}
//收起侧边栏时当前多级菜单父菜单背景色
/deep/ .ant-menu-inline-collapsed {
  .ant-menu-submenu-selected {
    .ant-menu-submenu-title {
      background-color: $bg-submenu-parent-select-close;
    }
  }
}
// .ant-menu-submenu, .ant-menu-submenu-inline
// 侧边栏收展
.nav-menu-title {
  display: inline-block;
}
.ant-menu-item {
  padding: 0 20px;
}
// 当前菜单项箭头
.ant-menu-vertical .ant-menu-item:after,
.ant-menu-vertical-left .ant-menu-item:after,
.ant-menu-vertical-right .ant-menu-item:after,
.ant-menu-inline .ant-menu-item:after {
  bottom: 50%;
  display: block;
  border: solid 13px $color-background;
  border-top-width: 10px;
  border-bottom-width: 10px;
  border-top-color: transparent;
  border-bottom-color: transparent;
  border-left-color: transparent;
  height: 0;
  margin-top: -10px;
  top: 50%;
  width: 0;
}
</style>
