<template>
  <div class="w100 h100 resource">
    <panel-part-oper
      style="position:absolute;z-index:0"
      height="100%"
      leftTitle="类型选择"
      :leftLoading="leftLoading"
    >
      <template slot="left-content">
        <div class="w100 h100 left-content">
          <div class="w100 select">
            <van-field
              class="w100"
              readonly
              clickable
              v-model="radiusName"
              placeholder="请选择范围"
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
          <div class="w100 rangeCheckbox">
            <van-checkbox-group v-model="checkedList" @change="checkboxChange">
              <van-checkbox
                icon-size="0.6rem"
                v-for="(item, index) in checkboxList"
                :key="index"
                :name="item.value"
              >
                <i
                  :class="[
                    'layerIcon',
                    item.value == '0005002001'
                      ? 'gwdw'
                      : item.value == '0005002002'
                      ? 'zddw'
                      : item.value == '0027003001'
                      ? 'spjkd'
                      : item.value == '0020001001'
                      ? 'xhs'
                      : item.value == '0020001003'
                      ? 'qsmt'
                      : item.value == '0020001005'
                      ? 'bncs'
                      : item.value == '0021001001'
                      ? 'yjjyd'
                      : item.value == '0021001003'
                      ? 'qyzzd'
                      : item.value == '0021001004'
                      ? 'wxxfz'
                      : ''
                  ]"
                ></i>
                {{ item.name }}
              </van-checkbox>
            </van-checkbox-group>
          </div>
        </div>
      </template>
      <template slot="right-content">
        <div class=" h100 right-content">
          <div class="w100 h100  content-map">
            <div
              class="search"
              @keyup.enter="searchUnitHandle"
              v-if="isHandDema"
            >
              <van-field v-model="unitName" placeholder="请输入单位名称" />
              <van-icon
                v-if="unitName || searchUnitList.length"
                name="cross"
                class="searchIcon"
                size="0.8rem"
                @click="
                  searchUnitList.length = 0;
                  unitName = '';
                "
              />
              <ul class="w100 h100">
                <van-loading
                  v-if="searchLoading"
                  type="spinner"
                  color="#1c273d"
                  size="2.5rem"
                />
                <li
                  v-for="(item, index) in searchUnitList"
                  :key="index"
                  @click="setFireAlarmData(item)"
                >
                  {{ item.unitName }}
                </li>
              </ul>
            </div>

            <van-icon
              v-if="isHandDema"
              name="map-marked"
              :class="['map-marked', mapIsHandPoint ? 'active' : '']"
              size="1rem"
              @click="setMarkerByFlag"
            />
            <div class="w100 h100 map" id="allmap"></div>
          </div>
        </div>
      </template>
    </panel-part-oper>

    <van-overlay :show="showVideo" @click="showVideo = false">
      <div class="w100 h100 overlay-wrapper" @click.stop>
        <iframe
          v-if="showVideo"
          ref="videoIframe"
          style="width:70%;height:70%"
          controls="controls"
          frameborder="0"
          allowfullscreen="true"
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
        />

        <van-icon
          name="close"
          @click="showVideo = false"
          class="clearIcon"
          size="1.5rem"
        />
      </div>
    </van-overlay>
  </div>
