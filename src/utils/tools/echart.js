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

//公共options
//tooptip配置
export function tooltip(option = {}) {
  return {
    formatter: "{b}: {c} ({d}%)", //b - name, c - value, d - percent
    backgroundColor: "white",
    padding: 10,
    extraCssText: "box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.09);",
    textStyle: {
      fontSize: "12px",
      color: "#23272e"
    },
    ...option
  };
}

//渐变色
export function LinearGradientItem(from, to) {
  return new echarts.graphic.LinearGradient(
    0,
    0,
    0,
    1, //位置(右,下,左,上)
    //三种由深及浅的颜色
    [
      {
        offset: 0,
        color: from
      },
      {
        offset: 1,
        color: to
      }
    ]
  );
}

//配置yAxis的刻度
export function setAxisScale(max) {
  let maxScale =
    max !== undefined && max !== null && max !== "null" && max !== ""
      ? Number(max)
      : 5;
  //null取值最大，如果传maxScale可能不均分
  return maxScale >= 5 ? null : 5;
}

//图表配置,根据项目需求修改
//饼图
export function getPieOption(pieData, options) {
  return {
    color: ["#ffbf60", "#36CBCB"], //随机从其中取，若要精准指定每项颜色使用itemStyle.color的function方式根据索引设置,
    title: {
      text: "标题",
      textStyle: {
        fontSize: 16,
        color: "#676772",
        fontWeight: "normal"
      },
      left: "center",
      bottom: "10%"
    },
    legend: {
      orient: "vertical",
      right: "0",
      top: "3%",
      type: "scroll"
    },
    tooltip: tooltip(),
    series: [
      {
        type: "pie",
        center: ["50%", "50%"], //中心点位置
        radius: ["0", "50%"], //半径
        data: pieData,
        emphasis: {
          //高亮
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, .7)"
          }
        }
        //导线
        // labelLine: {
        //   length: 18,
        //   length2: 0
        // }
        // label: false //隐藏label
      }
    ],
    ...options
  };
}

//柱状图
export function getBarOption(xAxisData, yAxisData, options) {
  return {
    grid: { left: 20, right: 20, bottom: 20, top: 20, containLabel: true },
    legend: { orient: "vertical", right: "0", top: "3%", type: "scroll" },
    tooltip: tooltip({ trigger: "axis" }),
    xAxis: {
      type: "category",
      data: xAxisData, //网格线
      splitLine: { lineStyle: { type: "dashed" } }, // 坐标轴线
      axisLine: {
        show: false
      }, // 刻度线
      axisTick: { show: false }
    },
    yAxis: {
      type: "value", //坐标轴线
      axisLine: { show: false }, // 刻度线
      axisTick: { show: false }, //网格线
      splitLine: { lineStyle: { type: "dashed" } }
    },
    series: [
      {
        type: "bar",
        data: yAxisData,
        barWidth: 45,
        itemStyle: { color: "#00DBF2" }
      }
    ],
    ...options
  };
}

//折线图
export function getLineOption(xAxisData, yAxisData, options) {
  return {
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: "#41baa9",
          type: "dashed"
        },
        type: "line"
      },
      backgroundColor: "#e6f6f5",
      extraCssText: "box-shadow: 0 0 8px rgba(5, 30, 60, 0.4);",
      textStyle: {
        color: "#666666",
        fontSize: 12
      },
      padding: [12, 20, 12, 15],
      trigger: "axis",
      position: function(pos, params, dom, rect, size) {
        let left = pos[0] - size.contentSize[0] * 0.5;
        left = left < 0 ? pos[0] : left;
        left =
          left + size.contentSize[0] > size.viewSize[0] - 50
            ? pos[0] - size.contentSize[0]
            : left;
        return [left, "10%"];
      },
      formatter: function(params) {
        const html = [];
        html.push(`<span style="font-size: ${16}px;">${params[0].name}</span>`);
        html.push(`<br />`);
        params.map(item => {
          html.push(`${item.marker}&nbsp;`);
          html.push(`<span>${item.seriesName}</span>`);
          html.push(
            `<span style="color: #ff9d0a; margin-left: 14px">${item.data}</span>`
          );
          html.push(`<br />`);
        });
        return html.join("");
      }
    },
    grid: {
      left: "5%",
      right: "12%",
      bottom: "4%",
      top: "20%",
      containLabel: true
    },
    xAxis: {
      axisLabel: {
        color: "#666",
        fontSize: 13,
        interval: 0
      },
      axisLine: {
        lineStyle: {
          color: "#666",
          width: 2
        }
      },
      axisTick: {
        show: false
      },
      type: "category",
      data: xAxisData
    },
    yAxis: {
      name: "坐标轴名称",
      nameTextStyle: {
        color: "#666",
        fontSize: 13,
        align: "center",
        padding: [0, 0, 0, 60]
      },
      axisLabel: {
        color: "#666"
      },
      axisLine: {
        lineStyle: {
          color: "#666",
          width: 2
        }
      },
      axisTick: {
        show: false
      },
      // splitLine: {
      //   lineStyle: {
      //     color: "#f60"
      //   }
      // },
      type: "value"
    },
    series: [
      {
        name: "数量",
        type: "line",
        data: yAxisData,
        smooth: true, //弧线
        itemStyle: {
          color: "#9c6766"
        },
        areaStyle: {
          color: LinearGradientItem("#AECF7E", "#38A0D6")
        },
        symbol: "none",
        symbolSize: 5
      }
    ],
    ...options
  };
}
