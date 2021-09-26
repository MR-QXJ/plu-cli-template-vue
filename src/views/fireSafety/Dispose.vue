<template>
  <div class="dis-container">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      :title="unitName"
      :border="false"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div class="dis-wrap">
      <div class="dispose-container">
        <div class="details-top details w100">
          <div class="title w100">
            <img src="../../assets/img/index/title.png" class="title-icon" />
            <span>隐患信息</span>
          </div>
          <div class="content w100">
            <div>
              <div
                class="dispose-item flex"
                v-for="(item, index) in disposeData"
                :key="index"
              >
                <div class="item-title">{{ item.title }}:</div>
                <div class="item-info">{{ item.value }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="details-center details w100">
          <div class="title w100">
            <img src="../../assets/img/index/title.png" class="title-icon" />
            <span>处理日志</span>
          </div>
          <div class="content cen-cont w100">
            <div
              class="timeAxisView"
              v-for="(item, index) in disposeLogs"
              :key="index"
            >
              <TimeAxis
                :disposeContent="item.disposeContent"
                :disposeDate="item.disposeDate"
                :imgUrl="item.fireHiddenDangerDisposeImgs"
                :disposeStateName1="item.disposeStateName1"
                :nextDisposeDate="item.nextDisposeDate"
                :personName="item.personName"
              />
            </div>
          </div>
        </div>
        <div class="details-bot details w100">
          <div class="title w100">
            <img src="../../assets/img/index/title.png" class="title-icon" />
            <span>隐患处理</span>
          </div>
          <div class="content cen-cont w100">
            <div
              class="select dispose-item sonsulti-item w100 h100 flex-align-center flex-center"
            >
              <span v-if="!disposeType" @click="showDisposeStatePop"
                >请选择处置类型</span
              >
              <span
                name="disposeState"
                v-if="disposeType"
                @click="showDisposeStatePop"
                >{{ disposeStateName1 }}</span
              >
              <van-popup
                v-model="showDisposeState"
                position="bottom"
                custom-style="height: 40%;"
                @close="onDisposeStateClose"
              >
                <van-picker
                  show-toolbar
                  @cancel="onDisposeStateCancel"
                  @confirm="onDisposeStateConfirm"
                  :columns="disposeStateList"
                  @change="onChangeDisposeState"
                />
              </van-popup>
            </div>
            <div
              class="select dispose-item sonsulti-item w100 h100 flex-align-center flex-center"
              v-if="diposeIndex == 1"
            >
              <span @click="showBirthdayPop" v-if="!birthday"
                >请选择计划完成时间</span
              >
              <span v-if="birthday" @click="showBirthdayPop">{{
                birthday
              }}</span>
              <van-popup
                v-model="showDatePicker"
                position="bottom"
                style="height: 40%;"
                @close="onDatePickerClose"
              >
                <van-datetime-picker
                  v-if="showDatePicker"
                  type="datetime"
                  v-model="currentDate"
                  @cancel="onDateCancel"
                  @confirm="onDateConfirm"
                  :min-date="minDate"
                  :formatter="formatter"
                />
              </van-popup>
            </div>

            <div class="dispose-mark">
              <input
                v-model="disposeContent"
                placeholder="请输入反馈说明"
                placeholder-style="color:#666;font-size:12px;"
              />
              <div class="register-photo">
                <van-uploader
                  name="img"
                  class="uploader-contianer"
                  accept="image"
                  :file-list="imgList"
                  :before-read="beforeRead"
                  :max-count="3"
                  upload-icon="plus"
                  @delete="deleteAptitude"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btn-wrap">
      <van-button
        square
        style="height: 49px;line-height: 49px;font-size: 18px;background: #cc1414;color: #fff;padding: 0;"
        :loading="loading"
        @click="handleSubmit"
        class="dispose-btn w100"
        >立即提交</van-button
      >
    </div>
  </div>
</template>
<script>
import {
  getHiddenDetail,
  getSelectList,
  // uploadimg,
  insertHiddenDispose,
  uploadImage,
  getImage
} from "@/utils/api";
import TimeAxis from "@/components/firesafety/unitinfo/TimeAxis.vue";
import {
  removeBackButton,
  addBackButton,
  dataIsNullStr,
  dataIsNullNumber,
  dataIsNullArray,
  dataIsNullObj,
  showToast,
  isNativePermission
} from "@/utils/tool";
export default {
  components: {
    TimeAxis
  },
  data() {
    return {
      loading: false,
      unitName: "",
      dangerId: "",
      // 详情数据
      detailValue: null,
      // 隐患信息
      disposeData: [],
      // 处置日志
      disposeLogs: [],
      index: 0,
      disposeStateList: [],
      disposeType: "",
      show: false,
      // 图片
      registerList: [],
      // 处置弹窗
      showDisposeState: false,
      // 处置下拉下标
      diposeIndex: null,
      // showBirthdayPop: false,
      // 时间选择器
      birthday: "",
      // 显示时间选项
      showDatePicker: false,
      currentDate: "",
      minDate: new Date(),
      formatter(type, value) {
        if (type === "year") {
          return `${value}`;
        } else if (type === "month") {
          return `${value}`;
        }
        return value;
      },
      // 处置内容
      disposeContent: "",
      imgList: [],
      appletHiddenImgList: []
    };
  },
  methods: {
    loadHiddenData(key) {
      let that = this;
      let params = {
        key
        // key: "1A7210C4571B0CC17BFB3F74AD4E95EE"
      };
      let arr = [];
      // util.loading("加载中...");
      getHiddenDetail(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          const data = dataIsNullObj(res.data);
          arr.push({
            title: "上报时间",
            value: dataIsNullStr(data.reportedDate, "未知")
          });
          arr.push({
            title: "隐患内容",
            value: dataIsNullStr(data.dangerContent, "未知")
          });
          arr.push({
            title: "隐患位置",
            value: dataIsNullStr(data.address, "未知")
          });
          arr.push({
            title: "隐患来源",
            value: dataIsNullStr(data.sourceName, "未知")
          });
          arr.push({
            title: "处置状态",
            value: dataIsNullStr(data.disposeStateName, "未知")
          });
          arr.push({
            title: "督办状态",
            value: dataIsNullStr(data.superVisorState, "未知")
          });
          arr.push({
            title: "整改期限",
            value: dataIsNullStr(data.nowNextDisposeDate, "未知")
          });
          arr.push({
            title: "整改要求",
            value: dataIsNullStr(data.nowDisposeContent, "未知")
          });
          that.disposeData = arr;
          that.detailValue = data;
          that.disposeLogs = data.fireHiddenDangerDisposes;

          // wx.hideLoading();
        }
      });
    },
    // 隐患类型下拉
    initSelect() {
      const NUM = "0015004";
      let that = this;
      let list = [];
      let params = {
        pKey: NUM
      };
      getSelectList(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          const data = dataIsNullArray(res.data);
          data.map(item => {
            list.push({
              key: item.key,
              text: item.title
            });
          });
          that.disposeStateList = list;
        }
      });
    },
    handleSubmit() {
      if (!this.disposeType) {
        // Toast("请选择处置类型！");
        showToast("请选择处置类型！");
        return;
      }
      let params = {
        dangerId: this.detailValue.dangerId,
        disposeContent: this.disposeContent,
        fireHiddenDangerDisposeImgs: this.appletHiddenImgList,
        disposeType: this.disposeType,
        // nextDisposeDate: "2020-04-01"
        nextDisposeDate: this.birthday
      };
      for (let i in params) {
        if (!params[i]) {
          delete params[i];
        }
      }
      this.loading = true;
      insertHiddenDispose(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          this.loading = false;
          // Toast.success("保存成功！");
          showToast("保存成功！");
          this.$router.go(-1);
        } else {
          this.loading = false;
        }
      });
    },
    showDisposeStatePop() {
      this.showDisposeState = true;
    },
    onDisposeStateClose() {
      this.showDisposeState = false;
    },
    onDisposeStateCancel() {
      this.showDisposeState = false;
    },
    onDisposeStateConfirm(e, a) {
      this.showDisposeState = false;
      this.disposeType = e.key;
      this.disposeStateName1 = e.text;
      this.diposeIndex = a;
    },
    onChangeDisposeState(e) {
      console.log(e);
    },
    // 启动出生日期
    showBirthdayPop() {
      this.showDatePicker = true;
    },
    // 关闭日期
    onDatePickerClose() {
      this.showDatePicker = false;
    },
    // 时间选择
    onDateConfirm() {
      let str = "";
      str = this.formatDateTime(this.currentDate);
      this.showDatePicker = false;
      this.birthday = str;
      this.currentDate = this.currentDate;
    },
    formatDateTime(time) {
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = time.getDate();
      d = d < 10 ? "0" + d : d;
      let h = time.getHours();
      h = h < 10 ? "0" + h : h;
      let minute = time.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      let second = time.getSeconds();
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    },
    // 取消时间选择
    onDateCancel() {
      this.showDatePicker = false;
    },
    // 图片上传
    beforeRead(file) {
      let that = this;
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        let content = e.target.result;
        let img = new Image();
        img.src = content;
        img.onload = function() {
          let data = that.compress(img);
          const params = {
            group: "hiddenTakePicture",
            base64: data
          };
          let imgObj = {
            url: "",
            status: "uploading"
          };
          that.imgList.push(imgObj);
          uploadImage(params).then(r => {
            const code = dataIsNullNumber(r.code);
            if (code === 0) {
              that.appletHiddenImgList.push({ imgUrl: r.data });
              // that.imgList.push({ url: getImage(r.data) });
              imgObj.url = getImage(r.data);
              imgObj.status = "done";
            }
          });
        };
      };
    },
    //压缩图片
    compress: function(img) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let width = img.width;
      let height = img.height;
      canvas.width = width;
      canvas.height = height;
      // 铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);

      //进行压缩
      let ndata = canvas.toDataURL("image/jpeg", 0.2);
      return ndata;
    },
    // 删除资质图
    deleteAptitude(e, a) {
      this.imgList.splice(a.index, 1);
    }
  },
  mounted() {
    isNativePermission("WRITE_EXTERNAL_STORAGE", "文件访问", () => {});
    this.$root.backBtnFn = this.$root.goBack;
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // 添加监听home键回退
    addBackButton(this.$root.backBtnFn);

    const options = this.$route.query;

    (this.unitName = options.name), (this.dangerId = options.id);
    this.initSelect();
    this.loadHiddenData(options.id);
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/common.scss";
.dis-container {
  height: 100vh;
  overflow: hidden;
  .van-nav-bar {
    background: #0e41a6;
    /deep/.van-nav-bar__title {
      color: #fff;
    }
    /deep/.van-icon {
      color: #fff;
    }
  }
  background: #efeff4;
  @include page-none-data;
  .dis-wrap {
    height: calc(100vh - 95px);
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .dispose-container {
    padding: 10px;
  }
  .details {
    background-color: #fff;
    margin-top: 15px;
    border-radius: 5px;
    box-shadow: 0px 2px 2px #dadfdf;
  }
  .details-top {
    margin-top: 0;
    height: 28%;
  }
  .details-center {
    height: 36%;
  }

  .details-bot {
    height: 30%;
  }
  .title {
    font-size: 14px;
    color: #567cc8;
    border-bottom: 1px solid #e8e8e8;
    box-sizing: border-box;
    height: 38px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    img {
      margin-right: 10px;
    }
    & > div {
      display: flex;
      align-items: center;
    }
  }

  .content {
    /* height: calc(100% - 60px); */
    padding: 10px;
    overflow: hidden;
  }

  .cen-cont {
    box-sizing: border-box;
    padding: 10px;
  }

  .dispose-item {
    height: 38px;
    line-height: 38px;
    font-size: 12px;
  }
  .item-title {
    color: #333;
  }
  .item-info {
    color: #666;
    margin-left: 10px;
  }
  .btn-wrap {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .dispose-btn {
    width: 100% !important;
    background: #ff0000;
    color: #fff;
  }
  .sonsulti-item {
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
    padding: 0 10px;
    color: #999;
  }
  .dispose-mark {
    height: 130px;
    border: 1px solid #ddd;
    padding: 10px;
    font-size: 12px;
    position: relative;
  }
  .register-photo {
    position: absolute;
    bottom: 10px;
    left: 10px;
  }
  .uploader-contianer .van-uploader {
    width: 100%;
    height: 100%;
  }
  .van-uploader__upload,
  .van-uploader__prediv,
  .van-uploader__prediv-img {
    width: 50px !important;
    height: 50px !important;
  }
}
</style>
