/*
 * 工具类
 */

import { imgAccept, iconAccept } from "@/utils/global";

/*
 * 生成GUID（UUID）
 * @param
 */
export function GUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    // eslint-disable-next-line
    const r = Math.random() * 16 | 0;
    // eslint-disable-next-line
    const v = c == "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/*
 * 保留小数（四舍五入）
 * @param value 值
 * @param digit 位数
 */
export function numRound(value, digit = 2) {
  return value.toFixed(digit);
}

/*
 * 判断字符串数据是否为空
 * @param data 数据
 * @param def 默认值
 */
export function dataIsNullStr(data, def = "") {
  return data !== undefined && data !== null && data !== "null" ? data : def;
}

/*
 * 判断数字数据是否为空
 * @param data 数据
 * @param def 默认值
 */
export function dataIsNullNumber(data, def = 0) {
  return data !== undefined && data !== null && data !== "null" && data !== ""
    ? data
    : def;
}

/*
 * 判断布尔型数据是否为空
 * @param data 数据
 * @param def 默认值
 */
export function dataIsNullBool(data, def = false) {
  return data !== undefined && data !== null && data !== "null" ? data : def;
}

/*
 * 判断对象数据是否为空
 * @param data 数据
 * @param def 默认值
 */
export function dataIsNullObj(data, def = {}) {
  return data !== undefined && data !== null && data !== "null" && data !== ""
    ? data
    : def;
}

/*
 * 判断数组数据是否为空
 * @param data 数据
 * @param def 默认值
 */
export function dataIsNullArray(data, def = []) {
  return data !== undefined && data !== null && data !== "null" && data !== ""
    ? data
    : def;
}

/*
 * 转换数据字典代码或列表代码
 * @param data 数据
 * @param keys 参数名
 */
export function transformCodeSelect(data, keys) {
  const codes = [];
  data.map(code => {
    const label = dataIsNullStr(code[keys[1]]);
    codes.push({
      code: dataIsNullStr(code[keys[2]]),
      value: dataIsNullStr(code[keys[0]]),
      label: label,
      title: label
    });
  });
  return codes;
}

/*
 * 转换数据字典代码或列表树代码
 * @param data 数据
 * @param keys 参数名
 */
export function transformCodeTreeSelect(data, keys) {
  const codes = [];
  data.map(code => {
    const key = dataIsNullStr(code[keys[0]]);
    codes.push({
      key: key,
      value: key,
      title: dataIsNullStr(code[keys[1]]),
      label: dataIsNullStr(code[keys[1]])
    });
  });
  return codes;
}

/*
 * 转换数据字典代码或树代码
 * @param data 数据
 * @param keys 参数名
 * @param needLoadData 需要异步加载
 */
export function transformCodeTree(data, keys, needLoadData = true) {
  const nodes = [];
  data.map(code => {
    let guid = GUID();
    guid = guid.replace(/-/g, "");
    const key = dataIsNullStr(code[keys[0]]);
    const node = {
      key: `${guid}|${key}`,
      code: dataIsNullStr(code["code"]),
      title: dataIsNullStr(code[keys[1]]),
      isLeaf: needLoadData ? false : true,
      realKey: key,
      // 角色管理功能权限设置是否勾选权限
      isLink: dataIsNullNumber(code[dataIsNullStr(keys[2])], 0),
      // 是否是根节点的树
      isRootTree: dataIsNullNumber(code[dataIsNullStr(keys[2])])
    };
    if (code["pKey"]) {
      node.pKey = dataIsNullStr(code["pKey"]);
    }
    nodes.push(node);
  });
  return nodes;
}

/*
 * 递归加载所有树节点
 * @param data 数据
 * @param pKey 父key
 */
export function deepLoadChildNodesTree(data, pKey = "0") {
  const nodes = [];
  data.map(nodeData => {
    if (dataIsNullStr(nodeData.pKey) === pKey) {
      const realKey = dataIsNullStr(nodeData.realKey);
      const children = deepLoadChildNodesTree(data, realKey);
      const treeNodeData = {
        key: dataIsNullStr(nodeData.key),
        pKey: dataIsNullStr(nodeData.pKey),
        title: dataIsNullStr(nodeData.title),
        realKey: realKey,
        // 角色管理功能权限设置是否勾选权限
        isLink: dataIsNullNumber(nodeData.isLink, 0)
      };
      if (children.length === 0) {
        treeNodeData.isLeaf = true;
      } else {
        treeNodeData.children = children;
        treeNodeData.isLeaf = false;
      }
      nodes.push(treeNodeData);
    }
  });
  return nodes;
}

/*
 * 递归加载所有列表树节点
 * @param data 数据
 * @param pKey 父key
 */
