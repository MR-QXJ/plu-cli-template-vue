//多行文本截断，支持任意宽度、行数、省略字符，尾部插槽
<template>
  <div class="clamp-wrap" :style="wrapStyle">
    <span class="clamp-box" :style="boxStyle">
      <span class="clamp-text">{{ showText }}</span>
      <span class="after" v-if="$slots.after"><slot name="after"/></span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    //总宽
    width: {
      type: Number,
      default: 320
    },
    //折叠时的行数
    line: {
      type: Number,
      default: 2
    },
    //原文本
    preText: {
      type: String,
      default: "请传入原文本到preText"
    },
    //是否折叠
    collapse: {
      type: Boolean,
      default: true
    },
    //文本末尾省略符
    ellipsis: {
      type: String,
      default: "..."
    }
  },
  data() {
    return {
      //容器行高
      lineH: 0,
      //容器padding
      paddingH: 0,
      //尾部插槽高度
      afterH: 0,
      //正在计算
      changing: false,
      //计算后的文本
      calcuText: ""
    };
  },
  methods: {
    //计算结果文本
    async calcShowText() {
      this.getLimitH();
      const _this = this;
      const preT = this.preText.split("");
      const textWrap = document.querySelector(".clamp-wrap");
      const textClamp = document.querySelector(".clamp-text");

      const symbol = this.ellipsis;
      const symbolLen = this.ellipsis.length;

      this.changing = true;

      const tLen = preT.length;
      let t;
      for (let i = 0; i < tLen; i++) {
        const preShowText = this.calcuText;
        t = preT[i];
        if (preShowText.endsWith(symbol)) {
          this.calcuText = preShowText.substring(
            0,
            preShowText.length - symbolLen
          );
        }

        this.calcuText += t + symbol;

        const overflow = await getStrEnd();

        if (overflow) {
          break;
        } else if (i === tLen - 1) {
          //在限制高度内，去除省略符
          this.calcuText = this.calcuText.substring(
            0,
            this.calcuText.length - symbolLen
          );
        }
      }
      this.changing = false;

      function getStrEnd() {
        return new Promise(resolve => {
          _this.$nextTick(() => {
            let curStr = textClamp.innerHTML;
            const h = textWrap.offsetHeight;
            //是否高度溢出
            let overflow = false;
            if (h > _this.limitH) {
              const len = curStr.length;
              _this.calcuText =
                curStr.substring(0, len - (symbolLen + 1)) + symbol;
              overflow = true;
            }
            resolve(overflow);
          });
        });
      }
    },
    //获取影响高度的要素
    getLimitH() {
      const wrapStyle = getComputedStyle(document.querySelector(".clamp-wrap"));
      this.afterH = this.$slots.after
        ? parseInt(document.querySelector(".after")?.offsetHeight)
        : 0;
      this.paddingH =
        parseInt(wrapStyle.paddingTop) + parseInt(wrapStyle.paddingBottom);
      this.lineH = parseInt(wrapStyle.lineHeight);
    }
  },
  mounted() {
    this.calcShowText();
  },
  computed: {
    boxStyle() {
      return {
        visibility: this.changing ? "hidden" : "visible"
      };
    },
    wrapStyle() {
      return {
        width: this.width + "px"
      };
    },
    showText() {
      return this.collapse ? this.calcuText : this.preText;
    },
    //折叠状态的限制高度
    limitH() {
      const line = this.line;
      const lineH = this.lineH;
      const afterH = this.afterH;
      const afterAdd = afterH > lineH ? afterH : lineH;
      return lineH * (line - 1) + this.paddingH + afterAdd;
    }
  }
};
</script>

<style lang="scss" scoped>
.clamp-wrap {
  box-sizing: border-box;
  .after {
    display: inline-block;
    margin-left: 10px;
  }
}
</style>
