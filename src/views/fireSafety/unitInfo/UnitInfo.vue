<template>
  <div class="unit-info h100">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      :border="false"
      :title="unitName"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div
      class="border-radius info-content w100"
      :style="{ height: `${$root.contentHeight}px` }"
    >
      <van-tabs @click="changNav">
        <van-tab title="单位户籍基本信息" default></van-tab>
        <van-tab title="从业人员信息" default></van-tab>
      </van-tabs>
      <Detail
        v-if="currentTab == 0"
        :unitInfo="unitInfo"
        :compile="true"
        :userlevel="userlevel"
        @compile="handlecompile"
      ></Detail>
      <Employee
        v-if="currentTab == 1"
        :column="column"
        :unitId="unitId"
        :contentHeight="$root.contentHeight"
        :userlevel="userlevel"
      ></Employee>
    </div>
  </div>
</template>

<script>
import {
  removeBackButton,
  addBackButton,
  dataIsNullStr,
  dataIsNullObj
} from "utils/tool";
import { getFireUnitHouseRegister, getUnitDetailsByFire } from "utils/api";
import Detail from "components/firesafety/unitinfo/Detail";
import Employee from "components/firesafety/unitinfo/Employee";
export default {
  components: {
    Detail,
    Employee
  },
  data() {
    return {
      // 单位名称
      unitName: "",
      // 单位ID
      unitId: null,
      // 单位信息
      unitInfo: [],
      column: [],
      currentTab: 0,
      index: 0,
      params: {
        pageNo: 1,
        pageSize: 15,
        total: 0
      },
      // 角色权限
      userlevel: 0
    };
  },
  methods: {
    changNav(currentTab) {
      this.currentTab = currentTab;
      if (currentTab == 1) {
        let column = ["姓名", "性别", "职务", "联系电话"];
        if (this.userlevel == 1) {
          column.push("操作");
        }
        this.column = column;
      } else {
        this.getInfo();
      }
    },
    // 获取单位信息
    getInfo() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      let param = {
        key: this.unitId
      };
      const unitManage = () => {
        return new Promise(resolve => {
          getFireUnitHouseRegister(param).then(res => {
            resolve(res);
          });
        });
      };
      const adminManage = () => {
        return new Promise(resolve => {
          getUnitDetailsByFire(param).then(res => {
            resolve(res);
          });
        });
      };
      const user = localStorage.getItem("identity");
      Promise.all([user == "adminManager" ? adminManage() : unitManage()]).then(
        res => {
          const infoData = dataIsNullObj(res[0].data);
          this.unitInfo = [
            {
              name: "单位名称",
              data: dataIsNullStr(infoData.unitName, "未知")
            },
            {
              name: "单位地址",
              data: dataIsNullStr(infoData.address, "未知")
            },
            {
              name: "单位类型",
              data: dataIsNullStr(infoData.unitTypeName, "未知")
            },
            {
              name: "所属行业",
              data: dataIsNullStr(infoData.industryTypeName, "未知")
            },
            {
              name: "监控级别",
              data: dataIsNullStr(infoData.regulateLevelName)
            },
            {
              name: "单位联系电话",
              data: dataIsNullStr(infoData.telephone, "未知")
            },
            {
              name: "安全管理员",
              data: dataIsNullStr(infoData.personName, "未知")
            },
            {
              name: "值班人员电话",
              data: dataIsNullStr(infoData.personPhone, "未知")
            }
          ];

          this.$toast.clear();
        }
      );
    },

    // 进入单位信息编辑页
    handlecompile() {
      this.$router.push(
        `/compile?id=${this.unitId}&userlevel=${this.userlevel}`
      );
    }
  },
  created() {
    this.unitName = this.$route.query.name;
    this.unitId = this.$route.query.id;
    this.userlevel = this.$route.query.userlevel;
    this.getInfo();
  },
  mounted() {
    this.$root.backBtnFn = this.$root.goBack;
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // 添加监听home键回退
    addBackButton(this.$root.backBtnFn);
    this.$root.navH = document.querySelector(".van-nav-bar").offsetHeight;
  }
};
</script>

<style lang="scss" scoped>
.unit-info {
  background-color: #efeff4;
  .van-nav-bar {
    background: #0e41a6;
  }
  /deep/.van-tabs__nav {
    border-radius: 3px 3px 0 0;
    border-bottom: 1px solid #d9d9d9;
    .van-tabs__line {
      width: 100px;
      height: 1px;
      background: rgb(30, 80, 181);
    }
  }
  /deep/.van-tab {
    color: rgb(153, 153, 153);
    &.van-tab--active {
      color: rgb(30, 80, 181);
    }
  }
  .info-content {
    box-sizing: border-box;
    padding: 10px;
  }
}
</style>
