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
    let mod = number.length % 3;
    let output = mod == 0 ? "" : number.substring(0, mod);
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
// 金额转大写
export function digitUppercase(n) {
  let fraction = ["角", "分"];
  let digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  let unit = [
    ["元", "万", "亿"],
    ["", "拾", "佰", "仟"]
  ];
  let head = n < 0 ? "欠" : "";
  n = Math.abs(n);
  let s = "";
  for (let i = 0; i < fraction.length; i++) {
    s += (
      digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
    ).replace(/零./, "");
  }
  s = s || "整";
  n = Math.floor(n);
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = "";
    for (let j = 0; j < unit[1].length && n > 0; j++) {
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
