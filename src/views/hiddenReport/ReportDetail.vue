<template>
  <div class="rd container h100">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      :border="false"
      title="隐患详情"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div
      class="hidden-content"
      :style="{ 'min-height': hiddenContentH, height: hiddenContentH }"
    >
      <div>
        <Detail hasMap hasImage hasRadio :detailList="detailList">
          <template #hiddenMap>
            <div class="w100 map-container" id="detail-map"></div>
          </template>
          <template #image>
            <!-- <div class="sescribe-content"></div> -->
            <div class="register-photo">
              <van-uploader v-model="registerList" v-if="registerList.length" />
            </div>
          </template>
          <template #radio>
            <div class="radio-container">
              <div class="radio-content flex-align-center flex-justify-center">
                <van-radio-group
                  class="w100 flex-align-center-around radio-group"
                  v-model="state"
                >
                  <van-radio
                    :disabled="item.disabled"
                    class="radio"
                    :name="item.name"
                    icon-size="14px"
                    v-for="item in items"
                    :key="item.name"
                    >{{ item.value }}</van-radio
                  >
                </van-radio-group>
              </div>
            </div>
          </template>
        </Detail>
      </div>
    </div>
    <div class="w100 button-content">
      <van-button
        v-if="submitEnabled"
        square
        custom-style="background-color: #ff0000;"
        custom-class="w100 custom-btn"
        @click="formSubmit"
        >立即提交</van-button
      >
    </div>
  </div>
</template>

<script>
import {
  removeBackButton,
  addBackButton,
  dataIsNullStr,
  dataIsNullArray,
  dataIsNullNumber,
  dataIsNullObj
} from "utils/tool";
import {
  initMap,
  initDrawLayer,
  initMarkLayer,
  initBaseLayer,
  addMaker
  // clearMarker
} from "utils/tool-supermap";
import {
  getHiddenDangertListsDetail,
  getImage,
  updateHiddenState
} from "utils/api";
import Detail from "components/pub/Detail";
export default {
  components: {
    Detail
  },
  data() {
    return {
      key: null,
      detailList: {},
      mapData: {},
      markers: [
        {
          iconPath: require("../../assets/img/other/point.png"),
          id: 1,
          latitude: "",
          longitude: ""
        }
      ],
      map: null,
      aptitudeImg: "",
      registerList: [],
      // 单选框
      state: "",
      //默认状态,已督办后不可以再督办
      initState: "",
      items: [
        {
          name: "0031001002",
          value: "已督办",
          disabled: false
        },
        {
          name: "0031001003",
          value: "关闭隐患",
          disabled: false
        }
      ],
      submitEnabled: true
    };
  },
  methods: {
    loadData(key) {
      let params = {
        key
      };
      let obj = {
        list: []
      };
      let imgList = [];
      let list = [];
      let mapData = {};
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      getHiddenDangertListsDetail(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          const data = dataIsNullObj(res.data);
          // console.log(data)
          let location = JSON.parse(data.location);
          obj.list.push({
            title: "举报时间",
            info: dataIsNullStr(data.dataGenerationDate, "未知")
          });
          obj.list.push({
            title: "隐患类型",
            info: dataIsNullStr(data.typeName, "未知")
          });
          obj.list.push({
            title: "隐患地址",
            info: dataIsNullStr(data.address, "未知")
          });
          obj.infoText = dataIsNullStr(data.describe, "无内容");
          if (location) {
            let wgsCoord = {
              longitude: location.lng,
              latitude: location.lat
            };
            mapData.longitude = wgsCoord.longitude;
            mapData.latitude = wgsCoord.latitude;
          }
          list = dataIsNullArray(data.appletHiddenImgList);
          list.map(item => {
            if (!item.imgUrl) {
              imgList = [];
            } else {
              imgList.push({
                url: getImage(dataIsNullStr(item.imgUrl))
              });
            }
          });
          this.detailList = obj;
          this.mapData = mapData;
          this.loading = true;
          this.state = this.initState = data.state;
          this.submitEnabled = data.state != "0031001003" ? true : false;
          this.longitude = mapData.longitude;
          this.latitude = mapData.latitude;
          this.registerList = imgList;
          this.$set(
            this.items[0],
            "diesbled",
            data.state != "0031001003" ? false : true
          );
          this.$set(this.markers[0], "latitude", mapData.latitude);
          this.$set(this.markers[0], "longitude", mapData.longitude);

          this.initMap();

          this.$toast.clear();
        }
      });
    },
    formSubmit() {
      if (!this.state) {
        this.$toast.fail("请选择处置状态！");
        return;
      }
      if (this.state == "0031001002" && this.initState == "0031001002") {
        this.$toast.fail("该隐患不可以重复督办");
        return;
      }
      const params = {
        hiddenDangerId: this.key,
        state: this.state
      };
      updateHiddenState(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          this.$toast.success("添加成功！");
          this.$router.go(-1);
        } else {
          this.$toast.fail(res.message);
        }
      });
    },
    initMap() {
      this.map = initMap("detail-map");
      this.drawLayer = initDrawLayer();
      this.markLayer = initMarkLayer();
      this.baseLayer = initBaseLayer(
        this.map,
        [this.drawLayer, this.markLayer],
        () => {
          this.markLayer && this.markLayer.clearMarkers();
          const markData = this.markers.map(m => {
            return { icon: m.iconPath, coord: `${m.longitude},${m.latitude}` };
          });

          addMaker(markData, this.markLayer);
        },
        [this.markers[0].longitude, this.markers[0].latitude]
      );
    }
  },
  computed: {
    hiddenContentH() {
      return `${this.$root.contentHeight - 100 * this.$root.ratePX}px`;
    }
  },
  created() {
    this.key = this.$route.params.key;
  },
  mounted() {
    this.$root.backBtnFn = this.$root.goBack;
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // 添加监听home键回退
    addBackButton(this.$root.backBtnFn);
    //计算顶部导航高度,以自动计算出内容高度contentHeight
    this.$root.navH = document.querySelector(".van-nav-bar").offsetHeight;

    this.loadData(this.key);
  }
};
</script>

<style lang="scss" scoped>
.rd {
  /deep/ .van-uploader__upload,
  /deep/ .van-uploader__preview,
  /deep/ .van-uploader__preview-image {
    // margin-right: 0;
    width: 52px !important;
    height: 52px !important;
  }
  /deep/ .van-uploader__upload,
  /deep/ .van-uploader__preview-delete {
    display: none;
  }
  /deep/ .van-field__control:disabled {
    -webkit-text-fill-color: #666;
  }
  /deep/ .van-button--normal {
    width: 100%;
    height: 49px;
    background: #ff0000;
    font-size: 18px;
    color: #fff;
  }
  .van-nav-bar {
    background: #0e41a6;
  }

  .map-container {
    margin-top: 10px;
    height: 168px;
  }
  .sescribe-content {
    position: absolute;
    bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
  }
  .uploader-contianer .van-uploader {
    width: 100%;
    height: 100%;
  }
  .register-photo {
    color: #666;
  }
  /* 单选radio */
  .radio-container {
    margin: 10px 0;
  }
  .radio-content {
    line-height: 48px;
    height: 48px;
    background-color: #fff;
  }
  .radio-group {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    background: #fff;
    font-size: 12px;
  }
  /* 按钮 */
  .button-content {
    position: fixed;
    bottom: 0;
    left: 0;
  }
}
</style>
