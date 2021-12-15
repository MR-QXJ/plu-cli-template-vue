import { imgAccept, iconAccept } from "constants/global";

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
