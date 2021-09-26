<template>
  <div class="hidden-pic w100 h100">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      title="隐患快拍"
      :border="false"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div>
      <div
        class="takepicture-title-content flex-align-center"
        @click="showMapCheck"
      >
        <img class="pic-icon" :src="icon" />
        <span class="leftFlag">当前位置 : </span>
        <span
          v-if="formatted_addresses && !locationing"
          class="m-bbt rightFlag"
        >
          {{ formatted_addresses }}</span
        >
        <span style="display:flex;align-items:center;" v-if="locationing">
          <span style="margin: 0 5px">定位中……</span>
          <van-loading type="spinner" size="15px" />
        </span>
        <span
          v-if="!formatted_addresses && !locationing"
          class="m-bbt rightFlag"
          >{{ locationError }}</span
        >
      </div>
      <div class="takepicture-content">
        <div class="tackpicture-item">
          <div class="border w100 h100">
            <input
              class="row-input w100 h100"
              v-model="address"
              placeholder-style="font-size:12px;color:#3A3A3A;"
              placeholder="请填写有效地址"
            />
          </div>
          <div class="border w100 h100">
            <div
              class="row-input w100 h100"
              v-if="!type"
              @click="showDisposeStatePop"
            >
              请选择隐患类型
            </div>
            <div
              class="row-input w100 h100"
              name="disposeState"
              v-if="type"
              @click="showDisposeStatePop"
            >
              {{ typeName }}
            </div>
            <van-popup
              v-model="showDisposeState"
              position="bottom"
              custom-style="height: 40%;"
              @close="showDisposeState = false"
            >
              <van-picker
                show-toolbar
                @cancel="onDisposeStateCancel"
                @confirm="onDisposeStateConfirm"
                :columns="selectArray"
              />
            </van-popup>
          </div>
          <div class="describe-container w100 h100">
            <div class="dispose-mark">
              <textarea
                class="discpose-textarea"
                v-model="describe"
                placeholder="输入50字以内隐患描述"
                placeholder-style="color:#666;font-size:11px;"
              ></textarea>
              <div class="register-photo">
                <van-uploader
                  name="img"
                  class="uploader-contianer"
                  accept="image"
                  v-model="imgList"
                  :beforeRead="beforeRead"
                  :max-count="3"
                  @delete="deleteAptitude"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div v-html="text"></div> -->
    <div class="w100 picture-btn-content">
      <van-button
        @click="handleSubmit"
        type="danger"
        square
        class="w100 custom-btn"
        >立即提交</van-button
      >
    </div>
    <Slide :slide="addrPopupShow">
      <ChoiceAddress
        ref="choice"
        @hidePopup="addrPopupShow = false"
        @getConfirmAddress="getConfirmAddress"
        @mapInitEnd="getMapObject"
        @getMapMatchService="getMapMatchService"
        @getMapMarkerLayer="getMapMarkerLayer"
        :pointList="pointList"
      />
    </Slide>
    <!-- <div :class="['map-wrap', addrPopupShow ? 'active' : '']">
      <ChoiceAddress
        ref="choice"
        @hidePopup="addrPopupShow = false"
        @getConfirmAddress="getConfirmAddress"
        @mapInitEnd="getMapObject"
        @getMapMatchService="getMapMatchService"
        @getMapMarkerLayer="getMapMarkerLayer"
        :pointList="pointList"
      />
    </div> -->
    <!-- <van-popup
      v-model="addrPopupShow"
      position="right"
      :style="{ width: '100%', height: '100%' }"
    >
      <ChoiceAddress
        @hidePopup="addrPopupShow = false"
        @mapInitEnd="getMapObject"
      />
    </van-popup> -->
  </div>
