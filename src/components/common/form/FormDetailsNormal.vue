// 表单详情（常规）
<template>
  <a-form
    ref="form"
    class="w100"
    :form="form"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-row :gutter="24">
      <a-col
        :key="item.key"
        :xs="24"
        :sm="24"
        :md="24"
        :lg="24"
        :xl="colSpan"
        :xxl="colSpan"
        v-for="item in itemsVisibled"
      >
        <a-form-item
          :colon="
            item.labelColon === undefined || item.labelColon ? true : false
          "
          :label="item.label"
          :label-col="item.viewFull ? { span: 0 } : labelCol"
          :wrapper-col="item.viewFull ? { span: 24 } : wrapperCol"
          :style="item.editType === 'diy' ? { marginBottom: 0 } : {}"
        >
          <!-- 自定义项 -->
          <section v-if="item.editType === 'diy'">
            <slot :name="item.diyName" :item="item"></slot>
          </section>
          <!-- 操作项 -->
          <section v-if="item.editType === 'operation'">
            <slot :name="item.diyName" :item="item"></slot>
          </section>
          <!-- 输入框 -->
          <section class="w100 row" v-if="item.editType === 'input'">
            <span
              class="w100 ant-form-text"
              :title="item.value"
              v-cloak
              v-if="item.editType === 'input'"
            >
              {{ item.value }}
            </span>
            <section class="item-operation" v-if="item.needOperation">
              <slot :name="`${item.key}Operation`" :item="item"></slot>
            </section>
          </section>
          <!-- 数字输入框 -->
          <span
            class="ant-form-text"
            :title="
              `${item.value}${
                item.suffix !== undefined && item.suffix !== null
                  ? item.suffix
                  : ''
              }`
            "
            v-cloak
            v-if="item.editType === 'inputnumber'"
          >
            {{
              `${item.value}${
                item.suffix !== undefined && item.suffix !== null
                  ? item.suffix
                  : ""
              }`
            }}
          </span>
          <!-- 文本框 -->
          <span
            class="ant-form-text"
            :title="item.value"
            v-cloak
            v-if="item.editType === 'textarea'"
          >
            {{ item.value }}
          </span>
          <!-- 自动完成输入框 -->
          <span
            class="ant-form-text"
            :title="item.value"
            v-cloak
            v-if="item.editType === 'autocomplete'"
          >
            {{ item.value }}
          </span>
          <!-- 下拉框 -->
          <span
            class="ant-form-text"
            :title="item.value"
            v-cloak
            v-if="item.editType === 'select' || item.editType === 'selectmulti'"
          >
            {{ item.value }}
          </span>
          <!-- 日期时间选择框 -->
          <span
            class="ant-form-text"
            :title="item.value"
            v-cloak
            v-if="
              item.editType === 'date' ||
                item.editType === 'datetime' ||
                item.editType === 'datetimenosecond'
            "
          >
            {{ item.value }}
          </span>
          <!-- 日期时间范围选择框 -->
          <span
            class="ant-form-text"
            :title="item.value"
            v-cloak
            v-if="
              item.editType === 'daterange' ||
                item.editType === 'datetimerange' ||
                item.editType === 'datetimenosecondrange'
            "
          >
            {{ item.value }}
          </span>
          <!-- 单选框组合 -->
          <span
            class="ant-form-text"
            :title="item.value"
            v-cloak
            v-if="item.editType === 'radiogroup'"
          >
            {{ item.value }}
          </span>
          <!-- 多选框组合 -->
          <span
            class="ant-form-text"
            :title="item.value"
            v-cloak
            v-if="item.editType === 'checkboxgroup'"
          >
            {{ item.value }}
          </span>
          <!-- 上传 -->
          <a-button
            class="ant-form-file"
            type="link"
            v-if="item.editType === 'upload'"
            >{{ item.valueName }}</a-button
          >
          <!-- 上传单个图片 -->
          <section
            class="ant-form-image normal"
            @click.stop="() => {}"
            v-if="item.editType === 'uploadImage'"
          >
            <img
              class="image"
              :src="imageSrc(item.value)"
              @mouseover="handleMouseOver"
              @mouseout="handleMouseOut"
              v-if="item.value !== ''"
            />
            <a-icon
              :style="{ fontSize: '80px', color: '#cccccc' }"
              type="picture"
              v-else
            />
            <section
              class="tool-cover"
              v-show="showToolCover"
              @mouseover="handleMouseOver"
              @mouseout="handleMouseOut"
            >
              <a-icon
                :style="{
                  fontSize: '14px',
                  color: '#ffffff',
                  cursor: 'pointer'
                }"
                type="eye"
                :title="$t('childFunc.title.picturePreview')"
                @click.stop="handleOpenPreview"
              />
            </section>
            <a-modal
              centered
              destroyOnClose
              :footer="null"
              :get-container="() => container"
              :mask-style="{ position: 'absolute' }"
              wrapClassName="ant-modal-absolute"
              v-model="imagePreviewVisible"
              @cancel="handleClosePreview"
            >
              <img class="w100 image-preview" :src="imageSrc(item.value)" />
            </a-modal>
          </section>
          <!-- 图片墙(多张) -->
          <section
            class="ant-form-card"
            v-if="item.editType === 'uploadImageCard'"
          >
            <section
              v-for="(img, index) in item.value"
              :key="img.uid"
              class="ant-form-image card"
              @click.stop="() => {}"
            >
              <img
                class="image"
                :src="imageSrc(img.url)"
                @mouseover="handleMouseOverCard(index)"
                @mouseout="handleMouseOutCard(index)"
                v-if="img.url"
              />
              <a-icon
                :style="{ fontSize: '80px', color: '#cccccc' }"
                type="picture"
                v-else
              />
              <section
                class="tool-cover"
                v-show="showToolCoverCard[index]"
                @mouseover="handleMouseOverCard(index)"
                @mouseout="handleMouseOutCard(index)"
              >
                <a-icon
                  :style="{
                    fontSize: '14px',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }"
                  type="eye"
                  :title="$t('childFunc.title.picturePreview')"
                  @click.stop="handleOpenPreviewCard(img.url)"
                />
              </section>
            </section>
            <a-modal
              centered
              destroyOnClose
              :footer="null"
              :get-container="() => container"
              :mask-style="{ position: 'absolute' }"
              wrapClassName="ant-modal-absolute"
              v-model="imagePreviewVisibleCard"
              @cancel="handleClosePreviewCard"
            >
              <img
                class="w100 image-preview"
                :src="imageSrc(imagePreviewCard)"
              />
            </a-modal>
          </section>

          <!-- 上传证件照(正反面) -->
          <section
            v-if="item.editType === 'uploadImageIdCard'"
            class="ant-form-idcard"
          >
            <section @click.stop="() => {}" class="ant-form-image id-card">
              <img
                class="image"
                :src="imageSrc(item.valueFront)"
                @mouseover="handleMouseOverIdCard(true)"
                @mouseout="handleMouseOutIdCard(true)"
                v-if="item.valueFront !== ''"
              />
              <a-icon
                :style="{ fontSize: '80px', color: '#cccccc' }"
                type="picture"
                v-else
              />
              <section
                class="tool-cover"
                v-show="showToolCoverFront"
                @mouseover="handleMouseOverIdCard(true)"
                @mouseout="handleMouseOutIdCard(true)"
              >
                <a-icon
                  :style="{
                    fontSize: '14px',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }"
                  type="eye"
                  :title="$t('childFunc.title.picturePreview')"
                  @click.stop="handleOpenPreviewIdCard(item.valueFront)"
                />
              </section>
            </section>
            <section @click.stop="() => {}" class="ant-form-image id-card">
              <img
                class="image"
                :src="imageSrc(item.valueReverse)"
                @mouseover="handleMouseOverIdCard(false)"
                @mouseout="handleMouseOutIdCard(false)"
                v-if="item.valueReverse !== ''"
              />
              <a-icon
                :style="{ fontSize: '80px', color: '#cccccc' }"
                type="picture"
                v-else
              />
              <section
                class="tool-cover"
                v-show="showToolCoverReverse"
                @mouseover="handleMouseOverIdCard(false)"
                @mouseout="handleMouseOutIdCard(false)"
              >
                <a-icon
                  :style="{
                    fontSize: '14px',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }"
                  type="eye"
                  :title="$t('childFunc.title.picturePreview')"
                  @click.stop="handleOpenPreviewIdCard(item.valueReverse)"
                />
              </section>
            </section>
            <a-modal
              centered
              destroyOnClose
              :footer="null"
              :get-container="() => container"
              :mask-style="{ position: 'absolute' }"
              wrapClassName="ant-modal-absolute"
              v-model="imagePreviewVisibleIdCard"
              @cancel="handleClosePreviewIdCard"
            >
              <img
                class="w100 image-preview"
                :src="imageSrc(imagePreviewIdcard)"
              />
            </a-modal>
          </section>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
