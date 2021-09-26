<template>
  <div class="login h100 w100">
    <van-nav-bar :style="{ 'padding-top': $root.barH }" :border="false">
      <template #left>
        <nav-back></nav-back>
      </template>
    </van-nav-bar>

    <img
      class="w100 login-top-image"
      :src="require('../assets/img/login/top.png')"
    />
    <img
      class="w100 login-fire"
      :src="require('../assets/img/login/login_state.png')"
    />
    <img
      class="w100 login-down-image"
      :src="require('../assets/img/login/down.png')"
    />
    <div class="login-form">
      <div class="form-item">
        <div class="form-title">用户</div>
        <input
          class="form-input"
          v-model="userName"
          autocomplete="off"
          placeholder="请输入用户名"
        />
      </div>
      <div class="form-item">
        <div class="form-title">密码</div>
        <input
          autocomplete="off"
          class="form-input"
          type="password"
          v-model="userPwd"
          @keyup.enter="formSubmit"
          placeholder="请输入密码"
        />
      </div>
      <div class="w100 form-login">
        <button class="form-btn" @click="formSubmit">
          登 录
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {
  removeBackButton,
  addBackButton,
  dataIsNullNumber
} from "@/utils/tool";

import { login } from "utils/api";
export default {
  data() {
    return {
      userName: "",
      userPwd: "",
      into: ""
    };
  },
  methods: {
    ...mapActions(["setUser", "clearUser"]),
    formSubmit() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      let route = null;
      if (this.into === "5") {
        route = "/fireSafety?icon=index";
      } else if (this.into === "6") {
        route = "/hiddenReport?icon=index";
      } else {
        route = "/index?isLogin=1";
      }
      const username = this.userName.trim();
      const password = this.userPwd.trim();
      login({ username, password }).then(res => {
        this.$toast.clear();
        if (dataIsNullNumber(res.code) === 0) {
          this.setUser(res.data);
          this.$toast.success("登录成功");
          setTimeout(() => {
            this.$router.replace(route);
          }, 500);
          return;
        }
        this.$toast.fail(res.message);
      });
    }
  },
  created() {
    this.into = this.$route.query.into;
  },
  mounted() {
    this.$root.backBtnFn = this.$root.goBack;
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // 添加监听home键回退
    addBackButton(this.$root.backBtnFn);
  }
};
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  min-height: 640px;
  background: linear-gradient(#102e82, #0d51c5);
  /deep/ .van-nav-bar {
    background: transparent;
  }
  /* 右上图 */
  .login-top-image {
    position: absolute;
    width: 287px;
    height: 250px;
    top: 0;
    right: 0;
  }

  /* 掌上消防 */
  .login-fire {
    width: 69px;
    height: 59px;
    margin: 120px 0 0 38px;
  }
  /* 左下图 */
  .login-down-image {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 167px;
    height: 187px;
  }
  /* 登陆表单 */
  .login-form {
    // position: absolute;
    // top: 55%;
    // left: 50%;
    // transform: translateY(-50%);
    width: 300px;
    margin: 40px auto 0;
  }
  /* 登陆输入项 */
  .form-item {
    margin-bottom: 20px;
  }

  /* 登陆标题 */
  .form-title {
    font-size: 16px;
    color: #748acd;
    margin-bottom: 10px;
  }

  /* input样式 */
  .form-input {
    width: 300px;
    height: 39px;
    background: #0e3386;
    padding: 0 15px;
    border-radius: 3px;
    font-size: 14px;
    color: #8799c3;
    &::-webkit-input-placeholder {
      color: #8799c3;
    }

    &::-moz-input-placeholder {
      color: #8799c3;
    }

    &::-ms-input-placeholder {
      color: #8799c3;
    }
  }

  /* 登陆按钮 */
  .form-login {
    height: 46px;
    line-height: 46px;
    font-size: 18px;
  }
  .form-btn {
    display: block;
    border-radius: 25px;
    text-align: center;
    width: 150px !important;
    margin: 0 auto;
    background: #0e3386;
    color: #fefefe;
  }
}
// @media (max-height: 500px) {
//   .login {
//     min-height: 600px;
//   }
//   .login-down-image {
//     display: none;
//   }
// }
</style>
