<template>
  <div class="cpwd container h100">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      :border="false"
      title="修改密码"
      left-arrow
      @click-left="$router.go(-1)"
    >
      <!-- <template #left>
        <nav-back title="修改密码"></nav-back>
      </template> -->
    </van-nav-bar>

    <div class="content">
      <list-title>修改密码</list-title>
      <div class="pwd-content">
        <div class="input-item">
          <input
            class="pwd-input"
            v-model="oldPassword"
            placeholder-style="font-size: 24rpx;color: #999"
            placeholder="请输入旧密码"
          />
        </div>
        <div class="input-item">
          <input
            class="pwd-input"
            v-model="newPassword"
            bindinput="changeNewPwd"
            type="password"
            placeholder-style="font-size: 24rpx;color: #999"
            placeholder="请设置新密码"
          />
        </div>
        <div class="input-item">
          <input
            class="pwd-input"
            type="password"
            v-model="rNewPassword"
            placeholder-style="font-size: 24rpx;color: #999"
            placeholder="请再次输入新密码"
          />
        </div>
        <div class="w100 changepwd-submit">
          <van-button
            :loading="loading"
            type="danger"
            @click="formSubmit"
            square
            >提交</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { updatePassword } from "utils/api";
import {
  removeBackButton,
  addBackButton,
  dataIsNullNumber
} from "@/utils/tool";
import ListTitle from "components/pub/ListTitle";

export default {
  components: {
    ListTitle
  },
  data() {
    return {
      loading: false,
      oldPassword: "",
      newPassword: "",
      rNewPassword: ""
    };
  },
  methods: {
    formSubmit() {
      const userId = this.user.userId;
      if (!userId) return;
      const oldPassword = this.oldPassword.trim();
      const newPassword = this.newPassword.trim();
      const rNewPassword = this.rNewPassword.trim();
      let msg = "";
      if (!newPassword) msg = "请输入新密码";
      if (!oldPassword) msg = "请输入旧密码";
      if (newPassword && rNewPassword !== newPassword) msg = "重复密码错误";
      if (msg) return this.$toast.fail(msg);

      this.loading = true;
      updatePassword({ oldPassword, newPassword }).then(res => {
        this.loading = false;
        if (dataIsNullNumber(res.code) === 0) {
          this.$toast.success("修改成功！");
          setTimeout(() => {
            this.$router.go(-1);
          }, 300);
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
  },
  computed: {
    ...mapGetters(["user"])
  }
};
</script>

<style lang="scss" scoped>
.cpwd {
  .van-nav-bar {
    background: #0e41a6;
  }
  .content {
    margin: 10px;
    background-color: #fff;
  }
  .pwd-content {
    padding: 10px;
  }
  .input-item {
    padding: 15px 0;
  }
  .pwd-input {
    width: 100%;
    height: 36px;
    border: 1px solid #efeff4;
    border-radius: 25px;
    padding: 5px 15px;
    font-size: 14px;
    color: #999;
    &::-webkit-input-placeholder {
      color: #999;
    }

    &::-moz-input-placeholder {
      color: #999;
    }

    &::-ms-input-placeholder {
      color: #999;
    }
  }
  .changepwd-submit {
    position: fixed;
    bottom: 0;
    left: 0;
  }
  /deep/ .van-button--danger {
    width: 100%;
    height: 49px;
    font-size: 18px;
  }
}
</style>
