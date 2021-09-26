<template>
  <div class="search-comp">
    <div class="select h100" @click="selectHandle">
      {{ selectOption && selectOption.text ? selectOption.text : "请选择" }}
    </div>
    <div class="input-box">
      <!-- <image src="../../images/search.png" class="bo" /> -->
      <input
        type="text"
        class="search-input"
        name="search"
        placeholder-style="color:#7597d7;"
        :placeholder="placehodler"
        v-model="inputValue"
        @keyup.enter="onIconSearch"
        confirm-type="搜索"
      />
      <van-icon name="search" size="20px" @click="onIconSearch" />
    </div>
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="selectArrayData"
        @cancel="showPicker = false"
        @confirm="bindPickerChange"
      />
    </van-popup>
  </div>
</template>
<script>
export default {
  props: {
    selectArray: {
      type: Array,
      default: () => {
        return [];
      }
    },
    placehodler: {
      type: String,
      value: ""
    }
  },
  watch: {
    selectArray: {
      handler: function(v) {
        if (v.length > 0) {
          this.selectArrayData = v.map(({ key, pKey, title }) => {
            return {
              key,
              pKey,
              text: title,
              value: key
            };
          });
          this.selectOption = this.selectArrayData[0];
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      // 默认选择
      index: 0,
      // 输入框内容
      inputValue: "",
      selects: [],
      showPicker: false,
      selectOption: {},
      selectArrayData: []
    };
  },
  methods: {
    // 选中修改
    bindPickerChange(item) {
      this.index = item.value;
      this.selectOption = item;
      this.$emit("searchInfo", {
        select: this.index,
        text: this.inputValue.replace(/\s+/g, "")
      });
      this.showPicker = false;
    },
    // 输入框内容
    // bindSearchInput: function() {
    //   this.$emit("searchInfo", {
    //     select: this.index,
    //     text: this.inputValue.replace(/\s+/g, "")
    //   });
    // },
    // 图标查询
    onIconSearch() {
      this.$emit("searchInfo", {
        select: this.index,
        text: this.inputValue.replace(/\s+/g, "")
      });
    },
    // 选择处理
    selectHandle() {
      this.showPicker = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.search-comp {
  overflow: hidden;
  height: 45px;
  box-sizing: border-box;
  border-bottom: 1px solid #d6dbdb;
  padding: 0 10px;
  /* background: #0e4bba; */
  background-image: linear-gradient(#0e43aa, #0e50c4);
  display: flex;
}

.select {
  width: 70px;
  font-size: 10px;
  background: #275fc5;
  color: #a9bee5;
  height: 30px;
  line-height: 30px;
  border-radius: 5px;
  /* padding: 5rpx; */
  display: flex;
  align-items: center;
  justify-content: center;
}

.picker {
  margin-right: 8px;
}
.slect-item {
  padding: 0 6.5px;
}

.bo {
  width: 10px;
  height: 6px;
}

.input-box {
  width: calc(100% - 70px);
  height: 30px;
  line-height: 30px;
  /* border: 1px solid #ddd; */
  border-radius: 5px;
  box-sizing: border-box;
  padding: 0 5px;
  font-size: 10px;
  color: #6b90d4;
  background: #275cbe;
  display: flex;
  align-items: center;
}

.search-input {
  width: 90%;
  margin-left: 5px;
  background: #275cbe;
  color: #6b90d4;
  &::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #6b90d4;
  }
  &:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    color: #6b90d4;
  }
  &::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: #6b90d4;
  }
  &:-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: #6b90d4;
  }
}
</style>
