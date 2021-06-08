import { GUID } from "@/utils/tool";
import { SuperMap } from "@supermap/iclient-classic";

export const superMapServerHost = "https://zhxf.bbwyun.com:82";

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
    fillColor: "#f9120e", //填充色
    fillOpacity: 0.6, //填充不透明度
    hoverFillColor: "white",
    hoverFillOpacity: 0.8,
    strokeColor: "#f9120e", //描边色
    strokeOpacity: 1, //描边不透明度
    strokeWidth: 2, //描边宽度
    strokeLinecap: "round", //线头类型，默认round，还有square，butt
    strokeDashstyle: "solid", //线类型dot,dash,dashdot,longdash,longdashdot,solid(默认)
    hoverStrokeColor: "red",
    hoverStrokeOpacity: 1,
    hoverStrokeWidth: 0.2,
    pointRadius: 6, //像素点半径
    hoverPointRadius: 1,
    hoverPointUnit: "%",
    pointerEvents: "visiblePainted",
    cursor: "inherit",
    fontColor: "#ffffff",
    fontSize: "12px",
    labelAlign: "cm" //标签对其,第一个字母: l-left,c-center,r-right.第二个字母:t-top,m-middle,b-bottom
  };
}
//超图绘制样式
export function superMapDrawStyle() {
  return {
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
}

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
      new SuperMap.Control.Zoom(),
      new SuperMap.Control.Navigation({
        dragPanOptions: {
          enableKinetic: true
        }
      }),
      ...controls
    ]
  });
}

//图层
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
  zoom = 5
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
      useCORS: true,	// 允许跨域（截图）
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
 * 创建撒点图层
 */
export function initMarkLayer() {
  const markLayer = new SuperMap.Layer.Markers("撒点图层");

  return markLayer;
}

//控件
/**
 * 初始化要素选择控件
 * @param {Object} map 超图实例
 * @param {Object} drawLayer 矢量图层实例
 * @param {Object} cbs 点击等回调配置对象
 * @param {Object} options 其他配置项
 */
