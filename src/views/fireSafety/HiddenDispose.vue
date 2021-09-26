<template>
  <div class="hidden-box w100 h100">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      :title="unitName"
      :border="false"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div class="hidden-container">
      <van-pull-refresh v-model="isLoading" @refresh="pullRef">
        <div class="hidden-content">
          <div class="hidden-table">
            <div class="table-item">
              <div
                :class="[userlevel == 1 ? 'long-width' : 'table-title-item']"
              >
                上报时间
              </div>
              <div
                :class="[userlevel == 1 ? 'long-width' : 'table-title-item']"
              >
                隐患内容
              </div>
              <div
                :class="[userlevel == 1 ? 'normal-width' : 'table-title-item']"
              >
                隐患位置
              </div>
              <div
                :class="[userlevel == 1 ? 'normal-width' : 'table-title-item']"
              >
                处置状态
              </div>
              <div
                v-if="userlevel == 1"
                :class="[userlevel == 1 ? 'operation' : 'table-title-item']"
              >
                操作
              </div>
            </div>
            <div>
              <div v-if="tableData.length < 1" class="no-data">暂无数据</div>
              <div
                v-for="(item, index) in tableData"
                :key="index"
                class="table-item"
              >
                <div :class="[userlevel == 1 ? 'long-width' : 'table-tb']">
                  {{ item.reportedDate }}
                </div>
                <div
                  :class="[
                    'text-ellipsis',
                    userlevel == 1 ? 'long-width' : 'table-tb'
                  ]"
                >
                  {{ item.dangerContent }}
                </div>
                <div
                  :class="[
                    'text-ellipsis',
                    userlevel == 1 ? 'normal-width' : 'table-tb'
                  ]"
                >
                  {{ item.address }}
                </div>
                <div
                  :class="[
                    stateList[item.disposeState],
                    userlevel == 1 ? 'normal-width' : 'table-tb'
                  ]"
                >
                  {{ item.disposeStateName }}
                </div>
                <div
                  style="color:#0e43ab"
                  v-if="userlevel == 1"
                  @click="handleDisposeDetail(item.key)"
                  class="dispose-btn"
                >
                  处置
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="message w100" @click="showMore">
          {{ loadMessage }}
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>
<script>
import { getFireUnitNotDispose, getFireHiddenDangerByFire } from "@/utils/api";
import {
  removeBackButton,
  addBackButton,
  dataIsNullStr,
  dataIsNullNumber,
  dataIsNullArray
} from "@/utils/tool";
export default {
  data() {
    return {
      // 单位名称
      unitName: "",
      // 单位ID
      dangerId: null,
      // 角色权限判断
      userlevel: 0,
      index: 0,
      tableData: [],
      params: {
        pageNo: 1,
        pageSize: 10
      },
      total: 0,
      // 处置状态样式
      stateList: {
        "0015002001": "unconfirmed",
        "0015002002": "diposeon",
        "0015002003": "overdue",
        "0015002004": "oversee",
        "0015002005": "complete"
      },
      loadMessage: "",
      isLoading: false
    };
  },
  methods: {
    handleDisposeDetail(key) {
      console.log(key);
      this.dangerId = key;
      this.$router.push({
        path: "/dispose",
        query: {
          id: key,
          name: this.unitName
        }
      });
    },
    pullRef() {
      this.params = {
        pageNo: 1,
        total: 0
      };
      this.initData();
    },
    // 请求数据
    initData() {
      this.tableData = [];
      // util.loading("加载中...");
      const param = JSON.parse(JSON.stringify(this.params));
      param.key = this.unitId;
      let list = [];
      let that = this;
      let unitManage = () => {
        return new Promise(resolve => {
          getFireUnitNotDispose(param).then(res => {
            resolve(res);
          });
        });
      };
      let adminManage = () => {
        return new Promise(resolve => {
          getFireHiddenDangerByFire(param).then(res => {
            resolve(res);
          });
        });
      };
      const user = localStorage.getItem("identity");
      Promise.all([user == "adminManager" ? adminManage() : unitManage()]).then(
        res => {
          const code = dataIsNullNumber(res[0].code);
          if (code === 0) {
            const data = dataIsNullArray(res[0].data);
            data.map(item => {
              list.push({
                reportedDate: dataIsNullStr(item.reportedDate),
                dangerContent: dataIsNullStr(item.dangerContent),
                address: dataIsNullStr(item.address),
                disposeStateName: dataIsNullStr(item.disposeStateName),
                disposeState: dataIsNullStr(item.disposeState),
                key: dataIsNullStr(item.key)
              });
            });
            this.tableData = that.tableData.concat(list);
            this.total = res[0].pageData.sumNum;
            this.isLoading = false;
            if (
              res[0].pageData.sumNum >
              that.params.pageNo * that.params.pageSize
            ) {
              this.loadMessage = "点击加载更多";
            } else {
              this.loadMessage = "没有数据了";
            }
          }
        }
      );
    },
    // 加载更多
    showMore: function() {
      // let pageNo = "params.pageNo";
      let that = this;
      if (that.total <= that.tableData.length) {
        this.loadMessage = "没有更多了";
      } else {
        that.params.pageNo = that.params.pageNo + 1;
        this.initData();
      }
    }
  },
  mounted() {
    this.$root.backBtnFn = this.$root.goBack;
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // 添加监听home键回退
    addBackButton(this.$root.backBtnFn);
    // 初始化表格高度 常量为页面其他部分高度
    const options = this.$route.query;
    this.unitName = options.name;
    this.unitId = options.id;
    this.userlevel = options.userlevel;

    this.params = {
      pageNo: 1,
      total: 0
    };
    this.initData();
  }
};
</script>
<style lang="scss" scoped>
.hidden-box {
  overflow: hidden;
  .van-nav-bar {
    background: #0e41a6;
    /deep/.van-nav-bar__title {
      color: #fff;
    }
    /deep/.van-icon {
      color: #fff;
    }
  }
  background: #efeff4;
}
.hidden-container {
  padding: 10px;
  height: calc(100vh - 46px);
  overflow-y: auto;
}
.hidden-content {
  background: #fff;
  border-radius: 5px;
}
.hidden-table {
  padding: 10px;
}
.table-item {
  /* height: 96px;
  line-height: 96px; */
  font-size: 12px;
  padding: 8.5px 0;
  display: flex;
  align-items: center;
}
.table-item:not(:last-child) {
  border-bottom: 1px solid #ddd;
}
.table-title-item {
  font-weight: bold;
  color: #777;
}

.table-title-item:first-child,
.table-title-item:nth-child(2) {
  width: 30%;
}
.table-title-item:last-child,
.table-title-item:nth-child(3) {
  width: 20%;
}
.table-tb:first-child,
.table-tb:nth-child(2) {
  width: 30%;
}
.table-tb:last-child,
.table-tb:nth-child(3) {
  width: 20%;
}
.long-width {
  width: 25%;
}
.normal-width {
  width: 20%;
}
.operation {
  width: 10%;
}
/* EEF1F5完成   aaabb8未确认   EE3D43超期  252e47督办 90a5ff处置中 */
.dispose-btn {
  color: #6c87d0;
}
/* 确认 */
.complete {
  color: #eef1f5;
}
/* 未确认 */
.unconfirmed {
  color: #aaabb8;
}
/* 超期 */
.overdue {
  color: #ee3d43;
}
/* 督办 */
.oversee {
  color: #252e47;
}
/* 处置中 */
.diposeon {
  color: #90a5ff;
}

/* 暂无数据 */
.no-data {
  font-size: 12px;
  text-align: center;
  padding-top: 110px;
}
.message {
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 12px;
  margin-top: 10px;
  color: #888;
}
</style>
