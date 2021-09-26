<template>
  <div class="w100 h100 linkPower">
    <panel-part-oper
      height="100%"
      leftTitle="联动力量"
      :rightTitle="rightTitle"
      :rightLoading="loading"
    >
      <template slot="left-content">
        <div class="w100 h100 left-content">
          <div
            :class="['w100', activeIndex == index ? 'active' : '']"
            v-for="(item, index) in linkPowerMenu"
            :key="index"
            @click="checkIndex(item, index)"
          >
            {{ item }}
          </div>
        </div>
      </template>
      <template slot="right-content">
        <div class="w100 h100 right-content">
          <div class="w100 h100 list-container">
            <ul class="w100 listTable">
              <li class="w100 list-head">
                <div v-for="(item, index) in listTitle" :key="index">
                  {{ item }}
                </div>
              </li>
              <li class="w100" v-for="(item, index) in listData" :key="index">
                <div class="w100 tablecontent" v-if="activeIndex">
                  <div :title="item.name">{{ item.name }}</div>
                  <div :title="item.professionalField">
                    {{ item.professionalField }}
                  </div>
                  <div :title="item.unitName">{{ item.unitName }}</div>
                  <div :title="item.phone">{{ item.phone }}</div>
                </div>
                <div class="w100 tablecontent" v-else>
                  <div :title="item.unitName">{{ item.unitName }}</div>
                  <div :title="item.typeName">{{ item.typeName }}</div>
                  <div :title="item.personName">{{ item.personName }}</div>
                  <div :title="item.phone">{{ item.phone }}</div>
                </div>
              </li>
            </ul>
            <div class="pagination">
              <van-pagination
                v-model="pageNo"
                :total-items="total"
                :items-per-page="8"
                force-ellipses
                @change="changePagination"
              />
            </div>
          </div>
        </div>
      </template>
    </panel-part-oper>
  </div>
</template>
<script>
import panelPartOper from "@/components/pub/PanelPartOper.vue";
import { getFireExpert, getFireLinkAge } from "@/utils/api";
import { dataIsNullNumber, dataIsNullArray, dataIsNullObj } from "@/utils/tool";
export default {
  data() {
    return {
      //左侧菜单
      linkPowerMenu: ["应急联动单位", "专家库"],
      //左侧菜单高亮
      activeIndex: 0,
      //分页
      pageNo: 1,
      total: 0,
      loading: false,
      //数据
      listData: []
    };
  },
  components: {
    "panel-part-oper": panelPartOper
  },
  computed: {
    //头部标题
    rightTitle() {
      return !this.activeIndex ? "应急联动单位" : "专家库";
    },
    //表格头l
    listTitle() {
      return !this.activeIndex
        ? ["单位名称", "类型", "联系人", "联系电话"]
        : ["姓名", "专业领域", "单位", "联系电话"];
    }
  },
  methods: {
    //获取消防专家数据
    getExpertData: function() {
      this.loading = true;
      const params = {
        pageNo: this.pageNo,
        pageSize: 12
      };
      getFireExpert(params).then(res => {
        this.loading = false;
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullArray(res.data);
          if (!data.length) {
            this.isEmpty = true;
          }
          this.listData = JSON.parse(JSON.stringify(data));
          const pageData = dataIsNullObj(res.pageData);
          this.total = dataIsNullNumber(pageData.sumNum);
        }
      });
    },
    //获取联动力量数据
    getLinkAgeData: function() {
      this.loading = true;
      const params = {
        pageNo: this.pageNo,
        pageSize: 12
      };
      getFireLinkAge(params).then(res => {
        this.loading = false;
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullArray(res.data);
          if (!data.length) {
            this.isEmpty = true;
          }
          this.listData = JSON.parse(JSON.stringify(data));
          const pageData = dataIsNullObj(res.pageData);
          this.total = dataIsNullNumber(pageData.sumNum);
        }
      });
    },
    //切换菜单
    checkIndex(item, index) {
      this.activeIndex = index;
      if (!index) {
        this.getLinkAgeData();
      } else {
        this.getExpertData();
      }
    },
    //切换分页
    changePagination(item) {
      // eslint-disable-next-line no-console
      this.pageNo = item;
      if (!this.activeIndex) {
        this.getLinkAgeData();
      } else {
        this.getExpertData();
      }
    }
  },
  mounted() {
    this.getLinkAgeData();
  }
};
</script>
<style lang="scss">
@import "@/assets/css/common.scss";
.linkPower {
  .left-content {
    padding: 0 px2rem(30px);
    overflow: auto;
    div {
      margin-top: px2rem(25px);
      height: px2rem(145px);
      background: url("../../assets/img/fireresuce/defaultVehicle-bg.png") 0 0
        no-repeat;
      background-size: 100%;
      font-size: px2rem(29px);
      color: #06c3dd;
      text-align: center;
      line-height: px2rem(135px);
      transition: all 0.1s linear;
      &.active {
        background: url("../../assets/img/fireresuce/activeVehicle-bg.png") 0 0
          no-repeat;
        background-size: 100%;
      }
    }
  }
  .right-content {
    padding: px2rem(50px);
    .list-container {
      background-color: #131723;
      border: solid px2rem(1px) #005a8a;
      padding: 0 px2rem(43px);
      .listTable {
        @include flex;
        @include flex-column;
        li {
          @include flex;
          @include flex-secondary-axis-center;
          border-bottom: px2rem(1px) solid #005a8a;
          height: px2rem(80px);
          &.list-head {
            div {
              color: #ffe9c8;
              flex: 1;

              font-size: px2rem(25px);
            }
          }
          .tablecontent {
            @include flex;
            @include flex-secondary-axis-center;
            border-bottom: px2rem(1px) solid #005a8a;
            height: px2rem(80px);
            div {
              flex: 1;
              padding-right: px2rem(10px);
              color: #00c3de;
              font-size: px2rem(25px);
              @include text-ellipsis;
            }
          }
        }
      }
      .pagination {
        padding-top: px2rem(50px);
        @include flex;
        @include flex-primary-axis-center;
      }
    }
  }
}
</style>