export default {
  props: {
    // 表单栅格布局标题布局
    labelCol: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 表单栅格布局控件布局
    wrapperCol: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 配置
    config: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 一行显示条件数
    rowSize: {
      type: Number,
      default: 1
    },
    // 图片预览挂载容器
    container: null
  },
  data() {
    return {
      // 表单
      form: this.$form.createForm(this),
      // 是否显示图片预览
      imagePreviewVisible: false,
      // 是否显示工具遮罩层
      showToolCover: false,
      // 是否显示工具遮罩层 (图片墙)
      showToolCoverCard: [],
      // 是否显示图片预览 (图片墙)
      imagePreviewVisibleCard: false,
      //当前预览图片(图片墙)
      imagePreviewCard: null,
      // 是否显示图片预览(证件照)
      imagePreviewVisibleIdCard: false,
      // 是否显示工具遮罩层(证件照 - 正面)
      showToolCoverFront: false,
      // 是否显示工具遮罩层(证件照 - 反面)
      showToolCoverReverse: false,
      //当前预览图片(证件照)
      imagePreviewIdcard: null
    };
  },
  computed: {
    // 列span
    colSpan() {
      return 24 / this.rowSize;
    },
    // 可见项
    itemsVisibled() {
      return this.config.items.filter(item => item.visible);
    },
    // 图片地址
    imageSrc() {
      return value => {
        return value;
      };
    }
  },
  methods: {
    // 鼠标移至图片
    handleMouseOver() {
      this.showToolCover = true;
    },
    // 鼠标移开图片
    handleMouseOut() {
      this.showToolCover = false;
    },
    // 打开图片预览
    handleOpenPreview() {
      this.imagePreviewVisible = true;
    },
    // 关闭图片预览
    handleClosePreview() {
      this.imagePreviewVisible = false;
    },
    // 鼠标移至图片(图片墙)
    handleMouseOverCard(index) {
      this.$set(this.showToolCoverCard, index, true);
    },
    // 鼠标移开图片(图片墙)
    handleMouseOutCard(index) {
      this.$set(this.showToolCoverCard, index, false);
    },
    // 打开图片预览(图片墙)
    handleOpenPreviewCard(url) {
      this.imagePreviewCard = url || "";
      this.imagePreviewVisibleCard = true;
    },
    // 关闭图片预览(图片墙)
    handleClosePreviewCard() {
      this.imagePreviewVisibleCard = false;
    },
    // 鼠标移至图片(证件照)
    handleMouseOverIdCard(isFront) {
      this[isFront ? "showToolCoverFront" : "showToolCoverReverse"] = true;
    },
    // 鼠标移开图片(证件照)
    handleMouseOutIdCard(isFront) {
      this[isFront ? "showToolCoverFront" : "showToolCoverReverse"] = false;
    },
    // 打开图片预览(证件照)
    handleOpenPreviewIdCard(url) {
      this.imagePreviewIdcard = url || "";
      this.imagePreviewVisibleIdCard = true;
    },
    // 关闭图片预览(证件照)
    handleClosePreviewIdCard() {
      this.imagePreviewVisibleIdCard = false;
    },
    // 设置值通过表单详情配置（外部调用）
    setValuesByConfig(data, config) {
      config.items.map(item => {
        switch (item.editType) {
          // submitClearSpace清除所有空格，默认清除前后空格
          // submitAllSpace不清除空格
          case "input":
          case "textarea":
            item.value =
              data[item.dataKey || item.key] !== undefined &&
              data[item.dataKey || item.key] !== null &&
              data[item.dataKey || item.key].trim() !== ""
                ? item.submitAllSpace
                  ? String(data[item.dataKey || item.key])
                  : item.submitClearSpace
                  ? String(data[item.dataKey || item.key]).trim()
                  : String(data[item.dataKey || item.key]).replace(
                      /(^\s*)|(\s*$)/g,
                      ""
                    )
                : "暂无";
            break;
          case "autocomplete":
            item.value =
              data[item.dataKey || item.key] !== undefined &&
              data[item.dataKey || item.key] !== null
                ? item.submitAllSpace
                  ? String(data[item.dataKey || item.key])
                  : item.submitClearSpace
                  ? String(data[item.dataKey || item.key]).trim()
                  : String(data[item.dataKey || item.key]).replace(
                      /(^\s*)|(\s*$)/g,
                      ""
                    )
                : "暂无";
            break;
          case "inputnumber":
            item.value =
              data[item.dataKey || item.key] !== undefined &&
              data[item.dataKey || item.key] !== null
                ? data[item.dataKey || item.key]
                : "0";
            break;
          case "select":
            item.value =
              data[(item.dataKey || item.key).replace("Id", "Name")] !==
                undefined &&
              data[(item.dataKey || item.key).replace("Id", "Name")] !== null
                ? data[(item.dataKey || item.key).replace("Id", "Name")]
                : "暂无";
            break;
          case "date":
          case "datetime":
          case "datetimenosecond":
            item.value =
              data[item.dataKey || item.key] !== undefined &&
              data[item.dataKey || item.key] !== null
                ? this.$moment(data[item.dataKey || item.key]).format(
                    item.dateTimeOption.format
                  )
                : "暂无";
            break;
          case "daterange":
          case "datetimerange":
          case "datetimenosecondrange":
            item.value =
              data[item.dataKey[0] || item.key] !== undefined &&
              data[item.dataKey[0] || item.key] !== null &&
              data[item.dataKey[1] || item.key] !== undefined &&
              data[item.dataKey[1] || item.key] !== null
                ? [
                    this.$moment(data[item.dataKey[0] || item.key]).format(
                      item.dateTimeOption.format
                    ),
                    this.$moment(data[item.dataKey[1] || item.key]).format(
                      item.dateTimeOption.format
                    )
                  ].join("~")
                : "暂无";
            break;
          case "radiogroup":
            item.value =
              data[item.dataKey || item.key] !== undefined &&
              data[item.dataKey || item.key] !== null
                ? data[(item.dataKey || item.key).replace("Id", "Name")]
                : "暂无";
            break;
          case "checkboxgroup":
            {
              let titles = [];
              if (
                data[item.dataKey || item.key] !== undefined &&
                data[item.dataKey || item.key] !== null
              ) {
                data[item.dataKey || item.key].map(option => {
                  titles.push(
                    option.title !== undefined && option.title !== null
                      ? option.title
                      : ""
                  );
                });
              }
              item.value = titles.length > 0 ? titles.join(",") : "暂无";
            }
            break;
          case "switch":
            {
              item.value =
                data[item.dataKey || item.key] !== undefined &&
                data[item.dataKey || item.key] !== null
                  ? data[item.dataKey || item.key]
                    ? item.dataTitles && item.dataTitles[0]
                      ? item.dataTitles[0]
                      : "关"
                    : item.dataTitles && item.dataTitles[1]
                    ? item.dataTitles[1]
                    : "关"
                  : "关";
            }
            break;
          case "uploadImage":
            item.value =
              data[item.dataKey || item.key] !== undefined &&
              data[item.dataKey || item.key] !== null
                ? data[item.dataKey || item.key]
                : "";
            break;
          case "uploadImageCard":
            item.value =
              data[item.dataKey || item.key] !== undefined &&
              data[item.dataKey || item.key] !== null
                ? data[item.dataKey || item.key]
                : [];
            break;
          case "uploadImageIdCard":
            if (Array.isArray(item.dataKey)) {
              item.valueFront =
                data[item.dataKey[0]] !== undefined &&
                data[item.dataKey[0]] !== null
                  ? data[item.dataKey[0]]
                  : "";
              item.valueReverse =
                data[item.dataKey[1]] !== undefined &&
                data[item.dataKey[1]] !== null
                  ? data[item.dataKey[1]]
                  : "";
            }
            break;
        }
      });
      return config;
    },
    // 清空值通过表单详情配置（外部调用）
    clearValuesByConfig(config) {
      config.items.map(item => {
        switch (item.editType) {
          // submitClearSpace清除所有空格，默认清除前后空格
          // submitAllSpace不清除空格
          case "input":
          case "textarea":
          case "autocomplete":
          case "select":
          case "date":
          case "datetime":
          case "datetimenosecond":
          case "daterange":
          case "datetimerange":
          case "datetimenosecondrange":
          case "radiogroup":
          case "checkboxgroup":
          case "switch":
          case "uploadImage":
            item.value = "";
            break;
          case "uploadImageCard":
            item.value = [];
            break;
          case "uploadImageIdCard":
            item.valueFront = "";
            item.valueReverse = "";
            break;
          case "inputnumber":
            item.value = "0";
            break;
          case "upload":
            {
              item.value = "";
              item.name = "";
            }
            break;
        }
      });
      return config;
    }
  }
};
</script>

