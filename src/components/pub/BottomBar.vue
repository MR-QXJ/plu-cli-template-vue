<template>
  <div class="bottom-bar">
    <div class="bar-wrap">
      <div class="bar-item" v-for="(item, i) in barOptions" :key="i">
        <div class="bar-scan-btn" v-if="item.scan">
          <img :src="item.icon" alt="" />
        </div>
        <div class="bar-icon" v-else @click="goPage(item)">
          <img v-if="item.active" :src="item.iconA" alt="" />
          <img v-else :src="item.icon" alt="" />
        </div>
        <p :class="item.active ? 'active-text' : ''">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      barOptions: [
        {
          icon: require("assets/img/pub/home.png"),
          iconA: require("assets/img/pub/home_ac.png"),
          name: "首页",
          path: "/index",
          active: false
        },
        {
          icon: require("assets/img/pub/profile.png"),
          iconA: require("assets/img/pub/profile_ac.png"),
          name: "我的",
          path: "/profile",
          active: false
        }
      ]
    };
  },
  methods: {
    goPage(item) {
      this.$router.push(item.path);
    }
  },
  mounted() {
    this.barOptions.forEach(e => {
      if (e.path === this.$route.path) {
        e.active = true;
      }
    });
  }
};
</script>
<style lang="scss">
.bottom-bar {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 50px;
  background: #fff;
  .bar-wrap {
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .bar-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      .bar-scan-btn {
        z-index: 10;
        margin-top: -27px;
        height: 50px;
        width: 50px;
        background: #053f59;
        border-radius: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          height: 40px;
          width: 40px;
        }
      }
      .bar-icon {
        img {
          height: 24px;
          width: 20px;
          margin: 0 auto;
        }
      }
      p {
        text-align: center;
        font-size: 12px;
        color: #999;
        &.active-text {
          color: #1242a5;
        }
      }
    }
  }
}
</style>
