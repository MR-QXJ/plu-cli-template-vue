/*
 * 工具类（超图）
 */
import { SuperMap } from "@supermap/iclient-classic";
// 超图服务主机
// 贵港(内网)
// export const superMapServerHost = "http://222.218.31.31:82";
export const superMapServerHost = process.env.VUE_APP_SUPERMAPSERVERHOST;
// 平南
// export const superMapServerHost = "http://59.211.130.95:8090";

// 超图服务地址
export const superMapServerUrl = `${superMapServerHost}/iserver/services/map-GuiGang2DMapHTXT/rest/maps/GuiGang2DMap`;
// export const superMapServerUrl = `${superMapServerHost}/iserver/services/map-mongodb-GuiGangYX2DMap/rest/maps/GuiGang2DMap`;

// 超图服务地址匹配（正向）
export const superMapAddressGeoCodingUrl = `${superMapServerHost}/iserver/services/addressmatch-GuiGang2DMapHTXT/restjsr/v1/address`;

// 超图默认中心点
export const superMapDefCenter = [110.38751873999999, 23.541600600000002];

// 超图点样式
export function superMapPointStyle() {
  return {
    fillColor: "#f9120e",
    fillOpacity: 0,
    hoverFillColor: "white",
    hoverFillOpacity: 0.8,
    strokeColor: "#f9120e",
    strokeOpacity: 0,
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeDashstyle: "solid",
    hoverStrokeColor: "red",
    hoverStrokeOpacity: 1,
    hoverStrokeWidth: 0.2,
    pointRadius: 6,
    hoverPointRadius: 1,
    hoverPointUnit: "%",
    pointerEvents: "visiblePainted",
    cursor: "inherit"
  };
}

// 超图面样式
export function superMapPolygonStyle() {
  return {
    fillColor: "#f9120e",
    fillOpacity: 0.6,
    hoverFillColor: "white",
    hoverFillOpacity: 0.8,
    strokeColor: "#f9120e",
    strokeOpacity: 1,
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeDashstyle: "solid",
    hoverStrokeColor: "red",
    hoverStrokeOpacity: 1,
    hoverStrokeWidth: 0.2,
    pointRadius: 6,
    hoverPointRadius: 1,
    hoverPointUnit: "%",
    pointerEvents: "visiblePainted",
    cursor: "inherit",
    fontColor: "#ffffff",
    fontSize: "12px",
    labelAlign: "cm"
  };
}

// 超图绘制样式
export const superMapDrawStyle = {
  fillColor: "#f9120e",
  fillOpacity: 0.6,
  strokeColor: "#f9120e",
  strokeOpacity: 1,
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeDashstyle: "solid",
  pointRadius: 6,
  pointerEvents: "visiblePainted",
  cursor: "pointer",
  fontColor: "#ffffff",
  fontSize: "12px",
  labelAlign: "cm"
};
// 超图地址匹配过滤条件
export const superMapGeoCodingFilters = "平南县";

/**
 * 初始化地图
 * @param {String} id 容器id *
 * @param {Objecft} events 含有事件监听方法的对象
 * @param {Array} controls 含有初始化控件对象的数组
 */
export function initMap(id, events, controls = []) {
  return new SuperMap.Map(id, {
    eventListeners: {
      ...events
    },
    controls: [
      new SuperMap.Control.Navigation({
        dragPanOptions: {
          enableKinetic: true
        }
      }),
      ...controls
    ]
  });
}

/**
 * 初始化底图
 * @param {Object} map 超图实例 *
 * @param {Array} layers 其他图层
 * @param {Function} cb 初始化完成回调
 * @param {Array} center 中心点坐标，[x, y]
 * @param {Object} params 设置到url上的可选参数
 * @param {Object} props 其他TiledDynamicRESTLayer及其图层父类开放属性
 * @param {Number} zoom 中心点缩放,默认5
 */
export function initBaseLayer(
  map,
  layers = [],
  cb,
  center = superMapDefCenter,
  params = {},
  props = {},
  zoom = 10
) {
  const baseLayer = new SuperMap.Layer.TiledDynamicRESTLayer(
    "底图图层",
    superMapServerUrl,
    {
      cacheEnabled: true,
      ...params
    },
    {
      maxResolution: "auto", //图层实例化的时候设置图层最大的分辨率
      useCORS: true, // 允许跨域（截图）
      ...props
    }
  );

  const mapBaseLayerInited = () => {
    map.addLayers([baseLayer, ...layers]);
    map.setBaseLayer(baseLayer);

    // 设置中心点
    const [x, y] = center;
    map.setCenter(new SuperMap.LonLat(x, y), zoom);
    cb && cb();
  };
  baseLayer.events.on({
    layerInitialized: mapBaseLayerInited
  });
  return baseLayer;
}

/**
 * 创建撒点图层
 */
export function initMarkLayer() {
  const markLayer = new SuperMap.Layer.Markers("撒点图层");

  return markLayer;
}

/**
 * 初始化要素绘制控件
 * @param {Object} map 超图实例
 * @param {Object} drawLayer 矢量图层实例
 * @param {String} handlerType 处理器属性key,如'Point'
 * @param {Function} cb 要素添加回调,参数为要素详情
 * @param {Boolean} clear 是否清空绘制，自定义撒点等仅获取位置数据不进行绘制需要设置为true
 * @param {Object} options SuperMap.Control.DrawFeature其他配置
 */
export function drawFeature(
  map,
  drawLayer,
  handlerType,
  cb,
  clear,
  ...options
) {
  const hander = SuperMap.Handler;
  const drawF = new SuperMap.Control.DrawFeature(
    drawLayer,
    hander[handlerType],
    ...options
  );
  const mapDrawCompleted = evt => {
    //要素添加(通过activate方法开始并点击地图一处后触发)
    clear && drawLayer.removeAllFeatures();
    cb && cb(evt.feature);
  };
  drawF.events.on({ featureadded: mapDrawCompleted });
  map.addControl(drawF);
  return drawF;
}

/**
 * 创建矢量图层
 * @param {Object} options 矢量图层配置项
 * @param {Object} style 图层样式
 */
export function initDrawLayer(options = {}, style) {
  const drawLayer = new SuperMap.Layer.Vector("矢量图层", { ...options });
  drawLayer.style = style || superMapPolygonStyle();

  return drawLayer;
}

/**
 * 添加撒点
 * @param {Array} marks 撒点数据,每一项的属性：coord* '110.38751873999999,23.541600600000002'; size: new SuperMap.Size(30, 30); icon: require('../assets/imgs/pub/point.png')
 * @param {Object} markLayer 撒点图层实例
 * @param {Function} cb 点击撒点回调；可调用createInfoWindow创建点击信息框,此时marks每一项还要满足createInfoWindow的参数m
 */
export function addMaker(marks, markLayer, cb) {
  if (!marks.length) return;
  const markers = [];
  marks.map(m => {
    const coord = m.coord.split(",");
    const size = m.size || new SuperMap.Size(36, 36);
    const offset = new SuperMap.Pixel(-(size.w / 2), -size.h);
    const icon = new SuperMap.Icon(
      m.icon || require("../assets/img/other/point.png"),
      size,
      offset
    );
    const marker = new SuperMap.Marker(
      new SuperMap.LonLat(coord[0], coord[1]),
      icon
    );
    // 添加marker事件，点击创建信息框
    const markerClick = () => {
      cb && cb(marker, m);
    };
    //撒点点击
    marker.events.on({
      click: markerClick
    });

    markLayer.addMarker(marker);
    markers.push(marker);
  });
  return markers;
}