<style lang="scss" scoped>
.ant-form-text {
  @include text-ellipsis;
  display: block;
}
.row {
  @include flex;
  @include flex-secondary-axis-center;
  height: 40px;

  .item-operation {
    margin-left: 8px;
    flex-shrink: 0;
  }
}
.ant-form-image {
  @include flex;
  @include flex-primary-axis-center;
  @include flex-secondary-axis-center;
  position: relative;
  overflow: hidden;
  padding: 10px;
  border: 1px solid #e8e8e8;
  border-radius: 3px;
  .image {
    display: block;
    object-fit: contain;
  }
  .tool-cover {
    @include flex;
    @include flex-primary-axis-center;
    @include flex-secondary-axis-center;
    position: absolute;
    left: 4px;
    top: 4px;
    height: calc(100% - 8px);
    width: calc(100% - 8px);
    background-color: rgba($color-black, 0.4);
  }
  &.normal {
    height: 128px;
    width: 128px;
    .image {
      height: 108px;
      width: 108px;
    }
  }
  &.card {
    margin: 0 8px 8px 0;
    height: 104px;
    width: 104px;
    .image {
      object-fit: cover;
      height: 86px;
      width: 86px;
    }
  }
  &.id-card {
    height: 200px;
    width: 180px;
    &:not(:last-of-type) {
      margin-right: 16px;
    }
    .image {
      height: 180px;
      width: 160px;
    }
  }
}
.ant-form-card {
  @include flex;
  @include flex-secondary-axis-center;
  @include flex-wrap;
  margin-bottom: -8px;
}
.ant-form-idcard {
  @include flex;
  @include flex-secondary-axis-center;
}
</style>
