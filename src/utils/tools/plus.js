//调用原生方法
// 呼出电话号码
export function arouseCall(number) {
  if (!window.plus) {
    return;
  }
  // eslint-disable-next-line no-undef
  plus.device.dial(number);
}
//alert
export function showAlert(message, alertCB, title = "") {
  if (!window.plus) {
    return;
  }
  // eslint-disable-next-line no-undef
  plus.nativeUI.alert(message, alertCB, title);
}
//toast
export function showToast(message) {
  if (!window.plus) {
    return;
  }
  //eslint-disable-next-line no-undef
  plus.nativeUI.toast(message, {
    verticalAlign: "top"
  });
}
//confirm
export function showConfirm(message, confirmCB, cancelCB, title = "") {
  if (!window.plus) {
    return;
  }
  // eslint-disable-next-line no-undef
  plus.nativeUI.confirm(
    message,
    function(e) {
      if (!e.index) {
        //confirmCB
        confirmCB && confirmCB();
      } else {
        //cancelCB
        cancelCB && cancelCB();
      }
    },
    {
      title,
      buttons: ["确定", "取消"],
      verticalAlign: "center"
    }
  );
}

/*
 * 退出App
 * @param
 */
export function quitApp() {
  if (!window.plus) {
    return null;
  }
  // eslint-disable-next-line
  plus.runtime.quit();
}
/*
 * 添加监听home键回退
 * @param backFun 回退
 */
export function addBackButton(backFun) {
  if (!window.plus) {
    return;
  }
  // eslint-disable-next-line
  plus.key.addEventListener("backbutton", backFun);
}
/*
 * 移除监听home键回退
 * @param backFun 回退
 */
export function removeBackButton(backFun) {
  if (!window.plus) {
    return;
  }
  // eslint-disable-next-line
  plus.key.removeEventListener("backbutton", backFun);
}
//storage
export function storageSet(key, value) {
  if (!window.plus) {
    return;
  }
  // eslint-disable-next-line no-undef
  plus.storage.setItem(key, value);
}
export function storageGet(key) {
  if (!window.plus) {
    return;
  }
  // eslint-disable-next-line no-undef
  return plus.storage.getItem(key);
}
export function storageRemove(key) {
  if (!window.plus) {
    return;
  }
  // eslint-disable-next-line no-undef
  plus.storage.removeItem(key);
}
/*
 * 本地存储清空
 * @param key key
 */