export function deepLoadChildNodesTreeSelect(data, pKey = "0") {
  const nodes = [];
  data.map(nodeData => {
    if (dataIsNullStr(nodeData.pKey) === pKey) {
      const key = dataIsNullStr(nodeData.key);
      const children = deepLoadChildNodesTreeSelect(data, key);
      const treeNodeData = {
        value: dataIsNullStr(nodeData.key),
        label: dataIsNullStr(nodeData.title)
      };
      if (children.length > 0) {
        treeNodeData.children = children;
      }
      nodes.push(treeNodeData);
    }
  });
  return nodes;
}

/*
 * 获取表格树子记录
 * @param data 数据
 * @param pKey 父key
 */
export function getChildrenTableTree(data, pKey = "0") {
  const children = [];
  data.map(rowData => {
    if (dataIsNullStr(rowData.pKey) === pKey) {
      children.push(rowData);
    }
  });
  return children;
}

/*
 * 插入数组
 * @param arr 数组
 * @param index 开始索引
 * @param data 插入数据
 */
export function insertArray(arr, index, data) {
  arr.splice(index, 0, data);
}

/*
 * 清空数组（删除索引及索引之后）
 * @param arr 数组
 * @param index 开始索引
 */
export function clearArray(arr, index = 0) {
  arr.splice(index, arr.length - index);
}

/*
 * 清空数组
 * @param arr 数组
 * @param index 开始索引
 * @param count 个数
 */
export function clearArrayCount(arr, index = 0, count = 1) {
  arr.splice(index, count);
}

/*
 * json数组排序
 * @param arr 数组
 * @param attrName 排序属性名
 * @param isAsc 正序
 */
export function jsonArraySort(arr, attrName, isAsc = true) {
  if (attrName) {
    const sortByAttr = (a, b) => {
      if (isAsc) {
        return a[attrName] - b[attrName];
      } else {
        return b[attrName] - a[attrName];
      }
    };
    return arr.sort(sortByAttr);
  } else {
    return isAsc ? arr : arr.reverse();
  }
}

/*
 * json数组去重
 * @param arr 数组
 * @param key 唯一属性名
 */
export function removeRepeatArray(arr, key) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    let flag = true;
    let temp = arr[i];
    for (let j = 0; j < result.length; j++) {
      // 普通数组 (temp === result[j])
      if (temp[key] === result[j][key]) {
        flag = false;
        break;
      }
    }
    if (flag) {
      result.push(temp);
    }
  }
  return result;
}

/*
 * 深度递归向上搜索
 * @param arr 你要搜索的数组
 * @param key 要搜索的key
 */
export function deepFindFamilyUp(arr, key) {
  /*
   * 深度递归搜索
   * @param {Array} arr 你要搜索的数组
   * @param {Function} condition 回调函数，必须返回谓词，判断是否找到了。会传入(item, index, level)三个参数
   * @param {String} children 子数组的key
   */
  const deepFind = (arr, condition, children) => {
    // 即将返回的数组
    let main = [];
    // 用try方案方便直接中止所有递归的程序
    try {
      // 开始轮询
      (function poll(arr, level) {
        // 如果传入非数组
        if (!Array.isArray(arr)) return;
        // 遍历数组
        for (let i = 0; i < arr.length; i++) {
          // 获取当前项
          const item = arr[i];
          // 先占位预设值
          main[level] = item;
          // 检验是否已经找到了
          // eslint-disable-next-line
          const isFind = condition && condition(item, i, level) || false;
          // 如果已经找到了
          if (isFind) {
            // 直接抛出错误中断所有轮询
            throw Error;
            // 如果存在children，那么深入递归
          } else if (children && item[children] && item[children].length) {
            poll(item[children], level + 1);
            // 如果是最后一个且没有找到值，那么通过修改数组长度来删除当前项
          } else if (i === arr.length - 1) {
            // 删除占位预设值
            main.length = main.length - 1;
          }
        }
      })(arr, 0);
      // 使用try/catch是为了中止所有轮询中的任务
    } catch (err) {
      // 异常
    }
    // 返回最终数组
    return main;
  };
  // (item, index, level) => item.key === key
  return deepFind(arr, item => item.key === key, "children");
}

/*
 * 深度递归向下搜索节点（选择区域树用）
 * @param arr 你要搜索的数组
 * @param key 要搜索的key
 * @param value 要搜索的值
 */
export function deepFindDown(arr, key, value) {
  let res = null;
  arr.map(item => {
    if (!res) {
      if (item[key] === value) {
        res = item;
      }
      const children = dataIsNullArray(item.children);
      if (children.length > 0) {
        res = deepFindDown(children, key, value);
      }
    }
  });
  return res;
}
/*
 * 深度递归向下搜索节点(拿到就返回)
 * @param arr 你要搜索的数组
 * @param key 要搜索的key
 * @param value 要搜索的值
 */
