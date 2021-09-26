<template>
  <div class="w100 h100 fightplan">
    <panel-part
      height="100%"
      :loading="loading"
      :isEmpty="listData.length ? false : true"
    >
      <template slot="content">
        <div class="w100 h100 content">
          <div class="list-container">
            <div
              v-for="(item, index) in listData"
              :key="index"
              :class="[activeIndex == index ? 'active' : '']"
              @click="checkIndex(item, index)"
            >
              {{ item.planName }}
            </div>
          </div>
          <div class="pagination">
            <van-pagination
              v-model="pageNo"
              :total-items="total"
              :items-per-page="12"
              force-ellipses
              @change="changePagination"
            />
          </div>
        </div>
      </template>
    </panel-part>
    <div
      :class="['w100', 'h100', 'detailFightPlan', showSlide ? 'slide-in' : '']"
    >
      <detail-single
        v-if="showSlide"
        @cancel="cancelHandle"
        :recordKey="recordKey"
      />
    </div>
  </div>
</template>
<script>
import PanelPart from "@/components/pub/PanelPart.vue";
import Detail from "@/components/fightplan/Detail.vue";
import { fightPlanList } from "@/utils/api";
import { dataIsNullNumber, dataIsNullArray, dataIsNullObj } from "@/utils/tool";
import { mapGetters } from "vuex";
export default {
  name: "fightplan",
  data() {
    return {
      //loading
      loading: false,
      //数据
      listData: [],
      activeIndex: 0,
      pageNo: 1,
      total: 0,
      showSlide: false,
      //当前key
      recordKey: ""
    };
  },
  components: {
    "panel-part": PanelPart,
    "detail-single": Detail
  },
  computed: {
    ...mapGetters(["fireAlarmInfo"])
  },
  methods: {
    //获取列表
    getFightPlanList: function() {
      if (this.fireAlarmInfo && typeof this.fireAlarmInfo == "object") {
        if (!this.fireAlarmInfo.unitId) {
          return;
        }
        const params = {
          pageNo: this.pageNo,
          pageSize: 12,
          unitId: this.fireAlarmInfo.unitId
        };
        this.loading = true;
        fightPlanList(params).then(res => {
          this.loading = false;
          const code = dataIsNullNumber(res.code);
          if (code == 0) {
            const data = dataIsNullArray(res.data);
            this.listData = JSON.parse(JSON.stringify(data));
            const pageData = dataIsNullObj(res.pageData);
            this.total = dataIsNullNumber(pageData.sumNum);
          }
        });
      }
    },
    //切换高亮
    checkIndex(item, index) {
      this.activeIndex = index;
      this.recordKey = item.key;
      this.showSlide = true;
    },
    //切换分页
    changePagination(item) {
      // eslint-disable-next-line no-console
      this.pageNo = item;
      this.getFightPlanList();
    },
    //预案详情返回
    cancelHandle() {
      this.showSlide = false;
    }
  },
  mounted() {
    this.getFightPlanList();
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/common.scss";
.fightplan {
  position: relative;
  .content {
    padding: px2rem(44px) px2rem(224px);
    @include flex;
    @include flex-column;
    @include flex-primary-axis-between;
    .list-container {
      @include flex;
      @include flex-primary-axis-between;
      @include flex-secondary-axis-center;
      height: px2rem(860px);
      flex-wrap: wrap;
      div {
        font-size: px2rem(33px);
        color: #00faff;
        text-align: center;
        line-height: px2rem(267px);
        // width: px2rem(466px);
        // height: px2rem(267px);
        width: 24%;
        height: 32%;
        background: url("../../assets/img/fireresuce/caseBlock.png") 0 0
          no-repeat;
        background-size: 100%;
        &.active {
          background: url("../../assets/img/fireresuce/caseBlockActive.png") 0 0
            no-repeat;
          background-size: 100%;
        }
      }
    }
    .pagination {
      @include flex;
      @include flex-primary-axis-center;
    }
  }
  .detailFightPlan {
    background: #1c273c;
    position: relative;
    @include slideX;
  }
}
</style>
