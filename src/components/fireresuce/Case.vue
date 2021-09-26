<template>
  <div class="w100 h100 case">
    <panel-part height="100%">
      <template slot="content">
        <div class="w100 h100 content">
          <!-- 头部 -->
          <div class="search">
            <div class="select">
              <van-field
                readonly
                clickable
                v-model="caseTypeName"
                placeholder="所有案例"
                @click="showPicker = true"
              />
              <van-icon
                name="play"
                class="select-icon"
                color="#00ccd1"
                size="0.6rem"
              />
              <van-popup v-model="showPicker" position="bottom">
                <van-picker
                  show-toolbar
                  :columns="columns"
                  @cancel="showPicker = false"
                  @confirm="onConfirm"
                />
              </van-popup>
            </div>

            <van-field
              class="input"
              v-model="caseName"
              placeholder="请输入案例名称"
            />
            <van-icon
              class="input-icon"
              name="search"
              color="#00ccd1"
              size="0.9rem"
              @click="searchHandle"
            />
          </div>
          <!-- 中间 -->
          <div class="w100 list-container">
            <div
              v-for="(item, index) in listData"
              :key="index"
              :class="['list-item', activeIndex == index ? 'active' : '']"
              @click="checkActive(item, index)"
            >
              {{ item.caseName }}
            </div>
          </div>
          <!-- 分页 -->
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
      </template>
    </panel-part>
    <div :class="['w100', 'h100', 'detailCase', showSlide ? 'slide-in' : '']">
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
import Detail from "@/components/case/Detail.vue";
import { getTypicalCase, getCaseType } from "@/utils/api";
import {
  dataIsNullNumber,
  dataIsNullArray,
  dataIsNullObj,
  clearArray
} from "@/utils/tool";
export default {
  name: "case",
  data() {
    return {
      //输入框
      caseName: "",
      //下拉框选中的value
      caseTypeName: "",
      //下拉框选中的key
      caseType: "",
      activeIndex: 0,
      //分页
      pageNo: 1,
      total: 0,
      showPicker: false,
      showSlide: false,
      //数据
      listData: [],
      //当前key
      recordKey: "",
      //案例类型下拉框
      columns: []
    };
  },
  components: {
    "panel-part": PanelPart,
    "detail-single": Detail
  },
  methods: {
    //获取案例类型下拉框
    getCaseOptions: function() {
      getCaseType().then(res => {
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          clearArray(this.columns);
          const data = dataIsNullArray(res.data);
          this.columns.push({
            text: "所有案例",
            keyId: ""
          });
          data.map(item => {
            this.columns.push({
              text: item.title,
              keyId: item.key
            });
          });
        }
      });
    },
    //获取典型案例数据
    getCaseData: function() {
      const params = {
        pageNo: this.pageNo,
        pageSize: 8
      };
      if (this.caseName) {
        params.caseName = this.caseName;
      }
      if (this.caseType) {
        params.caseType = this.caseType;
      }

      this.loading = true;
      getTypicalCase(params).then(res => {
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
    //查看详情
    checkActive(item, index) {
      this.activeIndex = index;
      this.recordKey = item.key;
      this.showSlide = true;
    },
    //查询条件
    searchHandle: function() {
      this.pageNo = 1;
      this.getCaseData();
    },
    //切换分页
    changePagination(item) {
      this.pageNo = item;
      this.getTypicalCase();
    },
    //选择案例类型
    onConfirm(value) {
      this.caseTypeName = value.text;
      this.caseType = value.keyId;
      this.showPicker = false;
      this.getCaseData();
    },
    //案例详情返回
    cancelHandle() {
      this.showSlide = false;
    }
  },
  mounted() {
    this.getCaseOptions();
    this.getCaseData();
  }
};
</script>
<style lang="scss">
@import "@/assets/css/common.scss";
.case {
  position: relative;
  .content {
    padding: px2rem(44px) px2rem(224px);
    @include flex;
    @include flex-column;
    @include flex-primary-axis-between;
    .search {
      // width: px2rem(550px);
      margin: 0 auto;
      @include flex;
      @include flex-primary-axis-center;
      position: relative;
      .select {
        position: relative;
        width: px2rem(350px);
        .van-field__control {
          @include text-ellipsis;
          padding: 0 px2rem(27px) 0 px2rem(20px);
        }
      }
      .select-icon {
        position: absolute;
        // left: px2rem(140px);
        right: px2rem(10px);
        top: px2rem(15px);
        transform: rotate(90deg);
      }
      .input {
        width: px2rem(500px);
      }
      .input-icon {
        width: px2rem(45px);
        height: px2rem(45px);
        position: absolute;
        top: 50%;
        right: px2rem(20px);
        transform: translateY(-50%);
      }
      .van-field__control {
        // width: px2rem(400px);
        height: px2rem(67px);
        border-radius: px2rem(5px);
        font-size: px2rem(30px);
        background: #1c273d;
        border: px2rem(2px) solid #00ccd1;
        padding: 0 px2rem(60px) 0 px2rem(20px);
      }
    }
    .list-container {
      // margin: px2rem(105px) auto px2rem(150px);
      @include flex;
      @include flex-primary-axis-between;
      @include flex-secondary-axis-multiple-between;
      flex-wrap: wrap;
      position: relative;
      height: px2rem(760px);
      .list-item {
        width: px2rem(450px);
        height: px2rem(258px);
        // width: 24%;
        // height: 48%;
        margin-bottom: px2rem(28px);
        background: url("../../assets/img/fireresuce/caseBlock.png") 0 0
          no-repeat;
        background-size: 100%;
        color: #00faff;
        font-size: px2rem(32px);
        padding: 0 px2rem(80px);
        line-height: px2rem(60px);
        text-align: center;
        @include flex;
        @include flex-primary-axis-center;
        @include flex-secondary-axis-center;
        text-shadow: 0px 4px 10px 0px rgba(0, 26, 46, 0.48);
        transition: all 0.1s linear;
        &:nth-child(1),
        &:nth-child(5) {
          margin-left: px2rem(0px);
        }
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
  .detailCase {
    background: #1c273c;
    position: relative;
    @include slideX;
  }
}
</style>