export function storageClear() {
  if (!window.plus) {
    return;
  }
  // eslint-disable-next-line
  plus.storage.clear();
}
//判断是否有权限
export function isNativePermission(name, descr, cb) {
  if (!window.plus) {
    return;
  }
  // eslint-disable-next-line no-undef
  plus.android.requestPermissions(
    [`android.permission.${name}`],
    function(e) {
      if (e.deniedAlways.length > 0) {
        //权限被永久拒绝
        // 弹出提示框解释为何需要权限，引导用户打开设置页面开启
        // eslint-disable-next-line no-undef
        plus.nativeUI.toast(`${descr}权限被永久拒绝，你可以在设置中打开`, {
          verticalAlign: "top"
        });
        return false;
      }
      if (e.deniedPresent.length > 0) {
        //权限被临时拒绝
        // 弹出提示框解释为何需要定位权限，可再次调用plus.android.requestPermissions申请权限
        // eslint-disable-next-line no-undef
        plus.nativeUI.toast(`${descr}权限被拒绝了，你可以在设置中打开`, {
          verticalAlign: "top"
        });
        return false;
      }
      if (e.granted.length > 0) {
        //权限被允许
        //调用依赖获取定位权限的代码
        cb && cb();
        // return true;
      }
    },
    function() {
      // eslint-disable-next-line no-undef
      plus.nativeUI.toast(`权限请求失败`, {
        verticalAlign: "top"
      });
    }
  );
}
export function getNetworkInfo() {
  if (!window.plus) {
    return;
  }
  let network = {
    0: "网络连接状态未知",
    1: "未连接网络",
    2: "有线网络",
    3: "无线WIFI网络",
    4: "2G",
    5: "3G",
    6: "4G"
  };
  // eslint-disable-next-line no-undef
  network[plus.networkinfo.CONNECTION_UNKNOW] = 0;
  // eslint-disable-next-line no-undef
  network[plus.networkinfo.CONNECTION_NONE] = 1;
  // eslint-disable-next-line no-undef
  network[plus.networkinfo.CONNECTION_ETHERNET] = 2;
  // eslint-disable-next-line no-undef
  network[plus.networkinfo.CONNECTION_WIFI] = 3;
  // eslint-disable-next-line no-undef
  network[plus.networkinfo.CONNECTION_CELL2G] = 4;
  // eslint-disable-next-line no-undef
  network[plus.networkinfo.CONNECTION_CELL3G] = 5;
  // eslint-disable-next-line no-undef
  network[plus.networkinfo.CONNECTION_CELL4G] = 6;
  // eslint-disable-next-line no-undef
  let currNetwork = network[plus.networkinfo.getCurrentType()];
  if (currNetwork == 0 || currNetwork == 1) {
    return false;
  } else {
    return true;
  }
}
// 获取设备信息
export function getDeviceInfo(c1, c2) {
  if (!window.plus) {
    return;
  }
  // eslint-disable-next-line no-undef
  plus.device.getInfo({
    success: function(e) {
      c1(e);
    },
    fail: function(e) {
      c2(e);
    }
  });
}
//获取当前位置
export function getGeoLocation(cb, er) {
  if (!window.plus) {
    return;
  }
  let currNetwork = getNetworkInfo();
  if (!currNetwork) {
    showToast("当前网络状态异常");
    return;
  }
  // eslint-disable-next-line no-undef
  plus.geolocation.getCurrentPosition(
    function(p) {
      cb && cb(p.coords.longitude, p.coords.latitude, p);
    },
    function(err) {
      er && er(err);
      // eslint-disable-next-line no-undef
      // plus.nativeUI.toast(JSON.stringify(err), {
      //   verticalAlign: "top"
      // });
    },
    { provider: "baidu" }
  );
}
// 获取当前位置by sys
export function getGeoLocationBySys(success, error) {
  if (!window.plus) {
    return;
  }
  let currNetwork = getNetworkInfo();
  if (!currNetwork) {
    showToast("当前网络状态异常");
    return;
  }
  // eslint-disable-next-line no-undef
  var map = new plus.maps.Map();
  map.getUserLocation((state, pos) => {
    if (0 == state) {
      // map.centerAndZoom(pos, 16);
      // eslint-disable-next-line no-undef
      plus.maps.Map.reverseGeocode(
        pos,
        {},
        function(event) {
          success && success(event, map);
        },
        function(e) {
          console.log(JSON.stringify(e));
          error && error(e);
        }
      );
    } else {
      error && error("stateCode: " + state);
    }
  });
}
// 监听位置变化
export const watchGeoLocation = {
  wid: null,
  //开始监听位置变化(会自动每秒刷新)
  start: function(cb) {
    let currNetwork = getNetworkInfo();
    if (!currNetwork) {
      // eslint-disable-next-line no-undef
      plus.nativeUI.toast(`当前网络状态异常`, {
        verticalAlign: "top"
      });
      return;
    }
    // let _this = this;
    // eslint-disable-next-line no-undef
    this.wid = plus.geolocation.watchPosition(
      function(p) {
        cb && cb(p.coords.longitude, p.coords.latitude);
      },
      function() {
        // eslint-disable-next-line no-undef
        plus.nativeUI.toast(`监听位置失败`, {
          verticalAlign: "top"
        });
      }
    );
  },
  //结束监听位置变化
  end: function() {
    if (!this.wid) {
      return;
    }
    // eslint-disable-next-line no-undef
    plus.geolocation.clearWatch(this.wid);
    this.wid = null;
  }
  // timer: null,
  // start: function(cb) {
  //   this.timer = setTimeout(() => {
  //     if (!window.plus) {
  //       return;
  //     }
  //     let currNetwork = getNetworkInfo();
  //     if (!currNetwork) {
  //       showToast("当前网络状态异常");
  //       return;
  //     }
  //     // eslint-disable-next-line no-undef
  //     plus.geolocation.getCurrentPosition(
  //       function(p) {
  //         // alert('Geolocation\nLatitude:' + p.coords.latitude + '\nLongitude:' + p.coords.longitude + '\nAltitude:' + p.coords.altitude);
  //         cb && cb(p.coords.longitude, p.coords.latitude);
  //       },
  //       function() {
  //         // eslint-disable-next-line no-undef
  //         plus.nativeUI.toast(`监听位置失败`, {
  //           verticalAlign: "top"
  //         });
  //       }
  //     );
  //     this.start();
  //   }, 3000);
  // },
  // end: function() {
  //   console.log(this);
  //   clearInterval(this.timer);
  //   this.timer = null;
  // }
};

