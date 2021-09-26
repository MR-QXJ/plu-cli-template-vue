/* eslint-disable */
//echarts公共工具

/**
 * 初始化echarts
 * @param {String} id
 * @param {Object} option
 * @param {Function} clickEvent
 * @returns 创建的echarts实例
 */
export function initEchart(id, option, clickEvent) {
  let el = document.getElementById(id);
  if (!el) {
    return;
  }
  const em = echarts.init(el) || null;
  em && em.clear();

  em.setOption(option);

  em.off("click");
  clickEvent && em.on("click", clickEvent);

  return em;
}

/**
 * @desc 防抖函数,立即执行func,wait指定时间内调用不会再触发func而重新计时
 * @param func 目标函数
 * @param wait 延时
 */
export function debounce(func, wait) {
  let timer;
  return function() {
    if (timer) clearTimeout(timer);
    else func.apply(this, arguments);
    timer = setTimeout(() => {
      timer = null;
      func.apply(this, arguments);
    }, wait);
  };
}

/**
 * 创建echarts
 * @param {*} echarts echarts组件
 * @param {*} echart dom
 * @param {*} Xdata X轴数据
 * @param {*} data 数据
 */
export function initLineEcharts(Xdata, data, yAxisData, max) {
  return {
    xAxis: {
      type: "category",
      boundaryGap: false,
      name: "(月)",
      nameTextStyle: {
        color: "#666666"
      },
      axisLine: {
        lineStyle: {
          color: "#dadcde"
          // width: 2
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: "#666666",
        fontSize: 8,
        rotate: 30,
        interval: 0
      },
      data: Xdata.map(function(str) {
        return str.replace(" ", "\n");
      })
    },
    yAxis: {
      type: "value",
      name: `(${yAxisData.name ? yAxisData.name : "告警数"})`,
      splitNumber: 3,
      boundaryGap: false,
      max: max > 6 ? null : 6,
      nameTextStyle: {
        color: "#666666"
      },
      axisLine: {
        lineStyle: {
          color: "#dadcde",
          width: 2
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: "#666666",
        margin: 6
      }
    },
    tooltip: {
      show: true,
      position: ["40%", 10],
      trigger: "axis",
      extraCssText: "white-space:pre-wrap;font-size:12px",
      formatter: function(params) {
        let txt = params[0].name + "\n";
        txt += "数量：" + params[0].data;
        return txt;
      }
    },
    grid: {
      left: "15%",
      top: "20%",
      right: "15%",
      bottom: "25%"
    },
    series: [
      {
        data: data,
        type: "line",
        lineStyle: {
          color: "#4eb2ec"
        },
        itemStyle: {
          borderColor: "#4eb2ec"
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#9dcdf2" },
              { offset: 0.5, color: "#cbe2f7" },
              { offset: 1, color: "#f3f8fd" }
            ])
          }
        }
      }
    ]
  };
}
/**
 * 创建环形图echarts
 * @param {*} echarts echarts组件
 * @param {*} echart dom
 * @param {*} echartColor 环形图颜色
 * @param {*} data 数据
 */
export function initPieEcharts(echartColor, data) {
  return {
    color: echartColor,
    series: [
      {
        name: "",
        type: "pie",
        clickable: false,
        radius: ["60%", "80%"],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: "center"
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: "30",
              fontWeight: "bold"
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: data
      }
    ]
  };
}
