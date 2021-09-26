<template>
  <div class="consulting w100 h100">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      title="我要咨询"
      :border="false"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div class="detail-contianer">
      <div class="detail-content">
        <div class="detail-item">
          <span class="row-input" v-if="!consultType" @click="showConsultingPop"
            >请选择咨询类别</span
          >
          <span
            class="row-input"
            name="disposeState"
            v-if="consultType"
            @click="showConsultingPop"
            >{{ consultTypeName }}</span
          >
          <van-popup
            v-model="showConsulting"
            position="bottom"
            style="height: 40%;"
          >
            <van-picker
              show-toolbar
              @cancel="onDisposeStateCancel"
              @confirm="onDisposeStateConfirm"
              :columns="selectArray"
            />
          </van-popup>
        </div>
        <div class="detail-item">
          <input
            class="row-input"
            v-model="content"
            :maxlength="20"
            style="font-size:12px;color: #666;"
            placeholder="请输入20字以内咨询内容"
          />
        </div>
        <div class="content-description">
          <van-cell-group>
            <van-field
              v-model="describe"
              type="textarea"
              placeholder="请输入200字以内问题描述"
              class="input-class"
              autosize
              :maxlength="200"
              style="background:#F8F8FF;font-size:12px;color: #afafb3;"
              :border="false"
            />
          </van-cell-group>
        </div>
      </div>
    </div>
    <div class="w100 consult-btn-content">
      <van-button
        square
        @click="handleSubmit"
        style="height: 49px;line-height: 49px;font-size: 18px;background: #cc1414;color: #fff;padding: 0;"
        class="w100"
        >提交</van-button
      >
    </div>
  </div>
</template>
<script>
import { getSelectList, insertBusinessConsult } from "@/utils/api";
import {
  removeBackButton,
  addBackButton,
  dataIsNullNumber,
  dataIsNullArray,
  showToast
} from "@/utils/tool";
export default {
  data() {
    return {
      // 咨询类型选项狂
      selectArray: [],
      // 显示咨询类型
      showConsulting: false,
      // 咨询类型
      consultType: "",
      // 咨询类型名称
      consultTypeName: "",
      // 选项框key
      key: "",
      // 咨询内容
      content: "",
      // 问题描述
      describe: ""
    };
  },
  methods: {
    // 初始化数据
    initData() {
      const NUM = "0033001";
      const params = {
        pKey: NUM
      };
      // util.loading("加载中...");
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
          this.selectArray = list;
          // wx.hideLoading();
        }
      });
    },
    // 类型下拉
    showConsultingPop() {
      this.showConsulting = true;
    },
    // 取消
    onDisposeStateCancel() {
      this.showConsulting = false;
    },
    // 确定
    onDisposeStateConfirm(item) {
      let key = item.key;
      let that = this;
      this.showConsulting = false;
      this.key = key;
      let select = that.selectArray.filter(e => {
        return e.key == key;
      })[0];
      this.consultType = select.key;
      this.consultTypeName = select.text;
    },
    // 提交
    handleSubmit() {
      let type = this.key;
      if (!type) {
        showToast("请选择咨询类型!");
        return;
      }
      if (!this.content) {
        showToast("请输入内容");
        return;
      }
      if (!this.describe) {
        showToast("请输入描述");
        return;
      }
      const params = {
        consultType: type,
        consultTheme: this.content,
        consultText: this.describe
      };
      insertBusinessConsult(params).then(res => {
        const code = dataIsNullNumber(res.code);
        if (code === 0) {
          showToast("提交成功!");
          this.$router.go(-1);
        } else {
          showToast(res.message);
        }
      });
    }
  },
  mounted() {
    this.$root.backBtnFn = this.$root.goBack;
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // 添加监听home键回退
    addBackButton(this.$root.backBtnFn);
    this.initData();
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/common.scss";
.consulting {
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
  .detail-contianer {
    padding: 15px;
    font-size: 12px;
  }
  /* 详情内容 */
  .detail-content {
    padding: 10px;
    background: #fff;
  }
  /* 选择，输入 */
  .row-input {
    font-size: 12px;
    color: #666;
    padding: 0 10px;
    width: 100%;
    cursor: auto;
    display: block;
    height: 25px;
    text-overflow: clip;
    overflow: hidden;
    white-space: nowrap;
    font-family: UICTFontTextStyleBody;
    min-height: 25px;
  }
  /* 详情项 */
  .detail-item {
    padding: 15px 0;
    border-bottom: 1px solid #e5e5e5;
  }
  .detail-item-info {
    margin-left: 10px;
  }
  /* 内容描述 */
  .content-description {
    height: 200px;
    background: #f8f8ff;
    margin-top: 10px;
  }
  /deep/.input-class {
    min-height: 100px;
    textarea {
      min-height: 100px;
      padding: 10px;
    }
  }
  /deep/.van-hairline--top-bottom::after {
    border: none !important;
  }

  .consult-btn-content {
    position: fixed;
    bottom: 0;
  }
  .consult-btn {
    height: 49px;
    line-height: 49px;
    font-size: 18px;
    background: #cc1414;
    color: #fff;
    padding: 0;
  }
}
</style>