export function deepFindOnceDown(arr, key, value) {
  let res = null;
  arr.map(item => {
    if (!res) {
      if (item[key] === value) {
        res = item;
        return;
      }
      const children = dataIsNullArray(item.children);
      if (children.length > 0) {
        res = deepFindOnceDown(children, key, value);
      }
    }
  });
  return res;
}
/*
 * 日期格式化
 * @param date 日期
 * @param format 格式
 */
export function dateFormat(date, format) {
  if (date === null) {
    return date;
  }
  if (typeof date === "string") {
    return date;
  }
  const o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  };
  let result = format;
  if (/(y+)/.test(result)) {
    result = result.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let k = null;
  for (k in o) {
    if (new RegExp(`(${k})`).test(result)) {
      result = result.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      );
    }
  }
  return result;
}

/*
 * 转时间
 * @param time 时间
 */
export function strToTime(time) {
  if (typeof time === "object") {
    return time;
  }
  if (time.trim() === "") {
    return null;
  }
  return new Date(time);
}

/*
 * 转时间戳
 * @param time 时间
 */
export function strToTimestamp(time) {
  const value = strToTime(time || "");
  return value ? value.getTime() : 0;
}
/**
 *
 * 获取当前日期
 */
export function getNowDate(str = "") {
  let splitStr = str,
    splitY = "-",
    splitM = "-",
    splitD = "";
  if (splitStr == "年月日") {
    splitY = " " + splitStr[0] + " ";
    splitM = " " + splitStr[1] + " ";
    splitD = " " + splitStr[2];
  } else if (splitStr.length == 1) {
    splitY = splitStr[0];
    splitM = splitStr[0];
  }
  let date = new Date();
  let time = `${date.getFullYear()}${splitY}${date.getMonth() +
    1}${splitM}${date.getDate()}${splitD}`;

  return time;
}
//获取两个日期相差的天数
export function getDiffDayNum(day1, day2) {
  if (typeof day1 != "string" || typeof day2 != "string") {
    return;
  }
  if (!day1 || !day2) {
    return;
  }
  let diffDate =
    new Date(day1).getTime() / 1000 - new Date(day2).getTime() / 1000;
  let result = Math.abs(parseInt(diffDate / 60 / 60 / 24));
  return result;
}
// 获取两个日期时间的按周排列数组
export function getDateArrayByWeek(day1, day2) {
  let begin = day1,
    end = day2;
  let num = getDiffDayNum(begin, end) + 1; //一共多少天
  let integer = parseInt(num / 7); //有几个完整的周
  if (integer < 1) {
    //总时长不到7天，只有一周
    return [{ begin: day1, end: day2 }];
  } else {
    //总时长大于7天
    let dateB = new Date(begin);
    let dateE = new Date(end);
    //首周末尾时间，末周开始时间，开始周是不是周一，结束周是不是周日
    let firstWeekEnd,
      lastWeekBegin,
      isMondayStart = dateB.getDay() == 1 ? true : false,
      isSundayEnd = dateE.getDay() == 0 ? true : false;
    if (dateB.getDay() != 0) {
      // 不是周日开始的
      dateB.setDate(dateB.getDate() + (7 - dateB.getDay()));
    }
    if (dateE.getDay() == 0) {
      dateE.setDate(dateE.getDate() - 6);
    } else if (dateE.getDay() != 1) {
      dateE.setDate(dateE.getDate() - (dateE.getDay() - 1));
    }

    firstWeekEnd =
      dateB.getFullYear() +
      "-" +
      (dateB.getMonth() + 1) +
      "-" +
      dateB.getDate();

    lastWeekBegin =
      dateE.getFullYear() +
      "-" +
      (dateE.getMonth() + 1) +
      "-" +
      dateE.getDate();

    let result = [];
    result.push({
      begin,
      end: firstWeekEnd
    });
    // 第一周前空余的天数加最后一周空余的天数是否超过7天，超过七天integer则多加了一天
    let tempB = new Date(begin),
      tempE = new Date(end),
      tempBool;
    if (tempB.getDay() != 0 && tempE.getDay() != 0) {
      if (tempB.getDay() - 1 + (7 - tempE.getDay()) <= 7) {
        tempBool = true;
      } else {
        tempBool = false;
      }
    }
    let count =
      isMondayStart && isSundayEnd
        ? integer - 2
        : isMondayStart || isSundayEnd
        ? integer - 1
        : tempBool
        ? integer - 1
        : integer;
    // console.log(count);
    for (let i = 0; i < count; i++) {
      let rangeBaseB = new Date(firstWeekEnd),
        rangeBaseE = new Date(firstWeekEnd);
      rangeBaseB.setDate(rangeBaseB.getDate() + 7 * i + 1);
      rangeBaseE.setDate(rangeBaseE.getDate() + 7 * i + 7);
      result.push({
        begin:
          rangeBaseB.getFullYear() +
          "-" +
          (rangeBaseB.getMonth() + 1) +
          "-" +
          rangeBaseB.getDate(),
        end:
          rangeBaseE.getFullYear() +
          "-" +
          (rangeBaseE.getMonth() + 1) +
          "-" +
          rangeBaseE.getDate()
      });
    }
    result.push({ begin: lastWeekBegin, end: end });

    return result;
  }
}
/*
 * 验证图片类型
 * @param type 图片类型
 */
