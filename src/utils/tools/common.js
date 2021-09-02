/*
 * 工具类
 */
import qs from "qs";

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

// 参数序列化
export function paramsSerializer(name, params, type = 1) {
  switch (type) {
    case 1: {
      const arr = {};
      arr[name] = params;
      return qs.stringify(arr, { indices: false });
    }
  }
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
