<template>
  <div class="compile-box w100 h100">
    <van-nav-bar
      :style="{ 'padding-top': $root.barH }"
      :border="false"
      title="单位信息编辑"
      left-arrow
      @click-left="$router.go(-1)"
    />
    <div
      class="compile-content w100"
      :style="{ height: $root.contentHeight + 'px' }"
    >
      <div>
        <div class="compile-b w100">
          <div class="compile-form">
            <div
              v-for="(item, index) in compileName"
              :key="index"
              class="compile w100 flex-align-center-between"
            >
              <div class="compile-name">{{ item.text }}</div>
              <div class="compile-deta">
                <input
                  v-if="item.input"
                  name="item.name"
                  id="index"
                  v-model="compileName[index].value"
                  :placeholder="item.placeholder"
                  placeholder-style="color: #ccc"
                  :disabled="item.disabled"
                  :class="[item.disabled ? 'compile-input' : '']"
                />
                <div
                  class="picker"
                  v-if="item.picker"
                  @click="item.pop = !item.pop"
                >
                  <span
                    class="picker-text"
                    v-if="item.array[item.value] && item.array[item.value].text"
                    >{{
                      item.array[item.value] && item.array[item.value].text
                    }}</span
                  >
                  <span v-else>{{ item.placeholder }}</span>
                  <img
                    :src="require('../../../assets/img/safe/bo1.png')"
                    class="picker-img"
                  />
                  <van-popup
                    v-model="item.pop"
                    :close-on-click-overlay="false"
                    position="bottom"
                    custom-style="height: 40%;"
                  >
                    <van-picker
                      show-toolbar
                      :columns="item.array"
                      @confirm="pickerConfirm($event.id, index)"
                    />
                  </van-popup>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="compile-btn w100">
          <button class="submit" @click="formSubmit">
            立即提交
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  removeBackButton,
  addBackButton,
  dataIsNullObj,
  dataIsNullNumber,
  dataIsNullStr,
  dataIsNullArray
} from "utils/tool";
import {
  updateUnitData,
  getFireUnitHouseRegister,
  getSelectList
} from "utils/api";
export default {
  data() {
    return {
      // 单位id
      unitId: null,
      userlevel: null,
      compileName: [
        {
          text: "单位名称",
          name: "unitName",
          input: true,
          value: "",
          placeholder: "请输入单位名称"
        },
        {
          text: "单位地址",
          name: "dress",
          input: true,
          value: "",
          placeholder: "请输入地址"
        },
        {
          text: "单位类型",
          name: "unitType",
          picker: true,
          pop: false,
          array: [],
          value: null,
          placeholder: "请选择单位类型"
        },
        {
          text: "所属行业",
          name: "industryType",
          picker: true,
          pop: false,
          array: [],
          value: null,
          placeholder: "请选择所属行业"
        },
        {
          text: "监管级别",
          name: "regulateLevel",
          picker: true,
          pop: false,
          array: [],
          value: null,
          placeholder: "请选择监管级别"
        },
        {
          text: "单位联系电话",
          name: "telephone",
          input: true,
          disabled: false,
          value: "",
          placeholder: "请输入联系电话"
        },
        {
          text: "安全管理员",
          name: "personName",
          input: true,
          disabled: true,
          value: "",
          placeholder: "暂无相关信息..."
        },
        {
          text: "值班人员电话",
          name: "personPhone",
          input: true,
          disabled: true,
          value: "",
          placeholder: "暂无相关信息..."
        }
      ],
      num: 0
    };
  },
  methods: {
    formSubmit: function() {
      const value = {};
      let regulateLevel = null;
      let industryType = null;
      let unitType = null;
      this.compileName.forEach(record => {
        value[record.name] = record.value;
      });
      this.compileName[2].array.map((record, index) => {
        if (value.unitType == index) {
          unitType = record.id;
        }
      });
      this.compileName[3].array.map((record, index) => {
        if (value.industryType == index) {
          industryType = record.id;
        }
      });
      this.compileName[4].array.map((record, index) => {
        if (value.regulateLevel == index) {
          regulateLevel = record.id;
        }
      });
      console.log(value);
      let params = {
        // key: parseInt("23BA26BEAC6946FF40C1F8408E68D1B4"),
        key: this.unitId,
        name: value.name,
        address: value.dress,
        unitTypeId: unitType,
        industryTypeId: industryType,
        regulateLevel: regulateLevel,
        telephone: value.telephone,
        unitName: value.unitName
      };
      // console.log(value, params);

      const param = JSON.parse(JSON.stringify(params));
      updateUnitData(param).then(res => {
        this.$toast.clear();
        if (res.code == 0) {
          this.$toast.success("保存成功");
          this.$router.go(-1);
        } else {
          this.$toast.fail("保存失败", "none");
        }
      });
    },
    // 获取回显数据
    getData: function() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0
      });
      let params = {
        // key: "23BA26BEAC6946FF40C1F8408E68D1B4"
        key: this.unitId
      };
      const param = JSON.parse(JSON.stringify(params));
      getFireUnitHouseRegister(param).then(res => {
        const infoData = dataIsNullObj(res.data);
        if (dataIsNullNumber(infoData.unitType) == 0) {
          this.$set(this.compileName[2], "value", null);
        } else {
          this.compileName[2].array.map((record, index) => {
            if (infoData.unitType == record.id) {
              this.$set(this.compileName[2], "value", index);
            }
          });
        }
        if (dataIsNullNumber(infoData.industryType) == 0) {
          this.$set(this.compileName[3], "value", null);
        } else {
          this.compileName[3].array.map((record, index) => {
            if (infoData.industryType == record.id) {
              this.$set(this.compileName[3], "value", index);
            }
          });
        }
        if (dataIsNullNumber(infoData.regulateLevel) == 0) {
          this.$set(this.compileName[4], "value", null);
        } else {
          this.compileName[4].array.map((record, index) => {
            if (infoData.regulateLevel == record.id) {
              this.$set(this.compileName[4], "value", index);
            }
          });
        }

        this.$set(
          this.compileName[0],
          "value",
          dataIsNullStr(infoData.unitName)
        );
        this.$set(
          this.compileName[1],
          "value",
          dataIsNullStr(infoData.address)
        );
        this.$set(
          this.compileName[5],
          "value",
          dataIsNullStr(infoData.telephone)
        );
        this.$set(
          this.compileName[6],
          "value",
          dataIsNullStr(infoData.personName)
        );
        this.$set(
          this.compileName[7],
          "value",
          dataIsNullStr(infoData.personPhone)
        );

        this.$toast.clear();
      });
    },
    // 获取选项
    getSelect: function() {
      // 行业
      const INDUSTRY = "0005003";
      // 监管
      const REGULATORY = "0005002";
      // 单位
      const UNIT = "0005001";
      let paramsJg = {
        pKey: INDUSTRY
      };
      const paramJg = JSON.parse(JSON.stringify(paramsJg));
      getSelectList(paramJg).then(res => {
        const datas = dataIsNullArray(res.data);
        let data = [];
        datas.map(record => {
          data.push({
            id: record.key,
            text: `${record.title}`
          });
        });
        this.$set(this.compileName[3], "array", data);
        this.num++;
      });
      let paramsXz = {
        pKey: REGULATORY
      };
      const paramXz = JSON.parse(JSON.stringify(paramsXz));
      getSelectList(paramXz).then(res => {
        const datas = dataIsNullArray(res.data);
        let data = [];
        datas.map(record => {
          data.push({
            id: record.key,
            text: record.title
          });
        });
        this.$set(this.compileName[4], "array", data);
        this.num++;
      });
      let paramsDw = {
        pKey: UNIT
      };
      const paramDw = JSON.parse(JSON.stringify(paramsDw));
      getSelectList(paramDw).then(res => {
        const datas = dataIsNullArray(res.data);
        let data = [];
        datas.map(record => {
          data.push({
            id: record.key,
            text: record.title
          });
        });
        this.$set(this.compileName[2], "array", data);
        this.num++;
      });
    },
    pickerConfirm(id, index) {
      this.$set(
        this.compileName[index],
        "value",
        this.compileName[index].array.findIndex(item => item.id === id)
      );
    }
  },
  created() {
    this.unitId = this.$route.query.id;
    this.userlevel = this.$route.query.userlevel;
    this.getSelect();
  },
  mounted() {
    this.$root.backBtnFn = this.$root.goBack;
    // 移除监听home键回退首页
    removeBackButton(this.$root.backBtnFn);
    // 添加监听home键回退
    addBackButton(this.$root.backBtnFn);
    this.$root.navH = document.querySelector(".van-nav-bar").offsetHeight;
  },
  watch: {
    num(data) {
      if (data == 2) {
        this.getData();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.compile-box {
  background-color: #efeff4;
  .van-nav-bar {
    background: #0e41a6;
  }
  .compile-content {
    overflow: hidden;
    position: relative;
  }

  .compile-b {
    box-sizing: border-box;
    padding: 10px;
    height: calc(100% - 40px);
  }

  .compile-btn {
    height: 49px;
    position: fixed;
    bottom: 0;
    left: 0;
  }

  .compile-form {
    border-radius: 5px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 10px 16px;
    max-height: 100%;
    overflow: auto;
  }

  .compile {
    height: 35px;
    box-sizing: border-box;
    border-bottom: 1px solid #e8e8e8;
    color: #666;
    font-size: 12px;
  }

  .compile-name {
    width: 40%;
  }

  .compile-deta {
    width: 66%;
  }

  .compile-input {
    color: #b2b2b2;
  }

  .picker {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .picker-text {
    width: calc(100% - 20px);
  }

  .picker-img {
    display: block;
    width: 16px;
    height: 16px;
  }

  .compile-btn button {
    width: 50%;
    height: 100%;
    box-sizing: border-box;
    border: none;
    border-top: 1px solid #dddddd;
    border-radius: 0;
    background-color: #e8e8e8;
    font-size: 18px;
    color: #666;
    line-height: 49px;
  }

  .compile-btn .submit {
    width: 100% !important;
    background-color: #cc1414;
    border-top: 1px solid #028ad9;
    color: #fff;
  }
}
</style>
