import {
  GUID,
  strToTimestamp,
  dataIsNullStr,
  dataIsNullNumber,
  dataIsNullObj
} from "utils/tools/common";
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

/*
 * 过滤下拉框
 * @param input 输入
 * @param option 选项
 */
export function selectFilter(input, option) {
  return (
    option.componentOptions.children[0].text
      .toLowerCase()
      .indexOf(input.toLowerCase()) >= 0
  );
}

/*
 * 字符排序
 * @param a 第一个值
 * @param b 第二个值
 * @param key 属性名
 */
export function sortStr(a, b, key) {
  const paramA = (a[key] || "").toUpperCase();
  const paramB = (b[key] || "").toUpperCase();
  return paramB.localeCompare(paramA) > 1 ? 1 : -1;
}

/*
 * 数字排序
 * @param a 第一个值
 * @param b 第二个值
 * @param key 属性名
 */
export function sortNumber(a, b, key) {
  const paramA = a[key] || 0;
  const paramB = b[key] || 0;
  return paramA < paramB ? -1 : paramA > paramB ? 1 : 0;
}

/*
 * 时间排序
 * @param a 第一个值
 * @param b 第二个值
 * @param key 属性名
 */
export function sortTime(a, b, key) {
  const paramA = strToTimestamp(a[key]);
  const paramB = strToTimestamp(b[key]);
  return paramA < paramB ? -1 : paramA > paramB ? 1 : 0;
}

/*
 * ip地址排序
 * @param a 第一个值
 * @param b 第二个值
 * @param key 属性名
 */
export function sortIp(a, b, key) {
  let paramA = a[key] || "";
  let paramB = b[key] || "";
  paramA = paramA.replace(/(\\d+)/g, "00$1");
  paramB = paramB.replace(/(\\d+)/g, "00$1");
  paramA = paramA.replace(/0*(\\d{3})/g, "$1");
  paramB = paramB.replace(/0*(\\d{3})/g, "$1");
  paramA = paramA.replace(/\./g, "");
  paramB = paramB.replace(/\./g, "");
  return paramA < paramB ? -1 : paramA > paramB ? 1 : 0;
}

/*
 * 无权限按钮样式
 * @param funcs 功能权限
 * @param checkFun 校验功能权限
 */
export function noPermissionStyle(funcs, checkFun) {
  const currFun = dataIsNullObj(checkFun);
  if (dataIsNullStr(currFun.sysFunCode) === "") {
    return {};
  }
  let isHave = false;
  funcs.map(fun => {
    if (dataIsNullStr(fun.sysFunCode) === dataIsNullStr(currFun.sysFunCode)) {
      isHave = dataIsNullNumber(fun.isPermission, 0) === 1;
    }
  });
  return isHave
    ? {}
    : {
        color: "#999999"
      };
}
