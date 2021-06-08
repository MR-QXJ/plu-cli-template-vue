<template>
  <div class="w100 h100 login">
    <div class="title">
      <div class="logo"></div>
      <div>和航科技办公业务系统</div>
    </div>
    <div class="login-container">
      <div class="title">
        <div>用户登录</div>
        <div>Login</div>
      </div>
      <a-form :form="formLogin" :hideRequiredMark="true" class="formlogin">
        <a-form-item>
          <a-input
            autocomplete="off"
            autoFocus
            class="ant-input-group-addon-blue"
            :max-length="16"
            placeholder="用户名"
            size="large"
            v-decorator="[
              'name',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入用户名！'
                  },
                  {
                    validator: validNameHandle
                  }
                ]
              }
            ]"
          >
            <a-icon
              style="font-size:20px;color:white;"
              type="user"
              slot="addonBefore"
            />
          </a-input>
        </a-form-item>
        <div class="place"></div>
        <a-form-item>
          <a-input
            autocomplete="off"
            class="ant-input-group-addon-blue"
            :type="showPass ? '' : 'password'"
            :max-length="16"
            placeholder="密码"
            size="large"
            v-decorator="[
              'pass',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入密码！'
                  },
                  {
                    validator: validPassHandle
                  }
                ]
              }
            ]"
            @keyup.enter="loginHandle"
          >
            <a-icon
              style="font-size:20px;color:white"
              type="lock"
              slot="addonBefore"
            />
          </a-input>
          <a-icon
            class="eye"
            style="font-size:20px"
            :type="showPass ? 'eye' : 'eye-invisible'"
            @click="showPass = !showPass"
          />
        </a-form-item>
        <div class="place"></div>
        <a-form-item>
          <a-row>
            <a-col :span="14">
              <a-input
                autocomplete="off"
                class="ant-input-group-addon-blue"
                :max-length="6"
                placeholder="验证码"
                size="large"
                @keyup.enter="loginHandle"
                v-decorator="[
                  'code',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入验证码！'
                      }
                    ]
                  }
                ]"
              >
                <a-icon
                  style="font-size:20px;color:white"
                  type="safety-certificate"
                  slot="addonBefore"
                />
              </a-input>
            </a-col>
            <a-col :span="7" :offset="3" style="position:relative">
              <a-spin :spinning="captchaLoading" class="spin-loading"></a-spin>
              <img
                style="width:95px;height:34px"
                :src="captchaUrl"
                alt=""
                @click="getCaptchaHandle"
              />
            </a-col>
          </a-row>
        </a-form-item>
        <div class="place"></div>
        <a-checkbox
          :checked="rememberPwd"
          @change="rememberPwd = !rememberPwd"
          style="margin-bottom:10px;"
        >
          记住密码
        </a-checkbox>
        <a-button
          class="submitBtn"
          @click="loginHandle"
          :loading="submitLoading"
          >登&emsp;录</a-button
        >
      </a-form>
    </div>
  </div>
</template>