export function selectFeature(map, drawLayer, cbs, options = {}) {
  // 选择绘制(指定的的图层上通过鼠标单击和悬浮选择矢量要素,如撒点)
  const select = new SuperMap.Control.SelectFeature(drawLayer, {
    callbacks: {
      ...cbs
    },
    // 是否重复点击
    repeat: true,
    ...options
  });
  map.addControl(select);
  select.activate(); //激活要素选择控件
  return select;
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
 * 初始化编辑矢量要素控件
 * @param {Object} map 超图实例
 * @param {Object} drawLayer 矢量图层实例
 */
export function modifyFeature(map, drawLayer) {
  const editDraw = new SuperMap.Control.ModifyFeature(drawLayer);
  const mapDrawPolygonModifyCompleted = evt => {
    if (evt.modified) {
      const polygonPoints = [];
      evt.feature.geometry.components[0].components.map(point => {
        polygonPoints.push({
          x: point.x,
          y: point.y
        });
      });
      console.log(polygonPoints);
    }
  };
  editDraw.events.on({
    afterfeaturemodified: mapDrawPolygonModifyCompleted
  });
  map.addControl(editDraw);
  return editDraw;
  // editDraw.activate()   //激活
  // editDraw.deactivate() //销毁
  // editDraw.redo() //恢复操作
  // editDraw.undo() //撤销操作
}

/**
 * 添加撒点
 * @param {Array} marks 撒点数据,每一项属性示例,带*必须有：coord* '110.38751873999999,23.541600600000002'; size: new SuperMap.Size(30, 30); icon: require('assets/imgs/pub/point.png')
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
      m.icon || require("assets/imgs/pub/point.png"),
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

/**
 * 创建撒点弹窗
 * @param {Object} map 超图实例
 * @param {Object} marker 当前撒点实例
 * @param {Object} m 撒点数据, 弹窗必须要这些属性：key: 唯一标识; descArr: 结构见infoWindowHtml;
 */
export function createInfoWindow(map, marker, m) {
  const closeId = `supermap-infowindow-close${m.key}`;
  const html = infoWindowHtml(m.descArr || [], closeId);
  //创建固定锚点位置的的浮动弹窗
  const infoWindow = new SuperMap.Popup.Anchored(
    `point${m.key}`, //弹窗唯一标识
    marker.lonlat, //弹窗位置
    null, // new SuperMap.Size(220, 140),	//弹窗内容大小
    html, //弹窗内容html字符串
    marker.icon, //弹窗锚点，包含一个大小信息 SuperMap.Size 和偏移信息 SuperMap.Size 的对象。(一般为 SuperMap.Icon 类型)
    false, //显示关闭按钮
    null //关闭按钮事件回调
  );
  infoWindow.autoSize = true; //自适应弹窗宽高
  //设置背景色
  infoWindow.setBackgroundColor("rgba(255,255,255,1)");
  // 添加自定义信息框
  map.addPopup(infoWindow);
  marker.infoWindow = infoWindow; //将弹窗对象挂载到对应maker方便清除

  // 添加自定义信息框关闭事件
  const domClose = document.getElementById(closeId);
  if (domClose) {
    const closeEvent = () => {
      clearInfoWindow(marker);
    };
    domClose.removeEventListener("click", closeEvent);
    domClose.addEventListener("click", closeEvent);
  }
  return;
}

/**
 * 获取弹窗html
 * @param {Arrar} descArr 弹窗信息,数组每项的name和value属性构建信息框; type:string: 为title为弹窗标题(只要一个为title)
 */
export function infoWindowHtml(descArr, closeId) {
  const htmlArr = [];
  htmlArr.push("<div class='supermap-infowindow-content'>");
  descArr.map(i => {
    if (i.type == "title") {
      htmlArr.push(
        `<div class='row head' title='${i.value}'><span>${i.value}</span></div>`
      );
    } else {
      htmlArr.push(
        `<div class='row'><span class='title'>${i.name}：</span><span title='${i.value}'>${i.value}</span></div>`
      );
    }
  });
  htmlArr.push(`<div class="row bottom" id="${closeId}">关闭</div>`);
  htmlArr.push("</div>");
  return htmlArr.join("");
}

/**
 * 获取可编辑文本html
 * @param {Array} data 文本框信息， 包含属性：key-唯一标识; text-初始文本内容
 * @param {String} closeId 关闭按钮id
 */
export function editTextHtml(data, closeId, inputId) {
  const htmlArr = [];
  const text = data.text || "请输入文字";

  htmlArr.push("<div class='supermap-textedit-content'>");
  htmlArr.push(`<input type="text" value="${text}" id="${inputId}" />`);
  htmlArr.push(
    `<a class="close" title="关闭" id="${closeId}"><span class="icon iconfont iconclose">X</span></a>`
  );
  htmlArr.push("</div>");
  return htmlArr.join("");
}

/**
 * 清空自定义撒点
 * @param {Array} markers 撒点实例数组
 * @param {Object} markLayer 撒点图层
 */
export function clearMarker(markers, markLayer) {
  if (!markers) return;
  markers.forEach(mk => {
    markLayer.removeMarker(mk);
    mk.infoWindow && clearInfoWindow(mk);
  });
  markers = null;
}
/**
 * 清除撒点弹窗
 * @param {Object} mk 带有弹窗对象的撒点实例
 */
export function clearInfoWindow(mk) {
  const infoWindow = mk.infoWindow;
  if (!infoWindow) return;
  //只有infoWindow.hide()有用，infoWindow.show()无效，每次只能销毁和创建...........
  infoWindow.destroy();
  mk.infoWindow = null;
}

//REST
/**
 * 初始化量算服务
 * @param {Boolean} isDistance 距离还是面积
 * @param {Object} geo SuperMap.Geometry类型几何对象：距离是SuperMap.Geometry.LineString，面积是SuperMap.Geometry.Polygon
 * @param {Function} isDistance 服务端返回量算结果回调
 */
export function createMeasureSvr(isDistance, geo, cb) {
  const myMeasuerService = new SuperMap.REST.MeasureService(superMapServerUrl);
  const measureCompleted = args => {
    cb && cb(args);
  };

  const modeStr = isDistance ? "DISTANCE" : "AREA";
  myMeasuerService.events.on({ processCompleted: measureCompleted });
  // 测量模式,当判断出是LineString时设置MeasureMode.DISTANCE(距离)，否则是MeasureMode.Area(面积)
  myMeasuerService.measureMode = SuperMap.REST.MeasureMode[modeStr];
  const measureParam = new SuperMap.REST.MeasureParameters(geo);
  // processAsync负责将客户端的量算参数传递到服务端
  myMeasuerService.processAsync(measureParam);
}

//策略
/**
 * 创建标签渲染策略
 */
export function initTextSty(options, style) {
  const testSty = new SuperMap.Strategy.GeoText(...options);
  testSty.style = style || superMapDrawStyle();
  return testSty;
}

//示例整合： vm为vue组件实例，会为组件data中定义相关数据保存超图创建的实例

//点击撒点
export function clickAddMarker(id, vm) {
  vm.smap = initMap(id);
  vm.drawLayer = initDrawLayer();
  vm.markLayer = initMarkLayer();
  vm.baseLayer = initBaseLayer(vm.smap, [vm.drawLayer, vm.markLayer]);

  vm.mapDrawPoint = drawFeature(
    vm.smap,
    vm.drawLayer,
    "Point",
    f => {
      const geo = f.geometry;
      const mark = {
        coord: `${geo.x},${geo.y}`
      };
      clearMarker(vm.markers, vm.markLayer);
      vm.markers = addMaker([mark], vm.markLayer);
    },
    true
  );
}

//根据数据撒点(marker方式: 自定义图标)并创建点击弹窗
// 示例数据
// const markData = [
//   { key: "id1", coord: "110.38416383175,23.536161129632", descArr: [{type: 'title', value: '广西南城第三中学'}, {type: '', name: '地址', value: '平南街道二环大道816号'}, {type: '', name: '电话', value: '07757860173'}] },
//   { key: "id2", coord: "110.24612955917,23.275241314091", descArr: [{type: 'title', value: '广西南城百货有限责任公司平南分公司'}, {type: '', name: '地址', value: '平南镇朝阳路中心广场地下负二层'}, {type: '', name: '电话', value: '07752795222'}] }
//];
export function addMarkerByData(id, vm, markData) {
  vm.smap = initMap(id);
  vm.drawLayer = initDrawLayer();
  vm.markLayer = initMarkLayer();
  vm.baseLayer = initBaseLayer(vm.smap, [vm.drawLayer, vm.markLayer]);

  clearMarker(vm.markers, vm.markLayer);
  vm.markers = addMaker(markData, vm.markLayer, (marker, m) => {
    //点击撒点创建弹窗
    const curWindow = marker.infoWindow;
    if (curWindow) {
      return clearInfoWindow(marker);
    }
    createInfoWindow(vm.smap, marker, m);
  });
}

//根据数据撒点(vector方式: 统计数字 + hover变色 + 提示)
// 示例数据
// const pointData = [
//   { label: "1", name: "平南街道二环大道816号", coord: "110.38416383175,23.536161129632" },
//   { label: "2", name: "平南镇朝阳路中心广场地下负二层", coord: "110.24612955917,23.275241314091" }
// ];
export function addVectorPoints(id, vm, pointData) {
  vm.smap = initMap(id);
  vm.drawLayer = initDrawLayer();
  vm.baseLayer = initBaseLayer(vm.smap, [vm.drawLayer]);
  //撒点添加
  pointData.map(item => {
    const coord = item.coord.split(",");
    const point = new SuperMap.Geometry.Point(coord[0], coord[1]);
    const style = {
      fontColor: "#fff",
      fontSize: "12px",
      label: item.label + "",
      labelAlign: "cm",
      pointRadius: 15,
      strokeColor: "#3b41c5",
      strokeWidth: 1,
      fillColor: "#a981bb"
    };
    const feature = new SuperMap.Feature.Vector(point);
    feature.data = JSON.parse(JSON.stringify(item));
    feature.style = style;
    vm.drawLayer && vm.drawLayer.addFeatures(feature);
  });
  vm.selectLabel = selectFeature(vm.smap, vm.drawLayer, {
    click(f) {
      console.log(f, "点击触发");
    }
  }, { 
    hover: true, //hover: true使点击无效仅hover生效
    onSelect(feature) {
      clearInfoWindow();
      // 选中要素操作
      feature.style.fillColor = "#20E2D7";
      vm.drawLayer.redraw(); //重新设置颜色后重新绘制
      const contentHTML = `<div style='width:max-content;padding:8px;color:black;font-size:12px;border:1px solid #ccc'>${
        feature.data.name
      }</div>`;
      vm.infoWindow = new SuperMap.Popup.Anchored(
        "chicken",
        new SuperMap.LonLat(
          feature.data.coord.split(",")[0],
          feature.data.coord.split(",")[1]
        ),
        null,
        contentHTML,
        new SuperMap.Icon(
          "",
          new SuperMap.Size(1, 1),
          new SuperMap.Pixel(0, -2)
        ),
        false,
        null
      );
      vm.infoWindow.autoSize = true;
      vm.smap.addPopup(vm.infoWindow);
    },
    onUnselect(feature) {
      clearInfoWindow();
      if (feature.data.isSelected) {
        return;
      } else {
        // 未选中要素操作
        feature.style.fillColor = "#a981bb";
        vm.drawLayer.redraw();
      }
    },
  }) 

  //清除弹窗
  function clearInfoWindow() {
    const w = vm.infoWindow;
    if (w) {
      w.destroy();
      vm.infoWindow = null;
    }
  }
}

//绘制多边形
export function drawPolygon(id, vm) {
  vm.smap = initMap(id);
  vm.drawLayer = initDrawLayer();
  vm.baseLayer = initBaseLayer(vm.smap, [vm.drawLayer]);

  vm.mapDrawPolygon = drawFeature(
    vm.smap,
    vm.drawLayer,
    "Polygon",
    f => {
      //获得图层几何对象（保存绘制成功的点）
      const geometry = f.geometry;
      const polygonPoints = [];
      const root = geometry.components[0];
      root.components.map(point => {
        polygonPoints.push({
          x: point.x,
          y: point.y
        });
      });
      console.log(polygonPoints);
      vm.mapDrawPolygon.deactivate();
    },
    false
  );
}

//距离测算线
export function distanceLine(id, vm) {
  vm.smap = initMap(id);
  vm.drawLayer = initDrawLayer();
  vm.baseLayer = initBaseLayer(vm.smap, [vm.drawLayer]);
  vm.labelCollection = vm.labelCollection || [];
  vm.distanceLabels = vm.distanceLabels || [];
  vm.drawDisLine = drawFeature(
    vm.smap,
    vm.drawLayer,
    "Path",
    f => {
      const ft = f;
      const key = GUID();
      ft.data.key = key; //添加唯一key
      ft.data.type = "distancecal";
      // vm.distanceLines.push(ft);//保存要素对象，方便通过绘制图层的removeFeatures方法清除
      vm.distanceLabelsCal = [];
      vm.distanceTotal = 0;
      // 获得图层几何对象
      const geometry = ft.geometry;
      const root = geometry.components[0];
      if (!root) {
        return;
      }
      const l = root.components.length;
      if (l < 2) {
        return;
      }
      vm.labelCollection.push(0);
      let i = 0;
      for (i = 0; i < l; i++) {
        if (i === l - 1) {
          return;
        }
        // 开始点结束点
        const points = [
          new SuperMap.Geometry.Point(
            root.components[i].x,
            root.components[i].y
          ),
          new SuperMap.Geometry.Point(
            root.components[i + 1].x,
            root.components[i + 1].y
          )
        ];
        const line = new SuperMap.Geometry.LineString(points);
        createMeasureSvr(true, line, measureRes => {
          const distance = parseFloat(measureRes.result.distance.toFixed(2));
          vm.distanceTotal += distance;
          const points = JSON.parse(
            measureRes.object.options.params.point2Ds.replace(/'/g, '"')
          );
          const style = superMapDrawStyle();
          style.fontColor = "#ff3300";
          style.labelAlign = "rt";
          // 添加每段长度标签
          const point = new SuperMap.Geometry.Point(points[1].x, points[1].y);
          const label = new SuperMap.Feature.Vector(point);
          label.style = style;
          label.style.label = `${distance}米`;
          label.data.key = key;
          label.data.type = "distancecal";
          vm.drawLayer.addFeatures(label);
          vm.distanceLabels.push(label);
          vm.distanceLabelsCal.push({
            point: point,
            label: label
          });
          vm.labelCollection[vm.labelCollection.length - 1] += 1;
          if (vm.distanceLabelsCal.length === 1) {
            // 第一个添加起点标签
            const pointStart = new SuperMap.Geometry.Point(
              root.components[0].x,
              root.components[0].y
            );
            const label = new SuperMap.Feature.Vector(pointStart);
            const labelStyle = superMapDrawStyle();
            labelStyle.fontColor = "#ff3300";
            labelStyle.labelAlign = "rb";
            labelStyle.label = "起点";
            label.style = labelStyle;
            label.data.key = key;
            label.data.type = "distancecal";
            vm.drawLayer.addFeatures(label);
            vm.distanceLabels.push(label);
            vm.labelCollection[vm.labelCollection.length - 1] += 1;
          }
          if (vm.distanceLabelsCal.length === l - 1) {
            // 更新最后一个标签显示总长度
            vm.distanceLabelsCal.map(item => {
              if (
                item.point.x === root.components[l - 1].x &&
                item.point.y === root.components[l - 1].y
              ) {
                item.label.style.label = `${
                  item.label.style.label
                }，共${vm.distanceTotal.toFixed(2)}米`;
                vm.drawLayer.redraw();
              }
            });
          }
        });
      }
    },
    false,
    { multi: true }
  );
  //vm.drawDisLine.activate()激活
}

//面积测算(多边形)
export function measureArea(id, vm) {
  vm.smap = initMap(id);
  vm.drawLayer = initDrawLayer();
  vm.baseLayer = initBaseLayer(vm.smap, [vm.drawLayer]);
  vm.mapAreaLabels = vm.mapAreaLabels || [];
  vm.mapLabelCollection = vm.mapLabelCollection || [];
  vm.areaMeasure = drawFeature(
    vm.smap,
    vm.drawLayer,
    "Polygon",
    f => {
      const ft = f;
      const key = GUID();
      ft.data.key = key; //添加唯一key
      ft.data.type = "areacal";
      // 获得图层几何对象
      const geometry = ft.geometry;
      const root = geometry.components[0];
      if (!root) {
        return;
      }
      createMeasureSvr(false, geometry, (measureRes) => {
        const area = measureRes.result.area;
        console.log(measureRes);
        const points = JSON.parse(
          measureRes.object.options.params.point2Ds.replace(/'/g, '"')
        );
        const style = superMapDrawStyle();
        style.fontColor = "#ff3300";
        style.labelAlign = "rt";
        // 添加面积标签
        const point = new SuperMap.Geometry.Point(points[0].x, points[0].y);
        const label = new SuperMap.Feature.Vector(point);
        label.style = style;
        label.style.label = `${area.toFixed(2)}平方米`;
        label.data.key = key;
        label.data.type = "areacal";
        vm.drawLayer.addFeatures(label);
        vm.mapAreaLabels.push(label);
        vm.mapLabelCollection[vm.mapLabelCollection.length - 1] += 1;
      })
    },
  );
  //vm.areaMeasure.activate()激活
}

//绘制矩形
export function drawRect(id, vm) {
  vm.smap = initMap(id);
  vm.drawLayer = initDrawLayer();
  vm.baseLayer = initBaseLayer(vm.smap, [vm.drawLayer]);
  vm.drawRect = drawFeature(vm.smap, vm.drawLayer, "Box", rect => {
    const geometry = rect.geometry;
    const points = [];
    points.push(new SuperMap.Geometry.Point(geometry.x, geometry.y));
    points.push(
      new SuperMap.Geometry.Point(geometry.x + geometry.width, geometry.y)
    );
    points.push(
      new SuperMap.Geometry.Point(
        geometry.x + geometry.width,
        geometry.y + geometry.height
      )
    );
    points.push(
      new SuperMap.Geometry.Point(
        geometry.x,
        geometry.y + geometry.height
      )
    );
    //通过点坐标绘制图形,可通过多个点绘制任意地图区域
    points.push(new SuperMap.Geometry.Point(geometry.x, geometry.y));
    const linearRings = new SuperMap.Geometry.LinearRing(points);
    const polygon = new SuperMap.Geometry.Polygon([linearRings]);
    const style = superMapDrawStyle();
    const newrect = new SuperMap.Feature.Vector(polygon, null, style);
    vm.drawLayer.removeFeatures(rect);  //删除绘制控件生成的默认矩形，再自定义设置后添加
    vm.drawLayer.addFeatures(newrect);

  })
  // vm.drawRect.activate() 激活
}

//绘制圆形
export function drawCircular(id, vm) {
  vm.smap = initMap(id);
  vm.drawLayer = initDrawLayer();
  vm.baseLayer = initBaseLayer(vm.smap, [vm.drawLayer]);
  vm.drawCircular = drawFeature(vm.smap, vm.drawLayer, "RegularPolygon", cir => {
    const circular = cir;
    const style = superMapDrawStyle();
    circular.style = style;
    vm.drawLayer.removeFeatures(cir);  //删除默认圆形，再自定义设置后添加
    vm.drawLayer.addFeatures(circular);

  }, false, { handlerOptions: { sides: 50 } })
  //vm.drawCircular.activate() 激活
}

//绘制带箭头的线
export function arrLine(id, vm) {
  vm.smap = initMap(id);
  vm.drawLayer = initDrawLayer();
  vm.baseLayer = initBaseLayer(vm.smap, [vm.drawLayer]);
  vm.arrLine = drawFeature(vm.smap, vm.drawLayer, "Path", line => {
    // 删除绘制的线
    const removeLine = line => {
      vm.drawLayer.removeFeatures(line);
    };
    // 获得图层几何对象
    const geometry = line.geometry;
    const root = geometry.components[0];
    const l = root.components.length;
    if (!root || l < 2) {
      removeLine(line);
      return;
    }
    
    // 绘制箭头线
    const Arrow = lineString => {
      const linepoints = lineString.components;
      const endPoint1 = linepoints[linepoints.length - 1];
      const endPoint2 = linepoints[linepoints.length - 2];
      const midPointX = endPoint2.x + 0.9 * (endPoint1.x - endPoint2.x);
      const midPointY = endPoint2.y + 0.9 * (endPoint1.y - endPoint2.y);
      const midPoint1 = new SuperMap.Geometry.Point(midPointX, midPointY);
      const midPoint2 = new SuperMap.Geometry.Point(midPointX, midPointY);
      // 在线上9/10的位置取一点连接直线末端做两条相同的短直线
      const points2 = [midPoint1, endPoint1];
      const rightLine = new SuperMap.Geometry.LineString(points2);
      rightLine.rotate(15, endPoint1);
      // 此为直线旋转，旋转角度可自由调节
      const points3 = [midPoint2, endPoint1];
      const leftLine = new SuperMap.Geometry.LineString(points3);
      leftLine.rotate(345, endPoint1);
      // 分别旋转两条短直线于lineString两侧，构成一个箭头样式
      const multiLineString = new SuperMap.Geometry.MultiLineString([
        lineString,
        rightLine,
        leftLine
      ]);
      const arrowLine = new SuperMap.Feature.Vector(multiLineString);
      const style = superMapDrawStyle();
      arrowLine.style = style;
      removeLine(line);
      vm.drawLayer.addFeatures(arrowLine);
    };
    Arrow(root);

  }, false, { multi: true })

  // vm.arrLine.activate() 激活
}

//绘制文字(基于点绘制)
export function drawTextPoint(id, vm) {
  const strategy = new SuperMap.Strategy.GeoText()
  strategy.style = superMapDrawStyle();
  strategy.style.fontColor = "#ff3300";

  vm.smap = initMap(id);
  vm.drawLayer = initDrawLayer({
    strategies: [strategy]
  });
  vm.baseLayer = initBaseLayer(vm.smap, [vm.drawLayer]);
  selectFeature(vm.smap, vm.drawLayer, {
    click(f) {
      console.log('点击文字重新编辑');
      clearTextEdit(vm);
      addTextEdit(vm, f);
    }
  })
  vm.mapTexts = vm.mapTexts || [];

  vm.drawTextPoint = drawFeature(vm.smap, vm.drawLayer, "Point", p => {
    // 获得图层几何对象
    const geometry = p.geometry;
    const coord = `${geometry.x},${geometry.y}`;
    const data = {
      key: GUID(),
      coord: coord
    };
    vm.drawLayer.removeFeatures(p)
    addText(vm, coord, data)
    vm.drawTextPoint.deactivate();
  })
  //vm.drawTextPoint.activate() 激活
}
// 根据坐标和数据添加文字标签
export function addText(vm, coordStr, data) {
  const coord = coordStr.split(",");
  const text = data.text || "请输入文字";
  const geoText = new SuperMap.Geometry.GeoText(coord[0], coord[1], text);
  const feature = new SuperMap.Feature.Vector(geoText);
  feature.data = JSON.parse(JSON.stringify(data));
  feature.data.text = text;
  feature.data.type = "text";
  vm.drawLayer.addFeatures(feature);
  //存放便于清除
  vm.mapTexts.push({ key: data.key, text: feature });
  addTextEdit(vm, feature);
}
// 创建可输入的文字标签
export function addTextEdit(vm, feature) {
  clearTextEdit(vm);
  const data = feature.data || {};
  const key = data.key || "";
  const closeId = `supermap-textedit-close${key}`;
  const inputId = `supermap-textedit-input${key}`;
  
  const html = editTextHtml(data, closeId, inputId);

  let coord = (data.coord || ",").split(",");
  const lonlat = new SuperMap.LonLat(coord[0], coord[1]);
  const size = new SuperMap.Size(0, 0);
  const offset = new SuperMap.Pixel(0, 0);
  const icon = new SuperMap.Icon(null, size, offset);
  vm.textWindow = new SuperMap.Popup.Anchored(
    `textEdit${data.key}`,
    lonlat,
    null,
    html,
    icon,
    false,
    null
  );
  vm.textWindow.autoSize = true;
  vm.textWindow.setBackgroundColor("rgba(255,255,255,0)");
  // 添加自定义信息框
  vm.smap.addPopup(vm.textWindow);
  // 添加自定义信息框输入回车事件
  const domInput = document.getElementById(inputId);
  if (domInput) {
    const enterEvent = e => {
      const theEvent = window.event || e;
      const code = theEvent.keyCode || theEvent.which || theEvent.charCode;
      if (code == 13) {
        const data = JSON.parse(JSON.stringify(feature.data));
        data.text = domInput.value;
        removeTextByKey(data.key, vm);
        addText(vm, data.coord, data);
        clearTextEdit(vm);
      }
    };
    domInput.removeEventListener("keydown", enterEvent);
    domInput.addEventListener("keydown", enterEvent);
  }
  // 添加自定义信息框关闭事件
  const domClose = document.getElementById(closeId);
  if (domClose) {
    const closeEvent = () => {
      clearTextEdit(vm);
    };
    domClose.removeEventListener("click", closeEvent);
    domClose.addEventListener("click", closeEvent);
  }
}
// 删除文字通过key
export function removeTextByKey(key, vm) {
  let removeIndex = -1;
  vm.mapTexts.map((textObj, index) => {
    if (textObj.key === key) {
      vm.drawLayer.removeFeatures(textObj.text);
      removeIndex = index;
    }
  });
  if (removeIndex !== -1) {
    vm.mapTexts.splice(removeIndex, 1)
  }
}
// 删除上一个文字框
export function clearTextEdit(vm) {
  const textW = vm.textWindow
  if (textW) {
    textW.destroy();
    vm.textWindow = null;
  }
}

//地址匹配
export function addressMatch(vm) {
  vm.addrMatchSvr = new SuperMap.REST.AddressMatchService(
    superMapAddressGeoCodingUrl,//匹配服务地址
    { data: "11" }	//可选参数
  );

  const geoCodeParam = new SuperMap.GeoCodingParameter({
    address: "地址",  //匹配关键字
    fromIndex: 0,
    toIndex: 99,
    maxReturn: 100,
    prjCoordSys: "{epsgcode: 4326}",
  })

  //匹配成功回调
  const matchCb = (m) => {
    const res = [];
    m.result.map((item) => {
      res.push({
        unitName: item.address,
        coord: `${item.location.x},${item.location.y}`,
        filters: item.filters.join(","),
      });
    });
    console.log(res);
  }
  vm.addrMatchSvr.code(geoCodeParam, matchCb)
}