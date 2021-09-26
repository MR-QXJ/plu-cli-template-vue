<template>
  <div class="w100 h100 resource">
    <panel-part-oper
      height="100%"
      leftTitle="建筑信息"
      :leftLoading="leftLoading"
      :rightLoading="rightLoading"
    >
      <template slot="left-content">
        <div class="w100 h100 left-content">
          <div class="select">
            <van-field
              readonly
              clickable
              v-model="buildName"
              placeholder="请选择建筑"
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
          <img :src="`${GETIMG}${imgUrl}`" alt="图片" class="w100" />
          <ul class="w100 info">
            <li v-for="(item, index) in objData" :key="index" class="w100">
              <label>{{ item.label }}：</label>
              <div class="right-info">
                <span>{{ item.value }}</span>
              </div>
            </li>
          </ul>
        </div>
      </template>
      <template slot="right-content">
        <div class="w100 h100 right-content">
          <div class="object-menu">
            <div
              v-for="(item, index) in objectMenu"
              :key="index"
              @click="checkObjectMenu(index)"
              :class="[activeIndex == index ? 'active' : '']"
            >
              {{ item }}
            </div>
          </div>
          <div class="object-detail">
            <fire-facility
              v-if="!activeIndex"
              :buildId="buildId"
              ref="firefacility"
            ></fire-facility>
            <inside-video
              v-else-if="activeIndex == 1"
              :buildId="buildId"
              ref="insidevideo"
            ></inside-video>
            <floor-plan v-else ref="floorplan" :buildId="buildId"> </floor-plan>
          </div>
        </div>
      </template>
    </panel-part-oper>
  </div>
