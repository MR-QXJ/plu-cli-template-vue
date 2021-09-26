/*
 * 数据验证
 * author: dingxing
 */

window.Verification = (function() {
  // 正整数
  var patternIntPositive = /^[1-9]\d*$/;
  // 负整数
  var patternIntNegative = /^-[1-9]\d*$/;
  // 正小数（最多两位小数）
  var patternFloatPositive = /^([1-9]\d*|0)(\.\d{1,2})?$/;
  // 负小数（最多两位小数）
  var patternFloatNegative = /^-([1-9]\d*|0)(\.\d{1,2})?$/;
  // 用户名（中英文、数字和下划线，且不能为纯数字）
  var patternUserName = /^(?!(\d+)$)[\u4e00-\u9fff\w]+$/;
  // 密码（英文、数字和字符）
  var patternPass = /^[\da-zA-Z~!@#$%^&*()_+`\-={}[\]:"|;'<>?,.\\/]*$/;
  // 固定电话
  var patternPhone = /^\d{3}-\d{8}|\d{4}-\d{7}$/;
  // 手机号
  var patternMobile = /^((13[0-9])|(14[5-7])|(15([0-3]|[5-9]))|(18[0,2,5-9])|(17[1-9]))\d{8}$/;
  // 验证码
  var patternCode = /^[0-9]\d*$/;
  // 邮箱
  var patternEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  // IPv4
  var patternIPv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  // 车牌
  var patternCarId = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
  // url地址
  var patternUrl = /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/;
  // 域名
  var patternDomainName = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
  // 邮编
  var patternZipCode = /^[1-9]\d{5}(?!\d)$/;
  // 经度
  var patternLongitude = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
  // 纬度
  var patternLatitude = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
  // 单位统一社会信用代码
  var patternUnitCode = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/;
  // 特殊符号
  var patternSpecialSymbols = /[`~@#$^&*()+=<>{}|/\\[\]·~@#￥……&*（）——+={}|《》【】‘’]/i;

  // 创建
  function Verification() {
    //
  }

  // 整数
  Verification.prototype.checkInt = function(int) {
    var resPositive =
      String(int) === "0" ? true : new RegExp(patternIntPositive).test(int);
    var resNegative =
      String(int) === "-0" ? true : new RegExp(patternIntNegative).test(int);
    var res = resPositive || resNegative;
    var msg = res ? "" : "整数";
    return {
      res: res,
      msg: msg
    };
  };

  // 正整数
  Verification.prototype.checkIntPositive = function(int) {
    var res =
      String(int) === "0" ? true : new RegExp(patternIntPositive).test(int);
    var msg = res ? "" : "正整数";
    return {
      res: res,
      msg: msg
    };
  };

  // 负整数
  Verification.prototype.checkIntNegative = function(int) {
    var res =
      String(int) === "-0" ? true : new RegExp(patternIntNegative).test(int);
    var msg = res ? "" : "负整数";
    return {
      res: res,
      msg: msg
    };
  };

  // 小数
  Verification.prototype.checkFloat = function(float) {
    var resPositive =
      String(float) === "0"
        ? true
        : new RegExp(patternFloatPositive).test(float);
    var resNegative =
      String(float) === "-0"
        ? true
        : new RegExp(patternFloatNegative).test(float);
    var res = resPositive || resNegative;
    var msg = res ? "" : "小数，最多两位";
    return {
      res: res,
      msg: msg
    };
  };

  // 正小数
  Verification.prototype.checkFloatPositive = function(float) {
    var res =
      String(float) === "0"
        ? true
        : new RegExp(patternFloatPositive).test(float);
    var msg = res ? "" : "正小数，最多两位";
    return {
      res: res,
      msg: msg
    };
  };

  // 负小数
  Verification.prototype.checkFloatNegative = function(float) {
    var res =
      String(float) === "-0"
        ? true
        : new RegExp(patternFloatNegative).test(float);
    var msg = res ? "" : "负小数，最多两位";
    return {
      res: res,
      msg: msg
    };
  };

  // 用户名
  Verification.prototype.checkUserName = function(userName) {
    var res = new RegExp(patternUserName).test(userName);
    var msg = res ? "" : "中英文、数字和下划线，且不能为纯数字";
    return {
      res: res,
      msg: msg
    };
  };

  // 密码
  Verification.prototype.checkPass = function(pass) {
    var res = new RegExp(patternPass).test(pass);
    var msg = res ? "" : "英文、数字和字符";
    return {
      res: res,
      msg: msg
    };
  };

  // 固定电话
  Verification.prototype.checkPhone = function(phone) {
    var res = new RegExp(patternPhone).test(phone);
    var msg = res ? "" : "固定电话";
    return {
      res: res,
      msg: msg
    };
  };

  // 手机号
  Verification.prototype.checkMobile = function(mobile) {
    var res = new RegExp(patternMobile).test(mobile);
    var msg = res ? "" : "手机号";
    return {
      res: res,
      msg: msg
    };
  };

  // 验证码
  Verification.prototype.checkCode = function(code) {
    var res = new RegExp(patternCode).test(code);
    var msg = res ? "" : "数字";
    return {
      res: res,
      msg: msg
    };
  };

  // 身份证
  Verification.prototype.checkCardID = function(cardId) {
    var _sId = cardId.toUpperCase();
    var Errors = new window.Array(
      "验证通过",
      "身份证号格式不正确",
      "身份证号出生日期不正确",
      "末位校验码不正确，应为",
      "身份证地区不正确",
      "请输入身份证号"
    );
    // var Errors = new Array("a0", "a1", "a2","b", "a3");
    if (_sId === null || _sId === "") {
      return {
        res: false,
        msg: Errors[5]
      };
    }
    // _sId = String(_sId).toUpperCase()
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!/^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/.test(_sId)) {
      // return {
      //   res: false,
      //   msg: Errors[1]
      // };
      return {
        res: false,
        msg: Errors[5]
      };
    }
    // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
    // 下面分别分析出生日期和校验位
    var len;
    var re;
    len = _sId.length;
    var arrSplit = null;
    var dtmBirth = null;
    var bGoodDay = null;
    var arrInt = null;
    var arrCh = null;
    var nTemp = 0;
    var i = 0;
    if (len === 15) {
      re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
      arrSplit = _sId.match(re);
      // 检查生日日期是否正确
      dtmBirth = new Date(
        "19" + arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]
      );
      bGoodDay =
        dtmBirth.getYear() === Number(arrSplit[2]) &&
        dtmBirth.getMonth() + 1 === Number(arrSplit[3]) &&
        dtmBirth.getDate() === Number(arrSplit[4]);
      if (!bGoodDay) {
        return {
          res: false,
          msg: Errors[2]
        };
      } else {
        // 将15位身份证转成18位
        // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        arrInt = new window.Array(
          7,
          9,
          10,
          5,
          8,
          4,
          2,
          1,
          6,
          3,
          7,
          9,
          10,
          5,
          8,
          4,
          2
        );
        arrCh = new window.Array(
          "1",
          "0",
          "X",
          "9",
          "8",
          "7",
          "6",
          "5",
          "4",
          "3",
          "2"
        );
        nTemp = 0;
        i = 0;
        _sId = _sId.substr(0, 6) + "19" + _sId.substr(6, _sId.length - 6);
        for (i = 0; i < 17; i++) {
          nTemp += _sId.substr(i, 1) * arrInt[i];
        }
        _sId += arrCh[nTemp % 11];
        return {
          res: true,
          msg: Errors[0]
        };
      }
    }
    if (len === 18) {
      re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
      arrSplit = _sId.match(re);
      // 检查生日日期是否正确
      dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
      bGoodDay =
        dtmBirth.getFullYear() === Number(arrSplit[2]) &&
        dtmBirth.getMonth() + 1 === Number(arrSplit[3]) &&
        dtmBirth.getDate() === Number(arrSplit[4]);
      if (!bGoodDay) {
        return {
          res: false,
          msg: Errors[2]
        };
      } else {
        // 检验身份地区是否合法
        // 处理重庆直辖前，属于四川省的身份证号地区问题
        // var nativeplace = areaArray[_sId.substr(0, 6)]
        // if (nativeplace) {
        // 检验18位身份证的校验码是否正确。
        // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        var valnum = null;
        arrInt = new window.Array(
          7,
          9,
          10,
          5,
          8,
          4,
          2,
          1,
          6,
          3,
          7,
          9,
          10,
          5,
          8,
          4,
          2
        );
        arrCh = new window.Array(
          "1",
          "0",
          "X",
          "9",
          "8",
          "7",
          "6",
          "5",
          "4",
          "3",
          "2"
        );
        nTemp = 0;
        i = 0;
        for (i = 0; i < 17; i++) {
          nTemp += _sId.substr(i, 1) * arrInt[i];
        }
        valnum = arrCh[nTemp % 11];
        if (valnum !== _sId.substr(17, 1)) {
          // return {
          //   res: false,
          //   msg: Errors[3] + valnum
          // }
          return {
            res: false,
            msg: Errors[5]
          };
        }
        return {
          res: true,
          msg: Errors[0]
        };
        // }
        // return {
        //   res: true,
        //   msg: Errors[4]
        // };
      }
    }
    return {
      res: false,
      msg: Errors[5]
    };
  };

  // 邮箱
  Verification.prototype.checkEmail = function(email) {
    var res = new RegExp(patternEmail).test(email);
    var msg = res ? "" : "邮箱";
    return {
      res: res,
      msg: msg
    };
  };

  // IPv4
  Verification.prototype.checkIPv4 = function(ipv4) {
    var res = new RegExp(patternIPv4).test(ipv4);
    var msg = res ? "" : "IP";
    return {
      res: res,
      msg: msg
    };
  };

  // 车牌
  Verification.prototype.checkCarId = function(carId) {
    var res = new RegExp(patternCarId).test(carId);
    var msg = res ? "" : "车牌";
    return {
      res: res,
      msg: msg
    };
  };

  // url地址
  Verification.prototype.checkUrl = function(url) {
    var res = new RegExp(patternUrl).test(url);
    var msg = res ? "" : "URL地址";
    return {
      res: res,
      msg: msg
    };
  };

  // 域名
  Verification.prototype.checkDomainName = function(domainName) {
    var res = new RegExp(patternDomainName).test(domainName);
    var msg = res ? "" : "域名";
    return {
      res: res,
      msg: msg
    };
  };

  // 邮编
  Verification.prototype.checkZipCode = function(zipCode) {
    var res = new RegExp(patternZipCode).test(zipCode);
    var msg = res ? "" : "邮编";
    return {
      res: res,
      msg: msg
    };
  };

  // 经度
  Verification.prototype.checkLongitude = function(longitude) {
    var res = new RegExp(patternLongitude).test(longitude);
    var msg = res ? "" : "经度";
    return {
      res: res,
      msg: msg
    };
  };

  // 纬度
  Verification.prototype.checkLatitude = function(latitude) {
    var res = new RegExp(patternLatitude).test(latitude);
    var msg = res ? "" : "纬度";
    return {
      res: res,
      msg: msg
    };
  };

  // 单位统一社会信用代码
  Verification.prototype.checkUnitCode = function(code) {
    var res = new RegExp(patternUnitCode).test(code);
    var msg = res ? "" : "18位统一社会信用代码";
    return {
      res: res,
      msg: msg
    };
  };

  // 特殊符号
  Verification.prototype.checkSpecialSymbols = function(text) {
    var res = !new RegExp(patternSpecialSymbols).test(text);
    var msg = res ? "" : "特殊符号";
    return {
      res: res,
      msg: msg
    };
  };

  return {
    Init: Verification
  };
})();
