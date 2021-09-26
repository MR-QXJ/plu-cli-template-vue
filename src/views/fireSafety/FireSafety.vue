<template>
  <div class="detachment-box w100 h100">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      :border="false"
      title="消防安全管理"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <search
      v-if="userLevel > 1"
      :selectArray="sonsultingType"
      @searchInfo="searchImp"
      placehodler="请输入单位名称"
    ></search>
    <div
      class="detachment-content"
      :style="{ height: $root.contentHeight + 'px' }"
    >
      <van-tabs v-if="userLevel > 1" @click="changNav">
        <van-tab title="重点关注" default></van-tab>
        <van-tab title="单位列表" default></van-tab>
      </van-tabs>
      <div class="detachment w100">
        <template-index
          v-if="showImportant"
          :total="imptotal"
          :currentTab="currentTab"
        >
          <div slot="card">
            <van-list
              class="w100"
              :finished="noMore"
              finished-text="没有更多啦"
              v-model="loading"
              offset="200"
              @load="scroll"
              :style="{
                height: `${$root.contentHeight - 74 * $root.ratePX}px`,
                'overflow-y': 'auto'
              }"
            >
              <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <content-com
                  v-for="(item, index) in impShowData"
                  :key="index"
                  :userLevel="userLevel"
                  :unitID="item.unitId"
                  :unitName="item.unitName"
                  :alarm="item.alarm"
                  :alarmGrade="item.alarmGrade"
                  :hidden="item.hidden"
                  :video="item.video"
                  :isShow="item.isShow"
                  :riskName="item.riskName"
                  @isShowF="ImpIsShow"
                ></content-com>
              </van-pull-refresh>
            </van-list>
          </div>
        </template-index>
        <template-index
          v-if="showUnit"
          :total="unitTotal"
          :currentTab="currentTab"
        >
          <div slot="card">
            <van-list
              class="w100"
              :finished="noMore"
              finished-text="没有更多啦"
              v-model="loading"
              offset="200"
              @load="scroll"
              :style="{
                height: `${
                  userLevel == 1
                    ? $root.contentHeight - 50 * $root.ratePX
                    : $root.contentHeight - 74 * $root.ratePX
                }px`,
                'overflow-y': 'auto'
              }"
            >
              <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                <content-com
                  v-for="(item, index) in unitListData"
                  :key="index"
                  :userLevel="userLevel"
                  :unitID="item.unitId"
                  :unitName="item.unitName"
                  :alarm="item.alarm"
                  :alarmGrade="item.alarmGrade"
                  :hidden="item.hidden"
                  :video="item.video"
                  :isShow="item.isShow"
                  :riskName="item.riskName"
                  @isShowF="UnitIsShow"
                ></content-com>
              </van-pull-refresh>
            </van-list>
          </div>
        </template-index>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  removeBackButton,
  addBackButton,
  dataIsNullNumber,
  dataIsNullArray,
  dataIsNullStr
} from "utils/tool";
import {
  getSearchMenu,
  getUnitListByFire,
  getFireUnitLists,
  deleteFocusUnitByFire,
  insertFocusUnitByFire
} from "utils/api";
import TemplateIndex from "components/pub/TemplateIndex";
import Search from "components/pub/Search";
import ContentCom from "components/pub/ContentCom";
export default {
  components: {
    TemplateIndex,
    Search,
    ContentCom
  },
  data() {
    return {
      // tabBars
      tabBars: [],
      // 选中
      currentTab: 0,
      num: 0,
      // 用户ID
      userId: null,
      // 单位ID
      unitId: null,
      // 下拉选项
      sonsultingType: [],
      // 重点单位数据
      importantData: [],
      // 重点单位显示数据
      impShowData: [],
      // 重点单位总数
      imptotal: 0,
      // 重点单位页码
      impPageNo: 1,
      // 分页每页显示记录数
      PageSize: 15,
      // 接口调用参数
      tableParams: {},
      // 单位列表数据
      unitListData: [],
      // 单位列表显示数据
      unitShowData: [],
      // 单位列表页码
      unitPageNo: 1,
      unitTotal: 0,
      // 接口调用参数
      unitParams: {},
      // 关注取关操作
      showArr: [],
      showImportant: false,
      showUnit: false,
      // 用户权限
      userLevel: 0,
      // 下拉刷新
      triggered: false,
      // 刷新定时器
      loading: false,
      refreshing: false,
      noMore: false
    };
  },
  methods: {
    dataIsNullNumber,
    // 切换
    changNav: function(currentTab) {
      this.currentTab = currentTab;
      this.tableParams = {};
      this.noMore = false;
      this.unitPageNo = 1;
      this.unitTotal = 0;
      this.imptotal = 0;
      this.impPageNo = 1;
      if (this.tabBars.length < 1) {
        this.getUnitList();
      } else {
        if (currentTab == 0) {
          localStorage.removeItem("isshow");
          this.showArr = [];
          this.showImportant = true;
          this.showUnit = false;
          this.getImportant();
        } else {
          this.showImportant = false;
          this.showUnit = true;
          this.getUnitList();
        }
        if (currentTab == 1 && this.num == 0) {
          this.num++;
        } else {
          const res = localStorage.getItem("isshow");
          const showArr = JSON.parse(res || "[]");
          this.unitListData.map((data, index) => {
            showArr.map(show => {
              if (data.unitId == show) {
                this.$set(
                  this[(`unitListData[${index}]`, "isShow", !data.isShow)]
                );
                this.showDatas(1, this.unitListData, 2);
              }
            });
          });
        }
      }
    },
    // 判断权限
    initPermission() {
      const params = {
        pKey: 1487
      };
      getSearchMenu(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          const data = dataIsNullArray(res.data);
          let record = data.filter(item => item.sysFunCode == "0006001");
          //首页
          if (!record.length) {
            return;
          }
          let child = dataIsNullArray(record[0].children);
          if (!child.length) {
            return;
          }
          let curRecord = child.filter(item => item.sysFunCode == "0006001006");
          //消防安全管理
          if (!curRecord.length) {
            return;
          }
          let curChild = dataIsNullArray(curRecord[0].children);
          if (!curChild.length) {
            return;
          }
          let unitManage = curChild.filter(
            item => item.sysFunCode == "0006001006001"
          )[0];
          let adminManage = curChild.filter(
            item => item.sysFunCode == "0006001006002"
          )[0];

          if (adminManage.isPermission == 1) {
            // wx.setStorageSync("identity","adminManager");
            localStorage.setItem("identity", "adminManager");
            //管理员消防管理(消防队管理)
            this.showImportant = true;
            this.showUnit = false;
            this.currentTab = 0;
            (this.tabBars = [
              {
                tab: "重点关注",
                shu: true
              },
              {
                tab: "单位列表",
                shu: false
              }
            ]),
              (this.userLevel = 2);

            this.getImportant();
          } else if (unitManage.isPermission == 1) {
            localStorage.setItem("identity", "unitManager");
            //单位消防管理
            this.showImportant = false;
            this.showUnit = true;
            this.currentTab = 0;
            (this.tabBars = [
              {
                tab: "单位列表",
                shu: false
              }
            ]),
              (this.userLevel = 1);
            this.getUnitList();
          }
        }
      });
    },
    // 加载下拉框
    loadSelectList() {
      this.sonsultingType = [
        {
          key: 0,
          title: "综合排序",
          param: {}
        },
        {
          key: 1,
          title: "告警信息",
          param: {
            alarmNum: 1
          }
        },
        {
          key: 2,
          title: "隐患数量",
          param: {
            hiddenNum: 1
          }
        },
        {
          key: 3,
          title: "风险等级",
          param: {
            riskGrade: 1
          }
        }
      ];
    },
    // 获取重点单位数据
    getImportant: function(name = "") {
      this.noMore = false;
      this.imptotal = 0;
      this.impPageNo = 1;
      this.importantData = [];
      this.impShowData = [];
      this.loadImportant(name);
    },
    // 获取单位列表数据
    getUnitList: function(name = "") {
      this.noMore = false;
      this.unitPageNo = 1;
      this.unitTotal = 0;
      this.unitListData = [];
      this.unitShowData = [];
      this.loadUnit(name);
    },
    loadImportant(name) {
      const params = JSON.parse(JSON.stringify(this.tableParams));
      params.key = this.userId;
      params.pageNo = this.impPageNo;
      params.pageSize = this.PageSize;
      params.isFocus = 1;
      name ? (params.unitName = name) : (params.unitName = "");
      for (let i in params) {
        if (!params[i]) {
          delete params[i];
        }
      }
      this.loading = true;
      getUnitListByFire(params).then(impData => {
        if (impData.code != 0) {
          return;
        }
        const data = dataIsNullArray(impData.data);
        data.map(record => {
          this.importantData.push({
            unitName: dataIsNullStr(record.unitName, "未知"),
            unitId: record.key,
            isShow: true,
            riskName: record.name,
            video: record.videoNum,
            alarm: record.alarmNum,
            hidden: record.hiddenNum,
            alarmGrade: record.color
          });
        });
        this.imptotal = impData.pageData.sumNum;
        this.showDatas(1, this.importantData);
        this.loading = false;
        this.$toast.clear();
        this.noMore = this.importantData.length >= this.imptotal;
      });
    },
    loadUnit(name) {
      let that = this;
      const params = JSON.parse(JSON.stringify(that.tableParams));
      params.key = that.userId;
      params.pageNo = that.unitPageNo;
      params.pageSize = that.PageSize;
      name ? (params.unitName = name) : (params.unitName = "");
      for (let i in params) {
        if (!params[i]) {
          delete params[i];
        }
      }
      this.loading = true;
      let unitManage = () => {
        return new Promise(resolve => {
          getFireUnitLists(params).then(res => {
            resolve(res);
          });
        });
      };
      let adminManage = () => {
        return new Promise(resolve => {
          getUnitListByFire(params).then(res => {
            resolve(res);
          });
        });
      };
      Promise.all([this.userLevel == 1 ? unitManage() : adminManage()]).then(
        res => {
          if (res[0].code != 0) {
            return;
          }
          const data = dataIsNullArray(res[0].data);
          data.map(record => {
            this.unitListData.push({
              unitName: dataIsNullStr(record.unitName, "未知"),
              unitId: record.key,
              isShow: record.isFocus == 1 ? true : false,
              riskName: record.name,
              video: record.videoNum,
              alarm: record.alarmNum,
              hidden: record.hiddenNum,
              alarmGrade: record.color
            });
          });
          this.unitTotal = res[0].pageData.sumNum;
          this.showDatas(1, this.unitListData, 2);
          this.loading = false;
          this.$toast.clear();
          this.noMore = this.unitListData.length >= this.unitTotal;
        }
      );
    },
    // 分页展示数据(页码，总数据)
    showDatas: function(pageNo = 1, allDatas, imp = 1) {
      const data = [];
      allDatas.map(res => {
        data.push(res);
      });
      let i = 0;
      const iStart = (pageNo - 1) * this.PageSize;
      const iEnd = pageNo * this.PageSize - 1;
      for (i = iStart; i <= iEnd; i++) {
        if (data[i]) {
          if (imp == 1) {
            this.impShowData.push(data[i]);
          } else {
            this.unitShowData.push(data[i]);
          }
        }
      }
    },
    // 加载更多
    scroll: function() {
      if (this.userLevel !== 1) {
        // 消防队或管理员
        if (this.currentTab === 0) {
          // 重点关注
          if (this.imptotal > this.importantData.length) {
            this.impPageNo++;
            this.loadImportant();
            return;
          }
        } else {
          // 单位列表
          if (this.unitTotal > this.unitListData.length) {
            this.unitPageNo++;
            this.loadUnit();
            return;
          }
        }
      } else {
        // 社会单位
        if (this.unitTotal > this.unitListData.length) {
          this.unitPageNo++;
          this.loadUnit();
          return;
        }
      }
    },
    // 资讯类别下拉选项
    searchImp(e) {
      let index = e.select;
      let text = e.text;
      this.tableParams = this.sonsultingType[parseInt(index)].param;
      if (text) {
        this.$set(this.tableParams, "unitName", text);
      } else {
        this.$set(this.tableParams, "unitName", "");
      }
      this.$toast.loading({
        message: "正在搜索...",
        forbidClick: true,
        duration: 0
      });
      if (this.tabBars.length > 1) {
        if (this.currentTab === 0) {
          this.getImportant(text);
        } else {
          this.getUnitList(text);
        }
      } else {
        this.getUnitList(text);
      }
    },
    // 重点关注关注操作
    ImpIsShow: function({ unitId, isShow }) {
      this.importantData.map((res, index) => {
        if (res.unitId == unitId) {
          this.importantData.splice(index, 1);
        }
      });
      let params = {
        userId: this.userId,
        unitId
      };

      const param = JSON.parse(JSON.stringify(params));
      deleteFocusUnitByFire(param).then(res => {
        if (res.code == 0) {
          const targetIndex = this.impShowData.findIndex(item => {
            return item.unitId === unitId;
          });
          this.$set(this.impShowData[targetIndex], "isShow", isShow);
          this.impShowData = [];
          this.imptotal = this.importantData.length;
          this.showArr.push(unitId);
          localStorage.setItem("isshow", JSON.stringify(this.showArr));
          this.getImportant();
          this.showDatas(1, this.importantData);
        } else {
          this.$toast.fail("操作失败，请重试！！");
        }
      });
    },
    // 单位列表关注操作
    UnitIsShow: function({ unitId, isShow }) {
      let params = {
        userId: this.userId,
        unitId
      };
      const param = JSON.parse(JSON.stringify(params));
      insertFocusUnitByFire(param).then(res => {
        if (res.code == 0) {
          const targetIndex = this.unitListData.findIndex(item => {
            return item.unitId === unitId;
          });
          this.$set(this.unitListData[targetIndex], "isShow", isShow);
          this.unitShowData.map((data, index) => {
            if (data.unitId == unitId) {
              let chenge = `unitShowData[${index}].isShow`;
              this[chenge] = !data.isShow;
            }
          });

          this.$toast.success("操作成功");
          this.getUnitList();
        } else {
          this.$toast.fail("操作失败，请重试");
        }
      });
    },
    onRefresh() {
      this.noMore = false;
      if (this.currentTab == 0 && this.userLevel > 1) {
        this.impPageNo = 1;
        this.getImportant();
      } else {
        this.unitPageNo = 1;
        this.getUnitList();
      }
      this.refreshing = false;
    }
  },
  created() {
    // this.icon = this.$route.query.icon
    this.loadSelectList();
    localStorage.removeItem("isshow");

    this.userId = this.user.userId;
    this.showArr = [];
    (this.currentTab = 0),
      (this.unitPageNo = 1),
      (this.unitTotal = 0),
      (this.imptotal = 0),
      (this.impPageN = 1);

    this.initPermission();
  },
  mounted() {
    this.$root.backBtnFn = this.$root.goBack;
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // 添加监听home键回退
    addBackButton(this.$root.backBtnFn);
    //计算顶部导航高度,以自动计算出内容高度contentHeight
    this.$root.navH =
      document.querySelector(".van-nav-bar").offsetHeight +
      (this.userLevel > 1 ? 45 : 0);
  },
  computed: {
    ...mapGetters(["user"])
  },
  watch: {
    userLevel(to) {
      const navDom = document.querySelector(".van-nav-bar");
      if (!navDom) return;
      this.$root.navH = navDom.offsetHeight + (to > 1 ? 45 : 0);
    }
  }
};
</script>

<style scoped lang="scss">
.detachment-box {
  overflow: hidden;
  background-color: #efeff4;
  .van-nav-bar {
    background: #0e41a6;
  }
  /deep/.van-tabs__nav {
    border-radius: 3px 3px 0 0;
    border-bottom: 1px solid #d9d9d9;
    .van-tabs__line {
      width: 56px;
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
}
.detachment {
  height: calc(100%);
}

.detachment-content {
  padding: 10px;
}

.message {
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 12px;
}

.important-unit {
  overflow: hidden;
}

.important-content {
  height: calc(100% - 45px);
  overflow-y: auto;
  overflow-x: hidden;
}

.total-box {
  height: 30px;
  font-size: 12px;
}

.total-before {
  width: 30px;
  margin-right: 5px;
  height: 1px;
  background-color: #ccc;
}

.total-after {
  width: 30px;
  margin-left: 5px;
  height: 1px;
  background-color: #ccc;
}
</style>