// 下载文件
// export function downloadFile(url, filename) {
//   // eslint-disable-next-line no-undef
//   // var dtask = plus.downloader.createDownload(
//   //   url,
//   //   {
//   //     filename: `_downloads/zsxf/${filename}`
//   //   },
//   //   function(d, status) {
//   //     if (status == 200) {
//   //       showToast(`${d.filename} 已保存`);
//   //     } else {
//   //       showToast(`${d.filename} 保存失败。code:${status}`);
//   //     }
//   //   }
//   // );
//   // dtask.start(); //开始下载
// }

export function downloadFile(filepath, filename) {
  if (window.plus) {
    //判断文件是否已经下载
    // eslint-disable-next-line no-undef
    plus.io.resolveLocalFileSystemURL(
      "_downloads/zsxf/" + filename,
      function(entry) {
        // console.log(JSON.stringify(entry));
        //如果已存在文件，则打开文件
        if (entry.isFile) {
          showToast("正在打开文件...");
          // eslint-disable-next-line no-undef
          plus.runtime.openFile("_downloads/zsxf/" + filename);
        }
      },
      function() {
        //如果未下载文件，则下载后打开文件
        // eslint-disable-next-line no-undef
        var dtask = plus.downloader.createDownload(
          filepath,
          { filename: "_downloads/zsxf/" + filename },
          function(d, status) {
            if (status == 200) {
              showToast("下载完成，正在打开文件...");
              // eslint-disable-next-line no-undef
              plus.runtime.openFile("_downloads/zsxf/" + filename);
            } else {
              showToast("下载失败: " + status);
            }
          }
        );
        // dtask.addEventListener("statechanged", function(task, status) {
        //   console.log(status);
        //   if (!dtask) {
        //     return;
        //   }
        //   switch (task.state) {
        //     case 1:
        //       showToast("开始下载...");
        //       break;
        //     case 2:
        //       showToast("正在下载...");
        //       break;
        //     case 3: // 已接收到数据
        //       var progressVal = (task.downloadedSize / task.totalSize) * 100;
        //       // //psb1.progressbar({ progress: progressVal }).show();
        //       // //dstatus[0].innerHTML = task.downloadedSize + '/' + task.totalSize;
        //       // //hui.toast('下载进度：' + (task.downloadedSize + '/' + task.totalSize));
        //       // if (hui('.progress').length > 0) {
        //       //     hui('.progress').html(parseInt(progressVal) + '%');
        //       // }
        //       showToast(parseInt(progressVal) + "%");
        //       break;
        //     case 4:
        //       dtask = null;
        //       showToast("正在打开文件...");
        //       break;
        //   }
        // });
        dtask.start();
      }
    );
  } else {
    //不支持plus
    window.open(filepath);
  }
}

//播放新消息声音
export function playNewMsgWav() {
  if (!window.plus) {
    return;
  }
  let url = "_www/msg.mp3";
  // eslint-disable-next-line no-undef
  let path = plus.io.convertLocalFileSystemURL(url);
  // eslint-disable-next-line no-undef
  let audioObj = plus.audio.createPlayer(path);
  audioObj.addEventListener("ended", function() {});
  audioObj.play();
}

/**
 * 监听home键回退：有slide(设置滑动页组件显示)则设为false,否则回到上一页
 * @param vm 当前组件实例
 */
let backBtnFn = null; //返回按钮回调
export function homeBackListener(vm) {
  // 移除监听home键回退首页
  backBtnFn && removeBackButton(backBtnFn);
  backBtnFn = backFn;
  // 添加监听home键回退
  addBackButton(backFn);

  function backFn() {
    if (vm.slide) {
      vm.slide = false;
    } else {
      vm.$router.go(-1);
    }
  }
}