<script>
// import { storageNameUser } from "@/utils/global";
// import { getCaptcha, login, getLoginInfo, GETIMG } from "@/utils/api";
import { dataIsNullStr, dataIsNullNumber, dataIsNullObj } from "@/utils/tool";
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      formLogin: this.$form.createForm(this),
      verification: null,
      showPass: false,
      rememberPwd: false,
      captchaUrl: "",
      captchaId: "",
      submitLoading: false,
      captchaLoading: false
    };
  },
  computed: {
    ...mapGetters(["navMenuKey"])
  },
  // methods: {
  //   ...mapActions(["setUser", "clearUser"]),
  //   //获取验证码
  //   getCaptchaHandle() {
  //     this.captchaLoading = true;
  //     getCaptcha().then(res => {
  //       this.captchaLoading = false;
  //       const code = dataIsNullNumber(res.code);
  //       if (code == 0) {
  //         const data = dataIsNullObj(res.data);
  //         this.captchaUrl = data.captchaData;
  //         this.captchaId = data.captchaId;
  //       }
  //     });
  //   },
  //   //登录
  //   loginHandle() {
  //     // 验证表单
  //     this.formLogin.validateFieldsAndScroll((err, values) => {
  //       if (!err) {
  //         this.submitLoading = true;
  //         // 防止token未清除
  //         localStorage.removeItem(storageNameUser);
  //         const params = {
  //           username: values.name,
  //           password: values.pass,
  //           cacheId: this.captchaId,
  //           verifyCode: values.code
  //         };
  //         login(params).then(res => {
  //           this.submitLoading = false;
  //           const code = dataIsNullNumber(res.code);
  //           if (code == 0) {
  //             if (this.rememberPwd) {
  //               localStorage.setItem("username", values.name);
  //             } else {
  //               localStorage.removeItem("username");
  //             }

  //             const data = dataIsNullObj(res.data);
  //             const token = dataIsNullStr(data.token);
  //             const state = dataIsNullNumber(data.state, -1);
  //             switch (state) {
  //               case 0:
  //                 {
  //                   // 登录成功
  //                   const user = {};
  //                   user.token = token;
  //                   // 获取登录用户信息
  //                   getLoginInfo(token).then(res => {
  //                     const code = dataIsNullNumber(res.code);
  //                     if (code === 0) {
  //                       const data = dataIsNullObj(res.data);
  //                       user.userName = dataIsNullStr(data.userName);
  //                       user.realName = dataIsNullStr(data.personName);
  //                       user.avatarImg = dataIsNullStr(data.personImage);
  //                       user.userId = dataIsNullStr(data.userId);
  //                       user.orgId = dataIsNullStr(data.orgId);
  //                       user.orgName = dataIsNullStr(data.orgName);
  //                       user.avatarImg =
  //                         user.avatarImg !== ""
  //                           ? `${GETIMG}${user.avatarImg}`
  //                           : user.avatarImg;
  //                       this.goPage(user);
  //                     }
  //                   });
  //                 }
  //                 break;
  //               // case 1:
  //               //   {
  //               //     // 手机号码未验证
  //               //     this.bindMobile(userId, mobile);
  //               //   }
  //               //   break;
  //               // case 2:
  //               //   {
  //               //     // 账户审核中
  //               //     this.$root.showMessage("warning", note);
  //               //   }
  //               //   break;
  //               //   case 3:
  //               //     {
  //               //       // 账户申请驳回

  //               //       window.sessionStorage.setItem(
  //               //         storageNameRegCheckReason,
  //               //         JSON.stringify({ noPass: true, note: note })
  //               //       );
  //               //       this.register();
  //               //     }
  //               //     break;
  //               // }
  //             }
  //           } else {
  //             this.getCaptchaHandle();
  //             this.clearUser();
  //           }
  //         });
  //       }
  //     });
  //   },
  //   // 跳转页面
  //   goPage: function(user) {
  //     if (user) {
  //       this.setUser(user);
  //     }
  //     // 跳转到被弹出页面，否则首页
  //     const redirect = this.$route.query ? this.$route.query.redirect : null;
  //     if (redirect && this.navMenuKey) {
  //       this.$router.push({
  //         path: redirect
  //       });
  //     } else {
  //       this.$router.push({ path: "/" });
  //     }
  //   },
  //   // 切换是否显示密码
  //   togglePassHandle: function() {
  //     this.showPass = !this.showPass;
  //   },
  //   // 验证用户名
  //   validNameHandle: function(rule, value, callback) {
  //     if (dataIsNullStr(value) === "") {
  //       callback();
  //       return;
  //     }
  //     const checkRes = this.verification.checkUserName(value);
  //     if (!checkRes.res) {
  //       callback(`请输入${checkRes.msg}！`);
  //       return;
  //     }
  //     callback();
  //   },
  //   // 验证密码
  //   validPassHandle: function(rule, value, callback) {
  //     if (dataIsNullStr(value) === "") {
  //       callback();
  //       return;
  //     }
  //     if (value.length < 6) {
  //       callback("请输入至少6位密码！");
  //       return;
  //     }
  //     if (value.length > 16) {
  //       callback("请输入6-16位密码！");
  //       return;
  //     }
  //     const checkRes = this.verification.checkPass(value);
  //     if (!checkRes.res) {
  //       callback(`请输入${checkRes.msg}！`);
  //       return;
  //     }
  //     callback();
  //   }
  // },
  mounted() {
    let storageUser = localStorage.getItem("username");
    if (storageUser) {
      this.rememberPwd = true;
      this.formLogin.setFieldsValue({
        name: storageUser
      });
    }
    this.getCaptchaHandle();
    // eslint-disable-next-line
    this.verification = new Verification.Init();
  }
};
</script>

<style lang="scss" scoped>
@keyframes scale-title {
  0% {
    transform: translateX(-50%) scale(0.6);
    opacity: 0;
  }
  100% {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
}
@keyframes scale-container {
  0% {
    width: 630px;
    height: 408px;
    transform: translate(-50%, -50%) scale(0.4);
    opacity: 0;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    width: 630px;
    height: 408px;
  }
}
</style>
