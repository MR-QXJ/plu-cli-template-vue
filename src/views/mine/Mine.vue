<template>
  <div class="mine container w100 h100">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      title="掌上消防"
      :border="false"
    />
    <div class="page-container">
      <!-- 头部登录box -->
      <div class="page-top"></div>
      <div class="w100 mine-container">
        <div class="h100 mine-tram">
          <div class="h100 mine-box" :style="`top:${barHeight}px`">
            <div class="h100 mine-login">
              <img :src="avatarUrl" class="avatar" @click="loginHandler" />
              <div class="btn" @click="loginHandler">
                {{ isLogin ? "退出登录" : "点击登录" }}
              </div>
            </div>

            <div class="mine-tool">
              <list-title>我的工具</list-title>
              <ul class="list">
                <li @click="changePwd">
                  修改密码
                  <span class="van-icon van-icon-arrow"></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <bottom-bar />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import BottomBar from "components/pub/BottomBar.vue";
import ListTitle from "components/pub/ListTitle";
import { removeBackButton, addBackButton } from "@/utils/tool";
export default {
  components: {
    BottomBar,
    ListTitle
  },
  data() {
    return {
      // 导航栏高
      barHeight: 0,
      avatarUrl: require("../../assets/img/login/avtor.png")
    };
  },
  methods: {
    ...mapActions(["clearUser"]),
    loginHandler() {
      if (this.isLogin) {
        this.$dialog
          .confirm({
            title: "提示",
            message: "确定要退出登录？"
          })
          .then(() => {
            this.$toast.loading({
              message: "加载中...",
              forbidClick: true,
              duration: 0
            });
            this.clearUser();
            setTimeout(() => {
              this.$toast.success("退出成功！");
            }, 400);
          })
          .catch(() => {});
      } else {
        this.$router.push("/login");
      }
    },
    changePwd() {
      if (this.isLogin) {
        return this.$router.push("/changePwd");
      }
      this.$toast.fail("请先登录!");
    }
  },
  computed: {
    ...mapGetters(["user"]),
    isLogin() {
      return !!this.user.userId;
    }
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
.mine {
  .van-nav-bar {
    background: #0e41a6;
    /deep/.van-nav-bar__title {
      color: #fff;
    }
  }
  &-tram {
    padding: 0 10px;
  }
  .page-container {
    position: relative;
    height: calc(100% - 66px);
    overflow: hidden;
  }

  .page-top {
    height: 129px;
    background: #0e41a6;
  }

  &-container {
    height: 174px;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
  }
  &-box {
    flex-wrap: wrap;
    background: #fff url("../../assets/img/login/copy10.png") no-repeat;
    background-size: 100% 100%;
    border-radius: 5px;
    .mine-login {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-bottom: 24px;
      .avatar {
        width: 64px;
        height: 64px;
      }
      .btn {
        margin-top: 6px;
        font-size: 14px;
        color: #4a4a4a;
      }
    }
  }
  &-tool {
    background-color: #fff;
    margin-top: 20px;
    font-size: 13px;
    border-radius: 5px;
    .list {
      padding: 0 12px 0 16px;
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 50px;
        color: #666;
      }
    }
  }
}
</style>
