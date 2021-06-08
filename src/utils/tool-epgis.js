/* global epgis */
// 思极地图账号
export const epmapKey = "ed385cd934853a0da45815f21be32c9f";
export const epmapSN = "fd075f56c9c4351f97262b689159fb7d";

// 思极地图默认中心点
export const epMapDefCenter = [108.94327000000001, 34.338660000000004];

// 思极地图地址匹配过滤条件
export const epMapSearchPlaceFilters = "陕西省";

/**
 * 地图服务登录
 * @param {Function}} callback 登录成功回调
 */
export function epLogin(callback) {
  epgis.tokenTask.login(epmapKey, epmapSN).then(function() {
    callback && callback();
  });
}

/**
 * 初始化地图
 * @param {String} container 容器id
 * @param {Number} zoom 默认缩放
 * @param {Array} center 中心点
 * @param {Function} cb 地图初始渲染完成回调
 */
export function initMap(container, zoom, center = epMapDefCenter, cb) {
  //创建地图，
  const map = new epgis.Map({
    container,
    style: "aegis://styles/aegis/Streets", //指定底图样式: 这是标准底图(适合pc) 还有栅格版(适合移动端),卫星影像版
    zoom,
    center,
    localIdeographFontFamily: "Microsoft YoHei" //默认字体
  });
  cb && map.on("load", cb);
  //添加比例尺控件, 第二个参数： 'top-left' 'top-right' 'bottom-left' 'bottom-right'
  map.addControl(
    new epgis.ScaleControl({
      maxWidth: 80, //比例尺显示的最大长度px
      unit: "metric" //距离单位 metric-米
    })
  );
  return map;
}

/**
 * 添加marker
 * @param {Object} map 地图实例
 * @param {Array} coord 经纬度坐标
 * @param {Object} options marker配置
 */
export function addMarker(
  map,
  coord,
  className,
  options = { anchor: "bottom" }
) {
  const mkDom = document.createElement("div");
  mkDom.className = className; //必须在marker创建前添加class，自定义样式的同时让其内部进行区分，否则撒点位置会偏移

  const marker = new epgis.Marker(mkDom, options);
  marker.setLngLat(coord).addTo(map); //添加到地图
  marker.getElement(); //获取撒点的html元素,方便添加事件和dom操作
  return marker;
}

/**
 * 自定义信息弹窗
 * @param {Object} target 目标实例： 地图实例-直接addTo到地图,需要自定义点击显示隐藏   marker实例-与marker绑定(setPopup)点击marker自动显示隐藏,不用传coord
 * @param {Array} coord 经纬度坐标
 * @param {String} html 弹窗内容字符串
 * @param {Object} options popup配置项
 */
export function addPop(target, coord, html, options) {
  const infoWin = new epgis.Popup({
    // 是否显示关闭按钮
    closeButton: false,
    // 是否单击地图关闭信息框
    closeOnClick: false,
    ...options
    // className: "自定义class",//方便自定义样式
    // offset: { //弹窗相对于点像素偏移
    //   bottom: [x, y]
    // }
  });
  infoWin.setHTML(html);
  if (target.addControl) {
    //说明是地图实例
    infoWin.setLngLat(coord).addTo(target);
  } else {
    //绑定到marker上不用再setLngLat设置坐标
    target.setPopup(infoWin);
  }

  return infoWin;

  //直接addTo到地图上: infoWin.remove()移除
  //setPopup绑定到marker的：通过marker.getPopup()获取绑定的popup, marker.setPop(undefined/null)永久销毁, marker.remove()移除
  //infoWin.getElement()或infoWin._content获取弹窗内容dom元素 绑定到marker上getElement获取不到
}

// 示例数据
// const coords = [
//   [108.64151588900154, 35.05296758835911],
//   [108.64158026201852, 35.052827062553504],
//   [108.64294818861566, 35.05160184294091]
// ];
/**
 * 绘制线条(不可编辑)
 * @param {Object} map 地图实例
 * @param {String} id 唯一标识
 * @param {Array[]} coordinates 二维数组，多个点坐标描述线条
 * @param {Object} layout 线条布局配置
 * @param {Object} paint 线条样式配置
 */
