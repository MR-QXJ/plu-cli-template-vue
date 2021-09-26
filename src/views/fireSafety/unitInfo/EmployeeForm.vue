<template>
  <div class="emf">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      :border="false"
      :title="`${isAdd == 1 ? '添加' : '编辑'}从业人员信息`"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div
      class="compile-content"
      :style="{ height: $root.contentHeight + 'px' }"
    >
      <div class="form-container">
        <div class="flex-align-center form-item">
          <span class="form-title">姓名</span>
          <span class="">：</span>
          <input
            label="姓名"
            class="w100 h100"
            v-model="name"
            placeholder="请输入姓名"
          />
        </div>
        <div class="flex-align-center form-item">
          <span class="form-title">性别</span>
          <span class="">：</span>
          <span
            v-if="!sex"
            class="item-placholder w100 h100"
            @click="showGanderPop"
            >请选择性别</span
          >
          <span
            class="w100 h100"
            name="sex"
            v-if="sex"
            @click="showGanderPop"
            >{{ sexName }}</span
          >
          <van-popup
            v-model="showGander"
            position="bottom"
            custom-style="height: 40%;"
            @close="onGanderClose"
          >
            <van-picker
              show-toolbar
              @cancel="onGanderCancel"
              @confirm="onSexConfirm"
              :columns="ganderList"
            />
          </van-popup>
        </div>
        <div class="flex-align-center form-item">
          <span class="form-title">出生日期</span>
          <span class="">：</span>
          <span
            v-if="!birthday"
            class="item-placholder w100 h100"
            @click="showBirthdayPop"
            >请输入出生日期</span
          >
          <span class="w100 h100" v-if="birthday" @click="showBirthdayPop">{{
            birthday
          }}</span>
          <van-popup
            v-model="showDatePicker"
            position="bottom"
            custom-style="height: 40%;"
            @close="onDatePickerClose"
          >
            <van-datetime-picker
              v-if="showDatePicker"
              type="date"
              v-model="currentDate"
              @confirm="onDateConfirm"
              :min-date="minDate"
            />
          </van-popup>
        </div>
        <div class="flex-align-center form-item">
          <span class="form-title">职务</span>
          <span class="">：</span>
          <span
            v-if="!duty"
            class="item-placholder w100 h100"
            @click="showDutyPop"
            >请选择职务</span
          >
          <span class="w100 h100" v-if="duty" @click="showDutyPop">{{
            dutyName
          }}</span>
          <van-popup
            v-model="showDuty"
            position="bottom"
            custom-style="height: 40%;"
            @close="onDutyClose"
          >
            <van-picker
              show-toolbar
              @cancel="onDutyCancel"
              @confirm="onDutyConfirm"
              :columns="dutyList"
            />
          </van-popup>
        </div>
        <div class="flex-align-center form-item">
          <span class="form-title">联系电话</span>
          <span class="">：</span>
          <input
            class="w100 h100"
            type="number"
            v-model="phone"
            placeholder="请输入联系电话"
          />
        </div>
        <div class="flex-align-center form-item">
          <span class="form-title">资质</span>
          <span class="">：</span>
          <input
            class="w100 h100"
            v-model="aptitude"
            placeholder="请输入资质"
          />
        </div>
        <div class="image-contianer flex-align-center-between">
          <div class="register-photo">
            <van-uploader
              name="img"
              upload-text="点击上传登记照"
              class="uploader-contianer"
              accept="image"
              v-model="registerList"
              :after-read="afterRegisterRead"
              max-count="1"
              upload-icon="plus"
            />
          </div>
          <div class="register-photo">
            <van-uploader
              upload-text="点击上传资质照"
              class="uploader-contianer"
              accept="image"
              v-model="aptitudeList"
              :after-read="afterAptitudeRead"
              max-count="1"
              upload-icon="plus"
            />
          </div>
        </div>
        <!-- <image src="{{aptitudeImg}}"></image> -->
        <div class="btn-area w100">
          <van-button square @click="handleSubmit" :loading="loading"
            >提交</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  removeBackButton,
  addBackButton,
  formatTime,
  dataIsNullArray,
  dataIsNullNumber,
  dataIsNullStr,
  dataIsNullObj,
  isNativePermission
} from "utils/tool";
import {
  getSelectList,
  getLoyeerDetail,
  getImage,
  uploadImage,
  insertLoyeerData,
  updateLoyeerData
} from "utils/api";
export default {
  data() {
    return {
      isAdd: 0,
      unitId: "",
      userId: "",
      loading: false,
      // 登记照
      registerList: [],
      previewSize: 100,
      aptitudeList: [],
      // 资质照
      aptitudeImg: "",
      // 登记照
      registerImg: "",
      // 下标
      index: 0,
      ganderList: [
        {
          key: "0003001001",
          pKey: "0003001",
          text: "男"
        },
        {
          key: "0003001002",
          pKey: "0003001",
          text: "女"
        }
      ],
      // 职务下拉
      dutyList: [],
      // 显示性别选项
      showGander: false,
      // 显示职务选项
      showDuty: false,
      // 显示时间选项
      showDatePicker: false,
      minDate: new Date(1970, 0, 1),
      currentDate: "",
      name: "",
      phone: "",
      aptitude: "",
      // 时间选择器
      birthday: "",
      // 性别
      sex: "",
      // 职务
      duty: "",
      formatter(type, val) {
        console.log(111);
        if (type === "year") {
          return `${val}`;
        } else if (type === "month") {
          return `${val}`;
        }
        return val;
      }
    };
  },
  methods: {
    // 登记图片上传
    afterRegisterRead({ content }) {
      let params = {
        base64: content,
        group: "applet"
      };
      this.$toast.loading({
        message: "正在上传...",
        forbidClick: true,
        duration: 0
      });
      uploadImage(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          this.registerImg = res.data;
          this.$toast.clear();
        }
      });
    },
    // 图片上传
    afterAptitudeRead({ content }) {
      let params = {
        base64: content,
        group: "applet"
      };
      this.$toast.loading({
        message: "正在上传...",
        forbidClick: true,
        duration: 0
      });
      uploadImage(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          this.aptitudeImg = res.data;
          this.$toast.clear();
        }
      });
    },
    // 启动出生日期
    showBirthdayPop() {
      this.showDatePicker = true;
    },
    // 启动性别
    showGanderPop() {
      this.showGander = true;
    },
    // 启动职务
    showDutyPop() {
      this.showDuty = true;
    },
    // 关闭性别
    onGanderClose() {
      this.showGander = false;
    },
    // 关闭职务
    onDutyClose() {
      this.showDuty = false;
    },
    // 关闭日期
    onDatePickerClose() {
      this.showDatePicker = false;
    },
    // 性别选择
    onSexConfirm(e) {
      this.showGander = false;
      this.sexName = e.text;
      this.sex = e.key;
    },
    // 职务选择
    onDutyConfirm(e) {
      this.showDuty = false;
      this.dutyName = e.text;
      this.duty = e.key;
    },
    // 时间选择
    onDateConfirm(e) {
      let str = "";
      str = formatTime(e);
      this.showDatePicker = false;
      this.birthday = str;
    },
    // 取消性别选择
    onGanderCancel() {
      this.showGander = false;
    },
    // 取消时间选择
    onDateCancel() {
      this.showDatePicker = false;
    },
    // 取消职务选择
    onDutyCancel() {
      this.showDuty = false;
    },
    // 姓名
    changeName(e) {
      this.name = e.detail.value;
    },
    changeTel(e) {
      this.setData({
        phone: e.detail.value
      });
    },
    changeAptitud(e) {
      this.aptitude = e.detail.value;
    },
    // 数据加载
    loadData() {
      let params = {
        key: this.userId
      };
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      getLoyeerDetail(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          const data = dataIsNullObj(res.data);
          this.name = dataIsNullStr(data.name, "");
          this.sexName = dataIsNullStr(data.sexName, "");
          this.sex = dataIsNullStr(data.sex, "");
          this.birthday = dataIsNullStr(data.birthday).replace(
            / \d+(:\d+){2}/,
            ""
          );
          this.currentDate = Date.parse(new Date(dataIsNullStr(data.birthday)));
          this.duty = dataIsNullStr(data.duty, "");
          this.dutyName = dataIsNullStr(data.dutyName, "");
          this.phone = dataIsNullStr(data.phone, "");
          this.aptitude = dataIsNullStr(data.aptitude);
          this.aptitudeImg = dataIsNullStr(data.aptitudeImg);
          this.aptitudeList = dataIsNullStr(data.aptitudeImg)
            ? [
                {
                  url: getImage(dataIsNullStr(data.aptitudeImg))
                }
              ]
            : [];
          this.registerList = dataIsNullStr(data.registerImg)
            ? [
                {
                  url: getImage(dataIsNullStr(data.registerImg))
                }
              ]
            : [];
          this.registerImg = dataIsNullStr(data.registerImg);
          this.$toast.clear();
        }
      });
    },
    // 加载职务
    loadDutyList() {
      const NUM = "0028001001";
      let params = {
        pKey: NUM
      };
      let list = [];
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
          this.dutyList = list;
        }
      });
    },
    // 提交表单
    handleSubmit() {
      if (!this.name) {
        this.$toast.fail("请输入姓名");
        return;
      }
      if (!this.sex) {
        this.$toast.fail("请选择性别");
        return;
      }
      if (!this.birthday) {
        this.$toast.fail("请选择出生日期");
        return;
      }
      if (!this.duty) {
        this.$toast.fail("请选择职务");
        return;
      }
      if (!this.phone) {
        this.$toast.fail("请输入联系电话");
        return;
      } else {
        // 手机号
        let patternMobile = /^((13[0-9])|(14[5-7])|(15([0-3]|[5-9]))|(18[0,2,5-9])|(17[1-9]))\d{8}$/;
        let res = new RegExp(patternMobile).test(this.phone);
        if (!res) {
          this.$toast.fail("请输入正确的手机号");
          return;
        }
      }
      const params = {
        aptitudeImg: this.aptitudeImg,
        registerImg: this.registerImg,
        birthday: this.birthday,
        sex: this.sex,
        duty: this.duty,
        name: this.name,
        phone: this.phone,
        aptitude: this.aptitude,
        unitId: this.unitId,
        unitType: 0
      };
      this.loading = true;
      if (this.isAdd === "1") {
        insertLoyeerData(params).then(res => {
          const code = dataIsNullNumber(res.code);
          this.loading = false;
          if (code === 0) {
            this.$toast.success("添加成功！");
            this.$router.go(-1);
          }
        });
      } else {
        params.key = this.userId;
        updateLoyeerData(params).then(res => {
          const code = dataIsNullNumber(res.code);
          this.loading = false;
          if (code === 0) {
            this.$toast.success("编辑成功！");
            this.$router.go(-1);
          }
        });
      }
    }
  },
  created() {
    this.isAdd = this.$route.query.isAdd;
    this.userId = this.$route.query.userId;
    this.unitId = this.$route.query.unitId;
    if (this.isAdd === "0") {
      this.loadData();
    }
    this.loadDutyList();
  },
  mounted() {
    this.$root.backBtnFn = this.$root.goBack;
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // 添加监听home键回退
    addBackButton(this.$root.backBtnFn);
    this.$root.navH = document.querySelector(".van-nav-bar").offsetHeight;
    isNativePermission("WRITE_EXTERNAL_STORAGE", "文件访问", () => {});
  },
  watch: {
    aptitudeList(to) {
      if (!to.length) this.aptitudeImg = "";
    },
    registerList(to) {
      if (!to.length) this.registerImg = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.emf {
  background-color: #efeff4;
  /deep/ .van-button--normal {
    width: 100%;
    background: #cc1414;
    padding: 0;
    height: 49px;
    line-height: 49px;
    font-size: 18px;
    color: #fff;
  }
  /deep/ .van-uploader,
  /deep/ .van-uploader__wrapper,
  /deep/ .van-uploader__upload,
  /deep/ .van-uploader__preview,
  /deep/ .van-uploader__preview-image {
    width: 100%;
    height: 100%;
    margin: 0;
  }
  .van-nav-bar {
    background: #0e41a6;
  }
  input {
    &::-webkit-input-placeholder {
      /* WebKit browsers */
      color: #b1b1b1;
    }
    &:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #b1b1b1;
    }
    &::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #b1b1b1;
    }
    &:-ms-input-placeholder {
      /* Internet Explorer 10+ */
      color: #b1b1b1;
    }
  }
  .compile-content {
    padding: 10px;
  }
  .form-container {
    padding: 10px;
    background: #fff;
    font-size: 12px;
    color: #b7b7b7;
  }
  .form-item {
    line-height: 20px;
    height: 40px;
    padding: 10px 0;
    border-bottom: 1px solid #ddd;
  }
  .form-title {
    width: 60px;
    text-align: justify;
    text-align-last: justify;
  }
  .register-photo {
    text-align: center;
    width: 50%;
    height: 100px;
  }
  .register-photo:last-child {
    margin-left: 10px;
  }
  .btn-area {
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .form-btn {
    width: 100% !important;
  }
  .submit {
    background: #ff0000;
    color: #fff;
  }
  .image-contianer {
    padding: 20px 0 10px;
  }
  .uploader-contianer .van-uploader {
    width: 100%;
    height: 100%;
  }
}
</style>
