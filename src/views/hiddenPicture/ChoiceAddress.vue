<template>
  <div class="c-adr w100 h100">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      :title="
        selectPoint && selectPoint.address ? selectPoint.address : '选择位置'
      "
      :border="false"
      left-text="返回"
      right-text="确定"
      left-arrow
      @click-left="$emit('hidePopup')"
      @click-right="affirmAddress"
    />
    <div class="search-input">
      <van-search
        v-model="fuzzyWord"
        show-action
        label="地址"
        placeholder="请输入搜索关键词"
        @search="addressMatching"
      >
        <template #action>
          <div @click="addressMatching">搜索</div>
        </template>
      </van-search>
    </div>
    <div class="map-container">
      <div id="allmap" class="w100 h100"></div>
    </div>
    <div class="search-list">
      <div
        :class="[
          'point-item',
          selectPoint && selectPoint.id === item.id ? 'select' : ''
        ]"
        v-for="(item, index) in pointList"
        :key="index"
        @click="setPoint(item)"
      >
        {{ item.address }}
        <img src="../../assets/img/other/point.png" alt="" />
      </div>
    </div>
  </div>
</template>
<script>
import {
  superMapServerUrl,
  superMapAddressGeoCodingUrl,
  superMapPointStyle
} from "@/utils/tool-supermap";
export default {
  props: {
    pointList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
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
      mapDrawLayer: null,
      // 超图描点绘制对象
      mapDrawPoint: null,
      // 超图选择要素对象
      mapSelect: null,
      // 超图描点点对象
      mapMarkerCoord: null,
      // 超图最后一次描点对象
      mapLastFeature: null,
      //超图所有描点数据
      mapMarkers: [],
      // 地点模糊词
      fuzzyWord: "",
      // 节流timer
      timer: null,
      mapAddressMatchService: null,
      selectPoint: {
        location: null,
        address: null,
        id: null
      }
    };
  },
  methods: {
    // 地址模糊匹配
    addressMatching() {
      if (this.timer !== null) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        // 搜索地址事件
        if (!this.fuzzyWord) {
          return;
        }
        const params = new SuperMap.GeoCodingParameter({
          address: this.fuzzyWord,
          fromIndex: 0,
          toIndex: 30,
          maxReturn: 50,
          prjCoordSys: "{epsgcode: 4326}"
        });
        const geoCodingMatch = obj => {
          this.pointList = [];
          let ids = [];
          // let points;
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
        };
        this.mapAddressMatchService.code(params, geoCodingMatch);
      }, 500);
    },
    //确定地址
    affirmAddress() {
      this.$emit("getConfirmAddress", this.selectPoint);
    },
    mapInit() {
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
        // 创建撒点图层
        this.mapMarkerLayer = new SuperMap.Layer.Markers("撒点图层");
        this.$emit("getMapMarkerLayer", this.mapMarkerLayer);
        // 创建绘制图层
        this.mapDrawLayer = new SuperMap.Layer.Vector("绘制图层");
        this.mapDrawLayer.style = JSON.parse(
          JSON.stringify(superMapPointStyle())
        );
        // 添加图层
        this.map.addLayers([
          this.mapBaseLayer,
          this.mapMarkerLayer,
          this.mapDrawLayer
        ]);
        this.map.setBaseLayer(this.mapBaseLayer);
        // 绘制点
        this.mapDrawPoint = new SuperMap.Control.DrawFeature(
          this.mapDrawLayer,
          SuperMap.Handler.Point
        );
        const mapDrawPointCompleted = evt => {
          this.mapLastFeature &&
            this.mapDrawLayer.removeFeatures([this.mapLastFeature]);

          if (this.mapMarkerCoord) {
            this.mapMarkerLayer.removeMarker(this.mapMarkerCoord);
            this.mapMarkerCoord = null;
            this.clearMapInfoWindow();
          }
          this.mapLastFeature = evt.feature;
          const geometry = this.mapLastFeature.geometry;
          const coord = `${geometry.x},${geometry.y}`;
          this.addCurrMarkerHandle({ coord, address: "" }, false);
        };
        this.mapDrawPoint.events.on({ featureadded: mapDrawPointCompleted });
        this.map.addControl(this.mapDrawPoint);
        this.mapDrawPoint.deactivate();

        // 添加服务
        this.mapAddressMatchService = new SuperMap.REST.AddressMatchService(
          superMapAddressGeoCodingUrl,
          { data: "11" }
        );
        this.$emit("getMapMatchService", this.mapAddressMatchService);
        // 设置中心点
        // 县政府
        const x = 110.38751873999999;
        const y = 23.541600600000002;

        this.map.setCenter(new SuperMap.LonLat(x, y), 5);
        // 底图图层初始化完成
        this.mapBaseLayerInited = true;
      };
      this.mapBaseLayer.events.on({
        layerInitialized: mapBaseLayerInited
      });
      this.$emit("mapInitEnd", this.map);
    },
    setPoint(item) {
      if (this.mapMarkerCoord) {
        this.mapMarkerLayer.removeMarker(this.mapMarkerCoord);
        this.mapMarkerCoord = null;
      }
      let center = new SuperMap.LonLat(item.location.x, item.location.y);
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
        new SuperMap.LonLat(item.location.x, item.location.y),
        icon
      );
      this.mapMarkerCoord = mapMarkerCoord;
      this.mapMarkerLayer.addMarker(mapMarkerCoord);
      this.selectPoint = item;
    }
  },
  mounted() {
    this.mapInit();
  }
};
</script>
<style lang="scss" scoped>
.c-adr {
  overflow: hidden;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  /deep/.search-input {
    .van-search__content {
      align-items: center;
    }
    /deep/.van-cell {
      display: flex;
      align-items: center;
    }
  }
  .van-nav-bar {
    background: #0e41a6;
    /deep/.van-nav-bar__title {
      color: #fff;
    }
    /deep/.van-icon {
      color: #fff;
    }
    /deep/.van-nav-bar__text {
      color: #fff;
    }
  }

  .map-container {
    height: 270px;
    width: 100%;
  }
  .search-list {
    flex: 1;
    background: #fff;
    overflow-y: auto;
    .point-item {
      height: 60px;
      padding: 0 30px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
      &.select {
        background: #efefef;
      }
      img {
        width: 24px;
        height: 24px;
      }
    }
  }
}
</style>
