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