</template>
<script>
import panelPartOper from "@/components/pub/PanelPartOper.vue";
import FireFacility from "@/components/objectinfo/FireFacility.vue";
import InsideVideo from "@/components/objectinfo/InsideVideo.vue";
import FloorPlan from "@/components/objectinfo/FloorPlan.vue";
import {
  getBuildSelect,
  getBuildInfo,
  getBuildFirePerson,
  GETIMG
} from "@/utils/api";
import {
  dataIsNullNumber,
  dataIsNullArray,
  transformCodeSelect,
  dataIsNullObj,
  clearArray,
  showToast
} from "@/utils/tool";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      GETIMG,
      imgUrl: "",
      //建筑名称
      buildName: "",
      //建筑id
      buildId: "",
      //左侧loading
      leftLoading: false,
      //右侧loading
      rightLoading: false,
      objData: [
        {
          label: "建筑高度",
          value: ""
        },
        {
          label: "地上层数",
          value: ""
        },
        {
          label: "地下层数",
          value: ""
        },
        {
          label: "耐火等级",
          value: ""
        },
        {
          label: "控制室电话",
          value: ""
        },
        {
          label: "消防安全管理人",
          value: ""
        },
        {
          label: "消防安全管理人",
          value: ""
        }
      ],
      columns: [],
      showPicker: false,
      objectMenu: ["消防设施", "内部视频", "平面图纸"],
      activeIndex: 0
    };
  },
  components: {
    "panel-part-oper": panelPartOper,
    "fire-facility": FireFacility,
    "inside-video": InsideVideo,
    "floor-plan": FloorPlan
  },
  computed: {
    ...mapGetters(["fireAlarmInfo"])
  },
  methods: {
    //获取通过警情给的单位id查询建筑下拉框
    getBuildSelect: function() {
      if (this.fireAlarmInfo && typeof this.fireAlarmInfo == "object") {
        if (!this.fireAlarmInfo.unitId) {
          return;
        }
        getBuildSelect({
          unitId: this.fireAlarmInfo.unitId
        }).then(res => {
          const code = dataIsNullNumber(res.code);
          if (code == 0) {
            // eslint-disable-next-line no-unused-vars
            const data = dataIsNullArray(res.data);
            if (!data.length) {
              showToast("当前警情无建筑信息");
              return;
            }
            const codes = transformCodeSelect(data, ["key", "title"]);
            this.columns = JSON.parse(JSON.stringify(codes));
          }
        });
      }
    },
    //获取建筑信息
    getBuildInfoHandle: function() {
      clearArray(this.objData);
      getBuildInfo({
        key: this.buildId
      })
        .then(res => {
          const code = dataIsNullNumber(res.code);
          if (code == 0) {
            const data = dataIsNullObj(res.data[0]);
            this.objData.push(
              {
                label: "建筑高度",
                value: data.height + "米"
              },
              {
                label: "耐火等级",
                value: data.fireGrade
              },
              {
                label: "地上楼层",
                value: data.overgroundFloor + "层"
              },
              {
                label: "地下楼层",
                value: data.undergroundFloor + "层"
              }
            );
            this.imgUrl = data.imgUrl;
          }
        })
        .then(() => {
          const hosemanParams = {
            unitId: this.fireAlarmInfo.unitId
          };
          getBuildFirePerson(hosemanParams).then(res => {
            const code = dataIsNullNumber(res.code);
            if (code == 0) {
              const data = dataIsNullObj(res.data);
              this.objData.push(
                {
                  label: "消防安全管理员",
                  value: data.custodianPerson
                },
                {
                  label: "消防安全责任人",
                  value: data.dutyPerson
                }
              );
            }
          });
        });
    },
    onConfirm(data) {
      this.buildName = data.text;
      this.buildId = data.key;
      this.getBuildInfoHandle();

      this.showPicker = false;

      this.$nextTick(() => {
        if (!this.activeIndex) {
          this.$refs["firefacility"].getFacilityHandle();
        } else if (this.activeIndex == 1) {
          this.$refs["insidevideo"].getBuildVideoDeviceHandle();
        } else {
          this.$refs["floorplan"].getFloorInfo();
        }
      });
    },
    checkObjectMenu(index) {
      this.activeIndex = index;
      this.$nextTick(() => {
        if (!index) {
          this.$refs["firefacility"].getFacilityHandle();
        } else if (index == 1) {
          this.$refs["insidevideo"].getBuildVideoDeviceHandle();
        } else {
          this.$refs["floorplan"].getFloorInfo();
        }
      });
    }
  },
  mounted() {
    this.getBuildSelect();
  }
};
</script>
<style lang="scss">
@import "@/assets/css/common.scss";
.resource {
  .left-content {
    @include flex;
    @include flex-column;
    @include flex-primary-axis-start;
    @include flex-secondary-axis-center;
    padding: px2rem(18px);
    overflow: auto;
    .select {
      position: relative;
      margin-bottom: px2rem(10px);
    }
    .select-icon {
      position: absolute;
      right: px2rem(20px);
      top: px2rem(15px);
      transform: rotate(90deg);
    }
    .input-icon {
      width: px2rem(45px);
      height: px2rem(45px);
      position: absolute;
      right: 0;
      top: px2rem(60px);
    }
    .van-field__control {
      // width: px2rem(220px);
      height: px2rem(58px);
      border-radius: px2rem(5px);

      font-size: px2rem(23px);
      background: #0e1831;
      border: px2rem(1px) solid #00ccd1;
      padding: 0 px2rem(50px) 0 px2rem(20px);
    }

    img {
      height: px2rem(240px);
      border: px2rem(2px) solid #00faff;
    }
    .info {
      padding-top: px2rem(15px);
      & > li {
        font-size: px2rem(21px);
        color: #00faff;
        @include flex;
        @include flex-secondary-axis-center;
        text-align: left;
        padding-bottom: px2rem(60px);
        label {
          width: px2rem(200px);
        }
      }
    }
  }
  .right-content {
    position: relative;
    .object-menu {
      padding: px2rem(40px) px2rem(55px) 0;
      @include flex;
      div {
        @include flex;
        @include flex-primary-axis-center;
        @include flex-secondary-axis-center;
        width: px2rem(235px);
        height: px2rem(90px);
        background: url("../../assets/img/fireresuce/objectblock-bg.png") 0 0
          no-repeat;
        background-size: 100%;
        font-size: px2rem(32px);
        color: #48608c;
        transition: all 0.1s linear;
        &:not(:first-child) {
          margin-left: px2rem(50px);
        }
        &.active {
          color: #3ffbff;
          font-size: px2rem(38px);
        }
      }
    }
    .object-detail {
      height: calc(100% - 2.45rem);
    }
  }
}
</style>
