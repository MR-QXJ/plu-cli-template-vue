// 详情
<template>
  <drawer-confirm
    destroyOnClose
    title="xx详情"
    :hide-ok="true"
    :submitting="detailLoading"
    :visible="visible"
    :width="'400'"
    @visibleChange="handleVisibleChange"
    @cancel="handleCancel"
  >
    <template v-slot:content>
      <section class="h100 w100 content">
        <form-details-normal
          ref="formDetails"
          :label-col="formDetailsLabelCol"
          :wrapper-col="formDetailsWrapperCol"
          :config="formDetailsConfigs"
        />
      </section>
    </template>
  </drawer-confirm>
</template>

<script>
import DrawerConfirm from "components/common/feedback/DrawerConfirm.vue";
import FormDetailsNormal from "components/common/form/FormDetailsNormal.vue";
import { dataIsNullObj } from "utils/common";
import {
  formatMomentDate,
  formatMomentTime,
  formatMomentTimeNoSecond
} from "constants/global";
// import { getDetailsIotSystem } from "request/iot-system";

export default {
  components: {
    DrawerConfirm,
    FormDetailsNormal
  },
  props: {
    // 操作key
    operateKey: {
      type: String,
      default: ""
    },
    // 是否显示
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 是否加载数据
      detailLoading: false,
      // 表单详情配置
      formDetailsConfig: {
        items: [
          {
            key: "code",
            editType: "input",
            dataKey: "sysCoding",
            submitClearSpace: true,
            visible: true,
            label: "标签1"
          },
          {
            key: "introduction",
            editType: "textarea",
            dataKey: "sysProfile",
            submitClearSpace: true,
            visible: true,
            label: "简介"
          },
          {
            key: "updateTime",
            editType: "datetime",
            dataKey: "updateTime",
            visible: true,
            label: "更新时间"
          }
        ]
      }
    };
  },
  computed: {
    // 表单详情栅格布局标题布局
    formDetailsLabelCol() {
      return {
        xs: { span: 24 },
        sm: { span: 8 }
      };
    },
    // 表单详情栅格布局控件布局
    formDetailsWrapperCol() {
      return {
        xs: { span: 24 },
        sm: { span: 16 }
      };
    },
    // 表单详情配置
    formDetailsConfigs() {
      let config = this.formDetailsConfig;
      // 日期时间格式
      config.items.map(item => {
        switch (item.editType) {
          case "date":
          case "daterange":
            {
              if (!item.dateTimeOption) {
                item.dateTimeOption = {};
              }
              item.dateTimeOption.format = formatMomentDate;
            }
            break;
          case "datetime":
          case "datetimerange":
            {
              if (!item.dateTimeOption) {
                item.dateTimeOption = {};
              }
              item.dateTimeOption.format = formatMomentTime;
            }
            break;
          case "datetimenosecond":
          case "datetimenosecondrange":
            {
              if (!item.dateTimeOption) {
                item.dateTimeOption = {};
              }
              item.dateTimeOption.format = formatMomentTimeNoSecond;
            }
            break;
        }
      });
      return config;
    }
  },
  methods: {
    // 获取详情
    getDetail() {
      this.detailLoading = true;
      let apiParams = {
        key: this.operateKey
      };
      setTimeout(() => {
        this.detailLoading = false;
        apiParams = null;
        let data = {
          sysCoding: "dasdasxzcz",
          sysProfile: "介绍"
        };
        let formDetails = this.$refs["formDetails"];
        if (formDetails && formDetails.setValuesByConfig) {
          this.formDetailsConfig = {
            ...formDetails.setValuesByConfig(data, this.formDetailsConfig)
          };
        }
        data = null;
        formDetails = null;
      }, 1000);
      // getDetailsIotSystem(apiParams).then(res => {
      //   this.detailLoading = false;
      //   apiParams = null;
      //   let data = dataIsNullObj(res.data);
      //   let formDetails = this.$refs["formDetails"];
      //   if (formDetails && formDetails.setValuesByConfig) {
      //     this.formDetailsConfig = {
      //       ...formDetails.setValuesByConfig(data, this.formDetailsConfig)
      //     };
      //   }
      //   data = null;
      //   formDetails = null;
      // });
    },
    // 切换可见
    handleVisibleChange(visible) {
      if (!visible) {
        return;
      }
      if (this.operateKey === "") {
        return;
      }
      this.getDetail();
    },
    // 取消
    handleCancel() {
      let formDetails = this.$refs["formDetails"];
      if (formDetails && formDetails.clearValuesByConfig) {
        this.formDetailsConfig = {
          ...formDetails.clearValuesByConfig(this.formDetailsConfig)
        };
      }
      formDetails = null;
      this.$emit("cancel");
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  padding: 20px 20px 20px 0;
}
</style>