export function addLine(map, id, coordinates, layout = {}, paint = {}) {
  map.addLayer({
    id, //图层唯一标识
    type: "line",
    source: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates //多个点坐标描述线条
            }
          }
        ]
      }
    },
    layout: {
      //线末端样式，butt-方形(默认，仅绘制到端点) round-圆形(超出端点线宽1/2) square-方形(超出端点线宽1/2)
      "line-cap": "round",
      //线交叉时样式,miter-尖形交角(默认) round-圆型交点 bevel-方型交点
      "line-join": "round",
      ...layout
    },
    paint: {
      "line-color": "#f60", //线条颜色
      "line-width": 10, //线宽 - px
      "line-opacity": 0.8, //线不透明度
      ...paint
    }
  });
}

/**
 * 绘制线条标注
 * @param {Object} map 地图实例
 * @param {String} id 唯一标识
 * @param {Array[]} coordinates 二维数组，多个点坐标描述线条
 * @param {String} name 标注文字
 * @param {Object} layout 标注布局配置
 * @param {Object} paint 标注样式配置
 */
export function addLineTag(
  map,
  id,
  coordinates,
  name,
  layout = {},
  paint = {}
) {
  map.addLayer({
    id,
    type: "symbol",
    source: {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates //多个点坐标描述要标注的线条
            },
            properties: {
              name
            }
          }
        ]
      }
    },
    layout: {
      "text-font": ["Microsoft YaHei Regular"], //标注字体
      "symbol-placement": "line", //标注相对于几何要素的位置, line-边线上 point-点上(默认)
      "text-ignore-placement": true, //其他注记碰到此文本标注是否会显示
      "text-field": "{name}", //设置标注的字段，对应properties内的属性值将作为标注
      "text-size": 12, //字体大小 - px
      "text-allow-overlap": true, //此文本标注碰到其他注记是否显示
      "text-max-width": 50, //文本换行的最大宽 - px
      "text-anchor": "top", //文本停靠到点的位置
      ...layout
    },
    paint: {
      "text-color": "#fc6766", //文本颜色
      "text-halo-color": "#ffffff", //文本光晕颜色
      "text-halo-width": 1.33333, //光晕离字体轮廓的距离，最大为字体大小1/4
      ...paint
    }
  });
}

/**
 * 画线(可编辑)
 * @param {Object} map 地图实例
 * @param {String} id 标识
 * @param {Array[]} coordinates 二维数组，多个坐标描述线条
 * @param {Object} option DrawPolylineHandler配置项
 */
export function addPolyLine(map, id, coordinates, option = {}) {
  const drawPolyline = new epgis.DrawPolylineHandler({
    map,
    enableEdit: true,
    featuresList: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates
        },
        properties: {
          id
        }
      }
    ],
    drawColor: "#68a1e7",
    editColor: "#fcc25d",
    ...option
  });
  return drawPolyline;
}

/**
 * 删除图层
 * @param {Object} map 地图实例
 * @param {String} layerId 图层唯一标识
 */
export function removeLayer(map, layerId) {
  map.getLayer(layerId) && map.removeLayer(layerId);
}

/**
 * 删除数据源
 * @param {Object} map 地图实例
 * @param {String} sourceId 数据源唯一标识
 */
export function removeSource(map, sourceId) {
  map.getSource(sourceId) && map.removeSource(sourceId);
}

/**
 * 地址匹配
 * @param {String} query 匹配字段
 * @param {Function} callback 搜索回调
 */
export function addrMatch(query, callback) {
  query.trim && (query = query.trim());
  if (!query) return;
  //PlaceSearchTask创建关键字查询服务
  const placeSearchTask = new epgis.PlaceSearchTask();
  placeSearchTask
    .searchPlace({
      query,
      region: epMapSearchPlaceFilters, //搜索行政区名，配合cityLimit限制此区域内查询
      cityLimit: true,
      pageIndex: 1, //起始页码(默认1)
      pageSize: 30, //返回数量(默认10)
      isEncode: false //数据是否编码,编码后坐标不能直接使用
    })
    .then(result => {
      const resAddr = [];
      result.pois.map(item => {
        resAddr.push({
          address: item.text,
          coord: item.center,
          filters: item.place_name
        });
      });
      callback && callback(resAddr);
    });
}
