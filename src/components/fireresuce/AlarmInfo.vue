<template>
  <div class="w100 h100 alarminfo">
    <div class="h100 left">
      <panel-part title="报警信息" height="49%">
        <template slot="content">
          <div class="w100 h100 content-info">
            <div v-for="(item, index) in infoList" :key="index">
              <label>{{ item.name }}：</label>
              <span>{{ item.value }}</span>
              <div v-if="!index" class="navigate">导航</div>
            </div>
          </div>
        </template>
      </panel-part>
      <panel-part title="警情要点" height="49%">
        <template slot="content"
          ><div class="w100 h100 content-info">
            <div v-for="(item, index) in pointList" :key="index">
              <label>{{ item.name }}：</label>
              <span>{{ item.value }}</span>
            </div>
          </div>
        </template>
      </panel-part>
    </div>
    <div class="h100 right">
      <panel-part height="100%">
        <template slot="content">
          <div class="w100 h100 alarm-content">
            <div class="w100 h100  content-map">
              <div class="w100 h100 map" id="allmap"></div>
            </div>
          </div>
        </template>
      </panel-part>
    </div>
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
import panelPart from "@/components/pub/PanelPart.vue";
import {
  getFireAlarmInfoByUser,
  getIsFireAlarmByUser,
  getCarSelect,
  getFireAlarmInfo,
  getFireAlarmId
} from "@/utils/api";
import {
  dataIsNullNumber,
  dataIsNullStr,
  dataIsNullObj,
  dataIsNullArray,
  clearArray,
  showConfirm,
  showToast
} from "@/utils/tool";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      infoList: [],
      pointList: [],
      //单位名称
      unitName: "",
      //搜索loading
      searchLoading: false,
      //搜索单位结果
      searchUnitList: [],
      //已绑定车辆Id
      bindVehicleId: "",

      // 超图对象
      map: null,
      // 超图底图图层对象
      mapBaseLayer: null,
      // 超图底图图层是否初始化完成
      mapBaseLayerInited: false,
      // 超图信息框对象
      mapInfoWindow: null,
      // 超图撒点图层对象
      mapMarkerLayer: null,
      // 超图绘制图层对象
      mapVectorLayer: null,
      // 超图绘制圆形对象
      mapDrawCircular: null,

      // 超图描点绘制对象
      mapDrawPoint: null,
      // 超图选择要素对象
      mapSelect: null,
      // 超图描点点对象
      mapMarkerCoord: null,
      // 超图描点点对象-当前自己的位置
      mapCurrMarkerCoord: null
    };
  },
  components: {
    "panel-part": panelPart
  },
  computed: {
    ...mapGetters(["fireAlarmId", "fireAlarmInfo", "geoPosition"])
  },
  watch: {
    geoPosition(nv, ov) {
      if (nv && nv != ov) {
        this.addMarkerMine(nv);
      }
    }
  },
  methods: {
    ...mapActions(["setFireAlarmId", "setFireAlarmInfo", "setNavMenu"]),
    //查询是否已绑定车辆
    isBindVehicleHandle: function() {
      getCarSelect().then(res => {
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullArray(res.data);
          let isbind = data.filter(i => i.state == 1);
          if (isbind.length) {
            //已绑定
            this.bindVehicleId = isbind[0].key;
            this.isFireAlarmHandle();
          } else {
            //未绑定
            showConfirm("您未绑定车辆，是否现在去绑定？", () => {
              this.setNavMenu("/vehiclemanagement");
              this.$emit("getCurrentNavMenu");
              this.$router.push("/vehiclemanagement");
            });
          }
        }
      });
    },
    //查询用户是否有警情任务
    isFireAlarmHandle: function() {
      getIsFireAlarmByUser().then(res => {
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullStr(res.data);
          if (data == 1) {
            //有任务，但是未开始
            showConfirm("当前有参战任务，是否开始参战？", () => {
              //有任务,开始参战
              this.addFireAlarm();
            });
          } else if (data == 2) {
            //任务进行中
            this.searchWarningHandle();
          } else {
            //无任务
            showToast("当前没有有参战任务");
            this.setFireAlarmId("");
          }
        }
      });
    },
    //加入参战,获取警情id
    addFireAlarm: function() {
      this.clearMarkerHandle();
      getFireAlarmInfoByUser().then(res => {
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullObj(res.data);
          const alarmId = dataIsNullStr(data.key);
          console.log(data, "alarmInfo");
          if (JSON.stringify(data) != "{}") {
            this.setFireAlarmId(alarmId);
            this.setFireAlarmInfo(data);
            this.$nextTick(() => {
              this.addMarkerHandle(
                `${dataIsNullStr(data.lonBaidu)},${dataIsNullStr(
                  data.latBaidu
                )}`
              );
            });
          }

          clearArray(this.infoList);
          clearArray(this.pointList);
          this.infoList.push(
            {
              name: "单位名称",
              value: dataIsNullStr(data.unitName)
            },
            {
              name: "警情地址",
              value: dataIsNullStr(data.address)
            },
            {
              name: "报警人",
              value: dataIsNullStr(data.alarmPeople)
            },
            {
              name: "报警电话",
              value: dataIsNullStr(data.alarmCall)
            }
          );
          this.pointList.push(
            {
              name: "起火部位",
              value: dataIsNullStr(data.firePlace)
            },
            {
              name: "起火物质",
              value: dataIsNullStr(data.fireMaterial)
            },
            {
              name: "被困人员",
              value: dataIsNullStr(data.trappedPerson) + "人"
            },
            {
              name: "危险物质",
              value: dataIsNullStr(data.riskMatter)
            }
          );

          this.$emit("uploadGPS", {
            vehicleId: this.bindVehicleId,
            alarmId: alarmId
          });
        }
      });
    },
    //参战中，直接查询警情信息
    searchWarningHandle: function() {
      getFireAlarmId().then(res => {
        const code = dataIsNullNumber(res.code);
        if (code == 0) {
          const data = dataIsNullStr(res.data);
          getFireAlarmInfo({ alarmId: data }).then(res => {
            const code = dataIsNullNumber(res.code);
            if (code == 0) {
              const data = dataIsNullObj(res.data);
              if (JSON.stringify(data) != "{}") {
                this.setFireAlarmInfo(data);
                this.$nextTick(() => {
                  this.addMarkerHandle(
                    `${dataIsNullStr(data.lonBaidu)},${dataIsNullStr(
                      data.latBaidu
                    )}`
                  );
                });
              }
              clearArray(this.infoList);
              clearArray(this.pointList);
              this.infoList.push(
                {
                  name: "单位名称",
                  value: dataIsNullStr(data.unitName)
                },
                {
                  name: "警情地址",
                  value: dataIsNullStr(data.address)
                },
                {
                  name: "报警人",
                  value: dataIsNullStr(data.alarmPeople)
                },
                {
                  name: "报警电话",
                  value: dataIsNullStr(data.alarmCall)
                }
              );
              this.pointList.push(
                {
                  name: "起火部位",
                  value: dataIsNullStr(data.firePlace)
                },
                {
                  name: "起火物质",
                  value: dataIsNullStr(data.fireMaterial)
                },
                {
                  name: "被困人员",
                  value: dataIsNullStr(data.trappedPerson) + "人"
                },
                {
                  name: "危险物质",
                  value: dataIsNullStr(data.riskMatter)
                }
              );
            }
          });
          this.$emit("uploadGPS", {
            vehicleId: this.bindVehicleId,
            alarmId: data
          });
        }
      });
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
    // 撒点
    addMarkerHandle: function(coordStr) {
      if (!this.mapBaseLayerInited) {
        return;
      }
      this.clearMarkerHandle();
      // 撒点
      const coord = coordStr.split(",");
      const size = new SuperMap.Size(48, 48);
      const offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
      const icon = new SuperMap.Icon(
        require(`../../assets/img/fireresuce/fire.gif`),
        size,
        offset
      );
      this.mapMarkerCoord = new SuperMap.Marker(
        new SuperMap.LonLat(coord[0], coord[1]),
        icon
      );
      this.mapMarkerLayer.addMarker(this.mapMarkerCoord);
    },
    // 清空撒点
    clearMarkerHandle: function() {
      if (this.mapMarkerCoord) {
        this.mapMarkerLayer.removeMarker(this.mapMarkerCoord);
        this.mapMarkerCoord = null;
      }
    },
    // 清空撒点-当前定位
    clearCurrMarkerHandle: function() {
      if (this.mapCurrMarkerCoord) {
        this.mapMarkerLayer.removeMarker(this.mapCurrMarkerCoord);
        this.mapCurrMarkerCoord = null;
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
          cacheEnabled: true
        },
        {
          maxResolution: "auto"
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
          3
        );
        // 底图图层初始化完成
        this.mapBaseLayerInited = true;
      };
      this.mapBaseLayer.events.on({
        layerInitialized: mapBaseLayerInited
      });
    }
  },
  mounted() {
    this.initMap();
    this.isBindVehicleHandle();
  },
  destroyed() {
    this.map && this.map.destroy();
    this.map = null;
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/common.scss";
.alarminfo {
  @include flex;
  .left {
    flex: 1.2;
    @include flex;
    @include flex-column;
    @include flex-primary-axis-between;
    .content-info {
      padding: px2rem(30px);
      @include flex;
      @include flex-column;
      @include flex-primary-axis-around;
      font-size: px2rem(24px);
      color: #01edf3;
      div {
        @include flex;
        @include flex-secondary-axis-center;
        position: relative;
        label {
          width: px2rem(120px);
        }
        span {
          max-width: calc(100% - 2.5rem);
          @include text-ellipsis;
        }
        &:first-child {
          span {
            max-width: calc(100% - 3.1rem);
          }
        }
        .navigate {
          position: absolute;
          right: 0;
          font-size: px2rem(16px);
          color: #091220;
          padding: px2rem(4px) px2rem(16px);
          border-radius: px2rem(11px);
          background: #01edf3;
        }
      }
    }
  }
  .right {
    flex: 5.56;
    margin-left: px2rem(38px);
    .alarm-content {
      padding: px2rem(50px);
      position: relative;
    }
  }
}
</style>