export function checkImageType(type) {
  let right = false;
  const types = imgAccept.split(",");
  types.map(item => {
    if (type === item) {
      right = true;
    }
  });
  return right;
}

/*
 * 验证图标类型
 * @param type 图标类型
 */
export function checkIconType(type) {
  let right = false;
  const types = iconAccept.split(",");
  types.map(item => {
    if (type === item) {
      right = true;
    }
  });
  return right;
}

/*
 * 验证图片大小
 * @param size 图片大小
 * @param limit 图片限制大小
 */
export function checkImageSize(size, limit = 2) {
  return size / 1024 / 1024 < limit;
}

/*
 * 验证文件大小
 * @param size 文件大小
 * @param limit 图片限制大小
 */
export function checkFileSize(size, limit = 50) {
  return size / 1024 / 1024 < limit;
}

/*
 * 读取图片为base64
 * @param file 文件
 * @param loaded 成功回调函数
 * @param loadfailed 失败回调函数
 */
export function getImageBase64(file, loaded, loadfailed) {
  // 读取图片转换为base64代码
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      if (loaded) {
        loaded(e.target.result);
      }
    };
    reader.onerror = () => {
      if (loadfailed) {
        loadfailed("获取图片失败");
      }
    };
    reader.readAsDataURL(file, "UTF-8");
  }
}

/*
 * 校验上传图片
 * @param file 文件
 * @param callback 回调函数
 */
export function checkUploadImg(file, callback) {
  let allow = true;
  const isLimitType = imgAccept.indexOf(file.type) !== -1;
  if (!isLimitType) {
    const msgType = imgAccept.replace(/image\//g, "");
    const msg = `请选择${msgType}类型的图片`;
    if (callback) {
      callback(msg);
    } else {
      alert(msg);
    }
    allow = false;
  }
  const isLimit5M = file.size < 5 * 1024 * 1024;
  if (!isLimit5M) {
    const msg = "请选择小于5MB的照片";
    if (callback) {
      callback(msg);
    } else {
      alert(msg);
    }
    allow = false;
  }
  return allow;
}

//金额
export function outputmoney(number) {
  if (isNaN(number) || number == "") return "0";
  number = Math.round(number * 100) / 100;
  if (number < 0)
    return (
      "-" +
      outputdollars(Math.floor(Math.abs(number) - 0) + "") +
      outputcents(Math.abs(number) - 0)
    );
  else
    return outputdollars(Math.floor(number - 0) + "") + outputcents(number - 0);
}
//格式化金额
function outputdollars(number) {
  if (number.length <= 3) return number == "" ? "0" : number;
  else {
    var mod = number.length % 3;
    var output = mod == 0 ? "" : number.substring(0, mod);
    for (let i = 0; i < Math.floor(number.length / 3); i++) {
      if (mod == 0 && i == 0)
        output += number.substring(mod + 3 * i, mod + 3 * i + 3);
      else output += "," + number.substring(mod + 3 * i, mod + 3 * i + 3);
    }
    return output;
  }
}
//格式化小数点
function outputcents(amount) {
  amount = Math.round((amount - Math.floor(amount)) * 100);
  return amount < 10 ? ".0" + amount : "." + amount;
}

//格式化城市联动
export function formatCascader(arr) {
  let res = [];
  arr.map(item => {
    const data = {
      label: item.name,
      value: item.name,
      key: item.code
    };
    if (item.children) {
      const child = formatCascader(item.children);
      if (child.length) {
        data.children = child;
      }
    }

    res.push(data);
  });
  return res;
}
// 金额转大写
export function digitUppercase(n) {
  var fraction = ["角", "分"];
  var digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  var unit = [
    ["元", "万", "亿"],
    ["", "拾", "佰", "仟"]
  ];
  var head = n < 0 ? "欠" : "";
  n = Math.abs(n);
  var s = "";
  for (var i = 0; i < fraction.length; i++) {
    s += (
      digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
    ).replace(/零./, "");
  }
  s = s || "整";
  n = Math.floor(n);
  for (var i = 0; i < unit[0].length && n > 0; i++) {
    var p = "";
    for (var j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
  }
  return (
    head +
    s
      .replace(/(零.)*零元/, "元")
      .replace(/(零.)+/g, "零")
      .replace(/^整$/, "零元整")
  );
}