</template>
<script>
import ChoiceAddress from "./ChoiceAddress.vue";
import Slide from "@/components/pub/SlidePage.vue";
import {
  removeBackButton,
  addBackButton,
  dataIsNullNumber,
  dataIsNullArray,
  showToast,
  // showAlert,
  isNativePermission,
  getGeoLocation
  // getGeoLocationBySys
} from "@/utils/tool";
import {
  getSelectList,
  uploadImage,
  insertPictureData,
  getImage
} from "@/utils/api";
export default {
  components: {
    ChoiceAddress,
    Slide
  },
  data() {
    return {
      icon: require("../../assets/img/other/location.png"),
      // 图片
      appletHiddenImgList: [],
      imgList: [],
      // 删除图标
      deleteIcon: require("../../assets/img/other/delete.png"),
      //相机图标
      camerIcon: require("../../assets/img/other/camer.png"),
      selectArray: [],
      index: "",
      // 市
      city: "",
      // 省
      county: "",
      // 区
      district: "",
      //格式化后的地址(只作显示)
      formatted_addresses: "",
      latitude: "",
      longitude: "",
      address: "",
      describe: "",
      location: {},
      // 隐患类型选择
      showDisposeState: false,
      type: "",
      typeName: "",
      diposeIndex: 0,
      coordTransform: null,
      // 选择地址弹出
      addrPopupShow: false,
      // 超图地图对象
      map: null,
      // 原生地图对象
      sourceMap: null,
      mapMarkerLayer: null,
      mapAddressMatchService: null,
      text: null,
      // 定位loading
      locationing: false,
      // 尝试定位次数
      count: 0,
      pointList: [],
      locationError: "暂时无法定位"
    };
  },
  methods: {
    // app获得经纬度
    getLocation() {
      this.locationing = true;
      if (!window.plus) {
        this.locationing = false;
      }
      isNativePermission("ACCESS_COARSE_LOCATION", "定位", () => {
        //获取当前定位
        // getGeoLocationBySys(
        //   (p, map) => {
        //     this.location = {
        //       lng: p.coord.longitude,
        //       lat: p.coord.latitude
        //     };
        //     this.longitude = p.coord.longitude;
        //     this.latitude = p.coord.latitude;
        //     // this.locationing = false;
        //     this.getLocal(this.longitude, this.latitude, true);
        //     this.sourceMap = map;
        //   },
        //   e => {
        //     showToast(e);
        //   }
        // );
        getGeoLocation(
          (lon, lat, p) => {
            this.text = JSON.stringify(p);
            this.location = {
              lng: lon,
              lat: lat
            };
            this.longitude = lon;
            this.latitude = lat;
            this.getLocal(this.longitude, this.latitude, true);

            this.county = p.address.province ? p.address.province : "";
            this.city = p.address.city ? p.address.city : "";
            this.district = p.address.district ? p.address.district : "";
            this.formatted_addresses = `${this.county} ${this.city} ${this.district}`;
            // this.city = p.address.city;
          },
          e => {
            this.text = JSON.stringify(e);
            this.locationError = "定位失败，请点击手动定位。";

            this.locationing = false;
            showToast(this.locationError);
          }
        );
      });
    },
    // 获取超图服务
    getMapMatchService(se) {
      this.mapAddressMatchService = se;
    },
    getMapMarkerLayer(mm) {
      this.mapMarkerLayer = mm;
    },
    // 获取地理位置
    getLocal: function(longitude, latitude, isNeedTransform = true) {
      if (this.mapAddressMatchService == null) {
        if (this.count < 20) {
          this.count++;
          setTimeout(() => {
            this.getLocal(longitude, latitude, isNeedTransform);
          }, 500);
          return;
        } else {
          this.city = "";
          this.formatted_addresses = "";
          this.locationing = false;
          this.locationError = "定位超时，请点击手动定位。";
        }
      }
      if (isNeedTransform) {
        let gcCoord = this.coordTransform.GCJToWGS(longitude, latitude);
        longitude = gcCoord[0];
        latitude = gcCoord[1];
        this.longitude = gcCoord[0];
        this.latitude = gcCoord[1];
      }
      // let gcCoord = null;
      var geoDecodeParam = new SuperMap.GeoDecodingParameter({
        x: longitude,
        y: latitude,
        fromIndex: 0,
        toIndex: 30,
        filters: "",
        prjCoordSys: { epsgcode: 4326 },
        maxReturn: 50,
        geoDecodingRadius: 50000
      });
      this.mapAddressMatchService.decode(geoDecodeParam, obj => {
        if (obj.type === "processFailed") {
          this.locationError = "未在指定区域内，请点击手动定位。";
          showToast(this.locationError);
          this.locationing = false;
          return;
        }
        this.pointList = [];
        let ids = [];
        obj.result.map(item => {
          let id = `${String(item.location.x).slice(-5)}-${String(
            item.location.y
          ).slice(-5)}-${String(item.score).slice(-5)}`;
          if (!ids.includes(id) && item.address) {
            ids.push(id);
            this.pointList.push({
              location: item.location,
              address: item.address,
              id
            });
          }
        });
        this.formatted_addresses = `${this.formatted_addresses} ${this.pointList[0].address}`;
        this.locationing = false;
      });
    },
    //加载地图选择坐标
    showMapCheck() {
      this.addrPopupShow = true;
      if (this.$refs.choice.mapMarkerCoord) {
        this.mapMarkerLayer.removeMarker(this.$refs.choice.mapMarkerCoord);
        this.mapMarkerCoord = null;
      }
      let center = new SuperMap.LonLat(this.longitude, this.latitude);
      this.map.setCenter(center, 7);

      // 撒点
      const size = new SuperMap.Size(36, 36);
      const offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
      const icon = new SuperMap.Icon(
        require(`../../assets/img/other/point.png`),
        size,
        offset
      );
      const mapMarkerCoord = new SuperMap.Marker(
        new SuperMap.LonLat(this.longitude, this.latitude),
        icon
      );
      this.$refs.choice.mapMarkerCoord = mapMarkerCoord;
      this.mapMarkerLayer.addMarker(mapMarkerCoord);
      // let _this = this;
      // wx.chooseLocation({
      //   success: function(res) {
      //     _this.getLocal(res.latitude, res.longitude, false);
      //   }
      // });
    },
    // 加载下拉框
    loadSelectList() {
      let that = this;
      // 隐患类型
      const NUM = "0031002";
      const params = {
        pKey: NUM
      };
      getSelectList(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          const data = dataIsNullArray(res.data);
          let list = [];
          data.map(item => {
            list.push({
              key: item.key,
              text: item.title
            });
          });
          that.selectArray = list;
        }
      });
    },

    showDisposeStatePop() {
      this.showDisposeState = true;
    },
    // 取消
    onDisposeStateCancel() {
      this.showDisposeState = false;
    },
    // 确定
    onDisposeStateConfirm(item) {
      this.typeName = item.text;
      this.type = item.key;
      this.showDisposeState = false;
    },

    // 图片上传 event
    beforeRead(file) {
      console.log(JSON.stringify(file));
      let that = this;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        let content = e.target.result;
        let img = new Image();
        img.src = content;
        img.onload = function() {
          let data = that.compress(img);
          const params = {
            group: "hiddenTakePicture",
            base64: data
          };
          let imgObj = {
            url: "",
            status: "uploading"
          };
          that.imgList.push(imgObj);
          uploadImage(params).then(r => {
            const code = dataIsNullNumber(r.code);
            if (code === 0) {
              that.appletHiddenImgList.push({ imgUrl: r.data });
              // that.imgList.push({ url: getImage(r.data) });
              imgObj.url = getImage(r.data);
              imgObj.status = "done";
            }
          });
        };
      };
    },
    //压缩图片
    compress: function(img) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let width = img.width;
      let height = img.height;
      canvas.width = width;
      canvas.height = height;
      // 铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);

      //进行压缩
      let ndata = canvas.toDataURL("image/jpeg", 0.2);
      return ndata;
    },
    // 删除资质图
    deleteAptitude(e, a) {
      this.imgList.splice(a.index, 1);
    },
    // 提交隐患
    handleSubmit() {
      let that = this;
      let imgLoading = false;
      if (!that.address) {
        showToast("请填写隐患地址");
        return;
      }
      if (!that.type) {
        showToast("请选择隐患类型");
        return;
      }
      this.imgList.map(e => {
        if (e.status === "done") {
          imgLoading = true;
        } else {
          imgLoading = false;
        }
      });
      if (!imgLoading) {
        showToast("图片上传中");
        return;
      }
      const params = {
        // 省市名称
        city: that.county, //  后台city 字段接收省
        // 区县名称
        county: that.city, // 后台county字段接收市
        district: that.district,
        location: JSON.stringify(that.location),
        // 隐患描述
        describe: that.describe,
        // 隐患地址描述
        address: that.address,
        // 隐患类型
        type: that.type
      };
      params.appletHiddenImgList = this.appletHiddenImgList;
      insertPictureData(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          showToast("提交成功！");
          this.$router.go(-1);
        } else {
          showToast(res.message);
        }
      });
    },
    // 获得点位坐标信息
    getConfirmAddress(point) {
      this.location = {
        lng: point.location.x,
        lat: point.location.y
      };
      this.longitude = point.location.x;
      this.latitude = point.location.y;
      this.addrPopupShow = false;
      // 手动选择设置默认省市区
      // 省市名称
      this.county = "广西壮族自治区";
      // 区县名称
      this.city = "贵港市";
      this.district = "平南县";
      this.formatted_addresses = `广西壮族自治区 贵港市 平南县 ${point.address}`;
    },
    // 获得地图对象
    getMapObject(map) {
      this.map = map;
    }
  },
  mounted() {
    isNativePermission("WRITE_EXTERNAL_STORAGE", "文件访问", () => {});
    this.$root.backBtnFn = this.$root.goBack;
    const backFn = () => {
      if (this.addrPopupShow) {
        this.addrPopupShow = false;
      } else {
        this.$root.backBtnFn();
      }
    };
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // 添加监听home键回退
    addBackButton(backFn);

    this.loadSelectList();
    let funGetTRF = () => {
      // eslint-disable-next-line no-undef
      if (window.CoordTransform) {
        // eslint-disable-next-line no-undef
        this.coordTransform = new CoordTransform.Init();
      } else {
        setTimeout(() => {
          funGetTRF();
        }, 100);
      }
    };
    funGetTRF();
    this.getLocation();
    // this.getLocal();
    window.getLocal = this.getLocal;
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/common.scss";
.hidden-pic {
  overflow: hidden;
  font-size: 12px;
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
  @include page-none-data;
  .takepicture-title-content {
    background: #0e46b1;
    color: #fff;
    font-size: 12px;
    height: 35px;
    padding: 10px 15px;
    display: flex;
    align-items: center;
  }
  .leftFlag {
    display: inline-block;
  }
  .rightFlag {
    display: inline-block;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* 表格行样式 */
  .tackpicture-item {
    background: #fff;
    padding: 0 12.5px;
    border-radius: 5px;
  }
  .border {
    border-bottom: 1px solid #e5e5e5;
  }
  .row-input {
    height: 40px;
    line-height: 42px;
    color: #3a3a3a;
  }
  .pic-icon {
    width: 10px;
    height: 12px;
    margin-right: 5px;
  }
  .takepicture-content {
    padding: 12px;
  }
  .hiden-item {
    font-size: 12px;
    color: #666;
  }
  /* 隐患描述 */
  .describe-container {
    height: 200px;
    padding-top: 12px;
    position: relative;
    color: #afafb3;
    font-size: 11px;
  }
  .describe-content {
    height: 200px;
    border: 1px solid #e5e5e5;
  }
  .describe-textarea {
    padding: 10px;
  }
  .input-describe {
    background: #f8f8ff !important;
  }
  .describe-block {
    height: calc(100% - 105px);
  }
  .sescribe-content {
    position: absolute;
    bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    padding: 0 10px;
  }
  .bo {
    width: 10px;
    height: 10px;
  }

  /* 拍照上传照片 */
  .sescribe-image {
    width: 48px;
    height: 48px;
    margin-right: 5px;
    position: relative;
  }
  .group {
    position: absolute;
    top: -12.5px;
    right: -5px;
  }
  /* 删除图标 */
  .delete-icon {
    width: 12.5px;
    height: 12.5px;
  }
  /* 相机图标 */
  .camer-icon {
    width: 47.5px;
    height: 47.5px;
  }
  /* 提交按钮 */
  .picture-btn-content {
    position: fixed;
    bottom: 0;
  }
  .picture-btn {
    height: 49px;
    line-height: 49px;
    font-size: 18px;
    background: #ff0000;
    color: #b1e8ee;
    padding: 0;
  }
  /* 上传图片 */
  .dispose-mark {
    height: 130px;
    border: 1px solid #e5e5e5;
    padding: 10px;
    position: relative;
    background: #f8f8f8;
    font-size: 11px;
  }
  .discpose-textarea {
    height: 65px;
    color: #3a3a3a;
    width: 100%;
    background: #f8f8f8;
    border: none;
    resize: none;
  }
  .register-photo {
    position: absolute;
    bottom: 10px;
    left: 10px;
  }
  /deep/.uploader-contianer .van-uploader {
    width: 100%;
    height: 100%;
  }
  /deep/.van-uploader__upload,
  /deep/.van-uploader__preview,
  /deep/.van-uploader__preview-image {
    width: 50px !important;
    height: 50px !important;
    border: 1px #dadadc dashed;
  }
  .custom-btn {
    width: 100% !important;
    height: 59px;
    line-height: 59px;
    font-size: 18px;
    // background: #14b9cc;
    color: #b1e8ee;
    padding: 0;
    color: #fff;
  }
  .map-wrap {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    right: -100vw;
    transition: right 0.3s;
    &.active {
      right: 0;
    }
  }
}
</style>