</template>
<script>
import { SuperMap } from "@supermap/iclient-classic";
import {
  superMapServerUrl,
  superMapAddressGeoCodingUrl,
  superMapDrawStyle,
  superMapDefCenter
} from "@/utils/tool-supermap";
import panelPartOper from "@/components/pub/PanelPartOper.vue";
import {
  dataIsNullArray,
  clearArray,
  dataIsNullNumber,
  dataIsNullStr,
  showToast
} from "@/utils/tool";
import { urlVideoPlayerOnline } from "@/utils/global";
import {
  getCircumResourceLayer,
  getCircumResource,
  getUnitByName
} from "@/utils/api";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      //范围
      radius: "500",
      radiusName: "500米",
      showPicker: false,
      //范围选择
      columns: [
        {
          text: "500米",
          keyId: 500
        },
        {
          text: "1000米",
          keyId: 1000
        },
        {
          text: "2000米",
          keyId: 2000
        },
        {
          text: "5000米",
          keyId: 5000
        }
      ],
      //图层选择
      checkboxList: [],
      //已选中图层
      checkedList: [],
      leftLoading: false,

      //当前地图的点位
      currentCoord: "",
      //资源撒点数据
      resourceList: [],
      //是否显示视频
      showVideo: false,
      //单位名称
      unitName: "",
      //是否打开手动标定和搜索
      isHandDema: false,
      //单位列表option
      searchUnitList: [],
      searchLoading: false,

      // 超图对象
      map: null,
      //loading
      maploading: false,
      // 超图底图图层对象
      mapBaseLayer: null,
      // 超图底图图层是否初始化完成
      mapBaseLayerInited: false,
      // 超图撒点图层对象
      mapMarkerLayer: null,
      // 超图绘制圆形对象
      mapDrawCircular: null,
      // 超图绘制图层对象
      mapDrawLayer: null,
      //超图带数字marker对象
      mapVectorLayer: null,
      //超图是否手动标定
      mapIsHandPoint: false,
      // 超图最后一次描点对象
      mapLastFeature: null,

      // ==========
      // 超图选择撒点对象（带标签）
      mapSelectMarker: null,
      // 超图撒点对象数组
      mapMarkers: [],
      //超图撒资源点对象数组
      mapResourceMarkers: [],
      //超图撒点-火灾点位
      fireMarker: null,
      // 超图信息框对象
      mapInfoWindow: null,
      // ==========
      // 超图是否描点
      mapIsDrawPoint: false,
      // 超图绘制点对象
      mapDrawPoint: null,
      // 超图点对象
      mapPoint: null,
      // 超图描点对象
      mapMarkerCoord: null,
      // 超图描点点对象-当前自己的位置
      mapCurrMarkerCoord: null,
      //超图画范围圆圈对象
      mapDrawRangerCircular: null,

      // ==========
      // 超图地址匹配服务对象
      mapAddressMatchService: null,
      //当前地图缩放等级
      zoomMapLevel: 7
    };
  },
  components: {
    "panel-part-oper": panelPartOper
  },
  computed: {
    ...mapGetters(["fireAlarmInfo", "geoPosition", "fireAlarmId"])
  },
  watch: {
    geoPosition(nv, ov) {
      if (nv && nv != ov) {
        this.addMarkerMine(nv);
      }
    }
  },
  methods: {
    ...mapActions(["setFireAlarmInfo"]),
    //搜索单位
    searchUnitHandle: function() {
      // 监听长按键事件
      const params = {
        unitName: this.unitName
      };
      this.searchLoading = true;
      getUnitByName(params).then(res => {
        this.searchLoading = false;
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullArray(res.data);
          this.searchUnitList = JSON.parse(JSON.stringify(data));
        }
      });
    },
    //手动搜索点击
    setFireAlarmData: function(item) {
      if (!item.lonBaidu || !item.latBaidu) {
        showToast("该单位坐标异常");
        return;
      }
      this.setFireAlarmInfo({
        unitId: item.key,
        lonBaidu: item.lonBaidu,
        latBaidu: item.latBaidu,
        unitName: item.unitName
      });
      this.addMarkerHandle(`${item.lonBaidu},${item.latBaidu}`);
      this.searchUnitList.length = [];
      this.unitName = "";
      //如果已经选中了范围和资源，那么资源和图层保留
      this.$nextTick(() => {
        if (this.checkedList.length) {
          this.checkboxChange();
        }
      });
    },
    //点击标定图标 撒点
    setMarkerByFlag: function() {
      if (!this.mapBaseLayerInited) {
        return;
      }
      if (!this.mapIsHandPoint) {
        this.mapDrawPoint.activate();
        showToast("已开启手动标定");
      } else {
        this.mapDrawPoint.deactivate();
        showToast("已关闭手动标定");
      }
      this.mapIsHandPoint = !this.mapIsHandPoint;
    },
    //获取图层数据
    getLayerData: function() {
      getCircumResourceLayer().then(res => {
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullArray(res.data);
          data.map(item => {
            if (item.typeId == "0027003001") {
              item.typeName = "视频监控点";
            }
            this.checkboxList.push({
              name: item.typeName,
              value: item.typeId
            });
          });
        }
      });
    },
    //范围确定
    onConfirm(value) {
      this.radiusName = value.text;
      this.radius = value.keyId;
      this.showPicker = false;
      if (!this.checkedList.length) {
        this.clearResourceMarkerHandle();
        return;
      }
      //画圆
      this.addCircleHandle(
        { lon: this.fireAlarmInfo.lonBaidu, lat: this.fireAlarmInfo.latBaidu },
        this.radius
      );
      const params = {
        lon: this.fireAlarmInfo.lonBaidu,
        lat: this.fireAlarmInfo.latBaidu,
        radius: this.radius,
        typ: this.checkedList
      };
      clearArray(this.resourceList);
      getCircumResource(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullArray(res.data);
          data.map(item => {
            let descArr = [];
            switch (item.typeId) {
              case "0005002001":
              case "0005002002":
                descArr.push(
                  {
                    type: "title",
                    value: dataIsNullStr(item.resourceName)
                  },
                  {
                    name: "所属行业",
                    value: dataIsNullStr(item.industryTypeIdName)
                  },
                  {
                    name: "监管级别",
                    value: dataIsNullStr(item.regulateLevelName)
                  },
                  {
                    name: "电话",
                    value: dataIsNullStr(item.phone)
                  }
                );
                break;
              case "0020001005":
              case "0020001001":
              case "0020001003":
                descArr.push(
                  {
                    type: "title",
                    value: dataIsNullStr(item.resourceName)
                  },
                  {
                    name: "资源类型",
                    value: dataIsNullStr(item.resourceTypeName)
                  },
                  {
                    name: "资源状态",
                    value: dataIsNullStr(item.resourceStateName)
                  },
                  {
                    name: "主管部门",
                    value: dataIsNullStr(item.competentDepartment)
                  }
                );
                break;
              case "0021001001":
              case "0021001003":
              case "0021001004":
                descArr.push(
                  {
                    type: "title",
                    value: dataIsNullStr(item.resourceName)
                  },
                  {
                    name: "队站类型",
                    value: dataIsNullStr(item.unitTypeName)
                  },
                  {
                    name: "负责人",
                    value: dataIsNullStr(item.hosemanName)
                  },
                  {
                    name: "电话",
                    value: dataIsNullStr(item.phone)
                  }
                );
                break;
              case "0027003001":
                descArr.push(
                  {
                    type: "title",
                    value: dataIsNullStr(item.resourceName)
                  },
                  {
                    name: "资源类型",
                    value: "视频监控点"
                  },
                  {
                    name: "特征",
                    value: dataIsNullStr(item.videoCode)
                  }
                );
                break;
            }
            this.resourceList.push({
              key: dataIsNullStr(item.resourceId),
              coord: `${item.lonBaidu},${item.latBaidu}`,
              resourceId: dataIsNullStr(item.resourceId),
              resourceName: dataIsNullStr(item.resourceName),
              typeName: dataIsNullStr(item.resourceTypeName),
              typeId: dataIsNullStr(item.typeId),
              lonBaidu: dataIsNullStr(item.lonBaidu),
              latBaidu: dataIsNullStr(item.latBaidu),
              source: dataIsNullStr(item.source),
              descArr: descArr
            });
          });
          //撒资源点
          this.addResourceMarkerHandle(this.resourceList);
        }
      });
    },
    //图层改变
    checkboxChange: function() {
      if (!this.radius) {
        return;
      }
      if (!this.checkedList.length) {
        this.clearResourceMarkerHandle();
        return;
      }
      //画圆
      this.addCircleHandle(
        { lon: this.fireAlarmInfo.lonBaidu, lat: this.fireAlarmInfo.latBaidu },
        this.radius
      );
      const params = {
        lon: this.fireAlarmInfo.lonBaidu,
        lat: this.fireAlarmInfo.latBaidu,
        radius: this.radius,
        typ: this.checkedList
      };
      clearArray(this.resourceList);
      getCircumResource(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullArray(res.data);
          data.map(item => {
            let descArr = [];
            switch (item.typeId) {
              case "0005002001":
              case "0005002002":
                descArr.push(
                  {
                    type: "title",
                    value: dataIsNullStr(item.resourceName)
                  },
                  {
                    name: "所属行业",
                    value: dataIsNullStr(item.industryTypeIdName)
                  },
                  {
                    name: "监管级别",
                    value: dataIsNullStr(item.regulateLevelName)
                  },
                  {
                    name: "电话",
                    value: dataIsNullStr(item.phone)
                  }
                );
                break;
              case "0020001005":
              case "0020001001":
              case "0020001003":
                descArr.push(
                  {
                    type: "title",
                    value: dataIsNullStr(item.resourceName)
                  },
                  {
                    name: "资源类型",
                    value: dataIsNullStr(item.resourceTypeName)
                  },
                  {
                    name: "资源状态",
                    value: dataIsNullStr(item.resourceStateName)
                  },
                  {
                    name: "主管部门",
                    value: dataIsNullStr(item.competentDepartment)
                  }
                );
                break;
              case "0021001001":
              case "0021001003":
              case "0021001004":
                descArr.push(
                  {
                    type: "title",
                    value: dataIsNullStr(item.resourceName)
                  },
                  {
                    name: "队站类型",
                    value: dataIsNullStr(item.unitTypeName)
                  },
                  {
                    name: "负责人",
                    value: dataIsNullStr(item.hosemanName)
                  },
                  {
                    name: "电话",
                    value: dataIsNullStr(item.phone)
                  }
                );
                break;
              case "0027003001":
                descArr.push(
                  {
                    type: "title",
                    value: dataIsNullStr(item.resourceName)
                  },
                  {
                    name: "资源类型",
                    value: "视频监控点"
                  },
                  {
                    name: "特征",
                    value: dataIsNullStr(item.videoCode)
                  }
                );
                break;
            }
            this.resourceList.push({
              key: dataIsNullStr(item.resourceId),
              coord: `${item.lonBaidu},${item.latBaidu}`,
              resourceId: dataIsNullStr(item.resourceId),
              resourceName: dataIsNullStr(item.resourceName),
              typeName: dataIsNullStr(item.resourceTypeName),
              typeId: dataIsNullStr(item.typeId),
              lonBaidu: dataIsNullStr(item.lonBaidu),
              latBaidu: dataIsNullStr(item.latBaidu),
              source: dataIsNullStr(item.source),
              videoCode: item.videoCode,
              descArr: descArr
            });
          });
          //撒资源点
          this.addResourceMarkerHandle(this.resourceList);
        }
      });
    },
    //画圆
    addCircleHandle: function(data, r) {
      if (!this.mapBaseLayerInited) {
        return;
      }
      this.clearCircle();
      const center = new SuperMap.Geometry.Point(data.lon, data.lat);
      const raduis = (r / (2 * Math.PI * 6371004)) * 360; //默认是度，换算成米
      // const raduis = r / 100000;
      const polygon = new SuperMap.Geometry.Polygon.createRegularPolygon(
        center,
        raduis,
        360,
        360
      );
      const roundVector = new SuperMap.Feature.Vector(polygon);
      roundVector.style = {
        strokeColor: "#DE5145",
        fillColor: "#EA7454",
        strokeWidth: 2,
        fillOpacity: 0.3,
        strokeOpacity: 0.5
      };
      this.mapVectorLayer && this.mapVectorLayer.addFeatures(roundVector);
      this.mapDrawRangerCircular = roundVector;
    },
    //清除圆
    clearCircle: function() {
      this.mapDrawRangerCircular &&
        this.mapVectorLayer.removeFeatures(this.mapDrawRangerCircular);
    },
    //撒点-火灾点位
    addMarkerHandle: function(coordStr) {
      if (!this.mapBaseLayerInited) {
        return;
      }
      // this.radius = "500";
      // this.radiusName = "500米";
      // this.checkedList = [];
      this.maploading = true;
      this.clearMarkerHandle();
      // 撒点
      const coord = coordStr.split(",");
      const size = new SuperMap.Size(48, 48);
      const offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
      const icon = new SuperMap.Icon(
        require("../../assets/img/fireresuce/fire.gif"),
        size,
        offset
      );
      this.fireMarker = new SuperMap.Marker(
        new SuperMap.LonLat(coord[0], coord[1]),
        icon
      );
      this.mapMarkerLayer.addMarker(this.fireMarker);
      this.maploading = false;
    },
    //撒点(自己)
    addMarkerMine: function(coordStr) {
      if (!this.mapBaseLayerInited) {
        return;
      }
      this.clearCurrMarkerHandle();
      // 撒点
      const coord = coordStr.split(",");
      const size = new SuperMap.Size(30, 30);
      const offset = new SuperMap.Pixel(-(size.w / 2), -(size.h / 2));
      const icon = new SuperMap.Icon(
        require(`../../assets/img/fireresuce/point.png`),
        size,
        offset
      );
      this.mapCurrMarkerCoord = new SuperMap.Marker(
        new SuperMap.LonLat(coord[0], coord[1]),
        icon
      );
      this.mapMarkerLayer.addMarker(this.mapCurrMarkerCoord);
      //画圆
      this.mapDrawCircular &&
        this.mapVectorLayer.removeFeatures(this.mapDrawCircular);
      const center = new SuperMap.Geometry.Point(coord[0], coord[1]);
      const raduis = (200 / (2 * Math.PI * 6371004)) * 360; //默认是度，换算成米,50是50米
      const polygon = new SuperMap.Geometry.Polygon.createRegularPolygon(
        center,
        raduis,
        360,
        360
      );
      const roundVector = new SuperMap.Feature.Vector(polygon);
      roundVector.style = {
        strokeColor: "#43cdd3",
        fillColor: "#8fe7eb",
        strokeWidth: 1,
        fillOpacity: 0.3,
        strokeOpacity: 0.5
      };
      this.mapVectorLayer && this.mapVectorLayer.addFeatures(roundVector);
      this.mapDrawCircular = roundVector;
    },
    //撒资源
    addResourceMarkerHandle: function(mapData) {
      if (!this.mapBaseLayerInited) {
        return;
      }
      if (!mapData.length) {
        return;
      }
      this.maploading = true;
      this.clearResourceMarkerHandle();
      mapData.map(item => {
        const coord = [item.lonBaidu, item.latBaidu];
        const size = new SuperMap.Size(36, 36);
        const offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
        const icon = new SuperMap.Icon(
          require(item.typeId == "0005002001"
            ? "../../assets/img/fireresuce/gwdw.png"
            : item.typeId == "0005002002"
            ? "../../assets/img/fireresuce/zddw.png"
            : item.typeId == "0027003001"
            ? "../../assets/img/fireresuce/spjkd.png"
            : item.typeId == "0020001001"
            ? "../../assets/img/fireresuce/xhs.png"
            : item.typeId == "0020001003"
            ? "../../assets/img/fireresuce/qsmt.png"
            : item.typeId == "0020001005"
            ? "../../assets/img/fireresuce/bncs.png"
            : item.typeId == "0021001001"
            ? "../../assets/img/fireresuce/yjjyd.png"
            : item.typeId == "0021001003"
            ? "../../assets/img/fireresuce/qyzzd.png"
            : item.typeId == "0021001004"
            ? "../../assets/img/fireresuce/wxxfz.png"
            : "../../assets/img/fireresuce/wxxfz.png"),
          size,
          offset
        );
        const resourceMarker = new SuperMap.Marker(
          new SuperMap.LonLat(coord[0], coord[1]),
          icon
        );
        // 添加marker事件
        const markerClick = () => {
          this.clearMapInfoWindow();
          const html = [];
          if (item.typeId == "0027003001") {
            //视频
            this.showVideo = true;
            setTimeout(() => {
              const videoPlayer = this.$refs["videoIframe"];
              if (videoPlayer) {
                videoPlayer.setAttribute(
                  "src",
                  `${urlVideoPlayerOnline}?vid=${item.videoCode}&platform=sc&channel=1&timestamp=${item.videoCode}`
                );
              }
            }, 500);
          } else {
            //非视频
            html.push("<div class='supermap-infowindow-content'>");
            let descArr = dataIsNullArray(item.descArr);
            descArr.map(i => {
              if (i.type == "title") {
                html.push(
                  `<div class='row head'><span>${i.value}</span></div>`
                );
              } else {
                html.push(
                  `<div class='row'><span class='title'>${i.name}：</span><span title='${i.value}'>${i.value}</span></div>`
                );
              }
            });
            const closeId = `supermap-infowindow-close${item.key}`;
            html.push(`<div class="row bottom" id="${closeId}">关闭</div>`);
            html.push("</div>");

            this.mapInfoWindow = new SuperMap.Popup.Anchored(
              `point${item.key}`,
              resourceMarker.lonlat,
              null,
              html.join(""),
              resourceMarker.icon,
              false,
              null
            );
            this.mapInfoWindow.autoSize = true;
            this.mapInfoWindow.setBackgroundColor("rgba(255,255,255,1)");
            // 添加自定义信息框
            this.map.addPopup(this.mapInfoWindow);
            // 添加自定义信息框关闭事件
            const domClose = document.getElementById(closeId);
            if (domClose) {
              this.mapDrawPoint && this.mapDrawPoint.deactivate();
              const closeEvent = () => {
                this.clearMapInfoWindow();
                this.mapDrawPoint && this.mapDrawPoint.activate();
              };
              domClose.removeEventListener("click", closeEvent);
              domClose.addEventListener("click", closeEvent);
            }
          }
        };
        resourceMarker.events.on({
          touchend: markerClick
        });
        this.mapMarkerLayer.addMarker(resourceMarker);
        this.mapResourceMarkers.push({
          key: item.resourceId,
          name: item.resourceName,
          typeId: item.typeId,
          marker: resourceMarker
        });
      });
      this.maploading = false;
    },
    // 清空撒点-自己
    clearMarkerHandle: function() {
      if (this.fireMarker) {
        this.mapMarkerLayer.removeMarker(this.fireMarker);
        this.fireMarker = null;
      }
      this.mapLastFeature &&
        this.mapVectorLayer.removeFeatures([this.mapLastFeature]);
      this.clearMapInfoWindow();
    },
    // 清空撒点-当前定位
    clearCurrMarkerHandle: function() {
      if (this.mapCurrMarkerCoord) {
        this.mapMarkerLayer.removeMarker(this.mapCurrMarkerCoord);
        this.mapCurrMarkerCoord = null;
      }
    },
    //清空资源点
    clearResourceMarkerHandle: function() {
      this.mapResourceMarkers.map(markerObj => {
        if (markerObj.marker) {
          this.mapMarkerLayer.removeMarker(markerObj.marker);
          markerObj.marker = null;
        }
      });
      clearArray(this.mapResourceMarkers);
      this.clearMapInfoWindow();
    },
    // 清除信息框
    clearMapInfoWindow: function() {
      if (this.mapInfoWindow) {
        this.mapInfoWindow.hide();
        this.mapInfoWindow.destroy();
        this.mapInfoWindow = null;
      }
    },
    //初始化地图
    initMap: function() {
      // 1.创建地图
      this.map = new SuperMap.Map("allmap", {
        controls: [
          new SuperMap.Control.Navigation({
            dragPanOptions: {
              enableKinetic: true
            }
          })
        ]
      });
      // 2.创建图层
      // 创建底图图层

      this.mapBaseLayer = new SuperMap.Layer.TiledDynamicRESTLayer(
        "底图图层",
        superMapServerUrl,
        {
          transparent: true,
          cacheEnabled: true
        },
        {
          maxResolution: "auto",
          useCanvas: false,
          // 允许跨域（截图）
          useCORS: true
        }
      );
      // 3.底图图层事件
      const mapBaseLayerInited = () => {
        // 1.创建图层
        // 创建标记图层
        this.mapMarkerLayer = new SuperMap.Layer.Markers("标记图层");
        // 创建矢量图层
        const strategy = new SuperMap.Strategy.GeoText();
        strategy.style = JSON.parse(JSON.stringify(superMapDrawStyle));
        strategy.style.fontColor = "#ff3300";
        this.mapVectorLayer = new SuperMap.Layer.Vector("矢量图层", {
          strategies: [strategy]
        });
        this.mapVectorLayer.style = JSON.parse(
          JSON.stringify(superMapDrawStyle)
        );
        // 2.添加图层
        this.map.addLayers([
          this.mapBaseLayer,
          this.mapMarkerLayer,
          this.mapVectorLayer
        ]);
        this.map.setBaseLayer(this.mapBaseLayer);
        // 绘制点（手动标定用）
        this.mapDrawPoint = new SuperMap.Control.DrawFeature(
          this.mapVectorLayer,
          SuperMap.Handler.Point
        );
        const mapDrawPointCompleted = evt => {
          this.clearMarkerHandle();
          this.mapLastFeature = evt.feature;
          // 获得图层几何对象
          const geometry = this.mapLastFeature.geometry;
          const coord = `${geometry.x},${geometry.y}`;
          this.setFireAlarmInfo({ lonBaidu: geometry.x, latBaidu: geometry.y });
          this.clearCircle();
          this.clearResourceMarkerHandle();
          this.clearMapInfoWindow();

          this.zoomMapLevel = this.map.getZoom();
          this.map.setCenter(
            new SuperMap.LonLat(geometry.x, geometry.y),
            this.zoomMapLevel
          );
          this.addMarkerHandle(coord);

          //如果已经选中了范围和资源，那么资源和图层保留
          this.$nextTick(() => {
            if (this.checkedList.length) {
              this.checkboxChange();
            }
          });
        };
        this.mapDrawPoint.events.on({ featureadded: mapDrawPointCompleted });
        this.map.addControl(this.mapDrawPoint);
        // // 4.添加要素操作控件
        // // 选择撒点（带标签）
        // this.mapSelectMarker = new SuperMap.Control.SelectFeature(
        //   this.mapVectorLayer,
        //   {
        //     onSelect: () => {
        //       // 选中操作
        //     },
        //     onUnselect: () => {
        //       // 未选中操作
        //     },
        //     callbacks: {
        //       click: feature => {
        //         this.clearMapInfoWindow();
        //         if (feature.data && feature.data.type === "marker") {
        //           this.addMapInfoWindow(feature);
        //         }
        //       }
        //     },
        //     // 是否鼠标悬浮地物上触发
        //     hover: false,
        //     // 是否重复点击
        //     repeat: true
        //   }
        // );
        // this.map.addControl(this.mapSelectMarker);
        // this.mapSelectMarker.activate();

        // 选择撒点结束
        // ==========
        // ==========
        // 5.添加服务
        this.mapAddressMatchService = new SuperMap.REST.AddressMatchService(
          superMapAddressGeoCodingUrl,
          { data: "11" }
        );

        // 6.设置中心点
        // 县政府
        this.map.setCenter(
          new SuperMap.LonLat(superMapDefCenter[0], superMapDefCenter[1]),
          7
        );
        // 底图图层初始化完成
        this.mapBaseLayerInited = true;
        if (this.fireAlarmId) {
          //有警情id就是平台调度，有单位为id就是手动标定过了的
          let coordStr = `${this.fireAlarmInfo.lonBaidu},${this.fireAlarmInfo.latBaidu}`;
          //关闭手动标定和搜索
          this.isHandDema = false;
          this.$nextTick(() => {
            this.addMarkerHandle(coordStr);
          });
        } else if (this.fireAlarmInfo.unitId) {
          let coordStr = `${this.fireAlarmInfo.lonBaidu},${this.fireAlarmInfo.latBaidu}`;
          this.isHandDema = false;
          this.$nextTick(() => {
            this.addMarkerHandle(coordStr);
          });
        } else {
          this.isHandDema = true;
        }
      };
      this.mapBaseLayer.events.on({
        layerInitialized: mapBaseLayerInited
      });
    }
  },
  mounted() {
    this.getLayerData();
    this.initMap();
  },
  destroyed() {
    this.map.destroy();
    this.map = null;
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
    padding: px2rem(40px) px2rem(20px);
    overflow: auto;
    .select {
      position: relative;
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
      left: calc(50% + 4rem);
      top: px2rem(60px);
    }
    .van-field__control {
      // width: 100% !important;
      height: px2rem(67px);
      border-radius: px2rem(5px);
      font-size: px2rem(30px);
      padding: 0 px2rem(70px) 0 px2rem(30px);
      background: #1c273d;
      border: px2rem(2px) solid #00ccd1;
      padding: 0 px2rem(50px) 0 px2rem(20px);
    }
    .rangeCheckbox {
      padding: px2rem(85px) px2rem(20px) 0;
      .van-checkbox-group > div {
        padding-bottom: px2rem(50px);
      }
      .van-checkbox__icon .van-icon {
        border-color: #01edf3;
      }
      .van-checkbox__label {
        color: #01edf3;
        font-size: px2rem(26px);
        @include text-ellipsis;
      }
    }
    .van-checkbox-group {
      .van-checkbox__label {
        @include flex;
        @include flex-secondary-axis-center;
        padding-left: px2rem(10px);
      }
    }

    .layerIcon {
      width: px2rem(36px);
      height: px2rem(36px);
      display: block;
      margin-right: 10px;
      &.gwdw {
        background: url("../../assets/img/fireresuce/gwdw.png") 0 0 no-repeat;
        background-size: 100%;
      }
      &.zddw {
        background: url("../../assets/img/fireresuce/zddw.png") 0 0 no-repeat;
        background-size: 100%;
      }
      &.spjkd {
        background: url("../../assets/img/fireresuce/spjkd.png") 0 0 no-repeat;
        background-size: 100%;
      }
      &.xhs {
        background: url("../../assets/img/fireresuce/xhs.png") 0 0 no-repeat;
        background-size: 100%;
      }
      &.qsmt {
        background: url("../../assets/img/fireresuce/qsmt.png") 0 0 no-repeat;
        background-size: 100%;
      }
      &.bncs {
        background: url("../../assets/img/fireresuce/bncs.png") 0 0 no-repeat;
        background-size: 100%;
      }
      &.yjjyd {
        background: url("../../assets/img/fireresuce/yjjyd.png") 0 0 no-repeat;
        background-size: 100%;
      }
      &.qyzzd {
        background: url("../../assets/img/fireresuce/qyzzd.png") 0 0 no-repeat;
        background-size: 100%;
      }
      &.wxxfz {
        background: url("../../assets/img/fireresuce/wxxfz.png") 0 0 no-repeat;
        background-size: 100%;
      }
    }
  }
  .right-content {
    padding: px2rem(50px);
    position: relative;
    .map {
      border: px2rem(2px) solid #01edf3;
      position: relative;
      #allmap {
        // position: absolute;
        z-index: 1;
      }
    }
    .content-map {
      position: relative;
      .search {
        z-index: 99;
        position: absolute;
        width: px2rem(400px);
        top: px2rem(50px);
        left: px2rem(50px);
        background: #1c273d;
        // border: px2rem(2px) solid #00ccd1;
        border-radius: px2rem(5px);

        padding: px2rem(15px) 0;
        padding-left: px2rem(15px);
        padding-right: px2rem(50px);
        ul {
          border-radius: px2rem(5px);
          position: absolute;
          top: 1.5rem;
          height: 10rem;
          left: 0;
          overflow: auto;
          &::-webkit-scrollbar {
            height: 0px;
            width: 0px;
          }
          &::-webkit-scrollbar-track {
            background-color: transparent;
          }
          &::-webkit-scrollbar-track {
            background-color: transparent;
          }
          .van-loading {
            top: 10%;
          }
          li {
            padding: px2rem(15px);
            font-size: px2rem(30px);
            background: #1c273d;
            color: #01edf3;
            border-top: 1px solid black;
          }
        }
      }
      .van-cell.van-field {
        background: #1c273d;
        font-size: px2rem(30px);
      }
      .searchIcon {
        position: absolute;
        right: 0.1rem;
        top: 50%;
        transform: translateY(-50%);
        color: #00ccd1;
      }
      .map-marked {
        position: absolute;
        right: px2rem(50px);
        top: px2rem(50px);
        z-index: 99;
        color: #1c273c;
        border-radius: 50%;
        padding: px2rem(10px) px2rem(15px) px2rem(15px);
        background: #1c273c;
        color: white;
        &.active {
          color: #01edf3;
        }
      }
      .map {
        z-index: 2;
        position: absolute;
        border: px2rem(2px) solid #01edf3;
      }
    }
  }
  .overlay-wrapper {
    @include flex;
    @include flex-primary-axis-center;
    @include flex-secondary-axis-center;
    position: relative;
    .clearIcon {
      position: absolute;
      bottom: 5%;
      left: 50%;
      transform: translateX(-50%);
      color: white;
    }
  }
}
</style>
