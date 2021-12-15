// 表单（常规）
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
          :label-col="item.editFull ? { span: 0 } : labelCol"
          :wrapper-col="item.editFull ? { span: 24 } : wrapperCol"
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
          <section
            class="row"
            :style="editComponentStyle"
            v-if="item.editType === 'input'"
          >
            <a-input
              :disabled="!item.canEdit"
              :max-length="item.maxLength ? item.maxLength : maxLengthDef"
              type="text"
              allowClear
              :placeholder="item.label"
              :suffix="item.suffix"
              :title="form.getFieldsValue([item.key])[item.key] || ''"
              :style="editComponentStyle"
              @change="e => item.change && item.change(e)"
              @pressEnter="e => item.pressEnter && item.pressEnter(e)"
              v-decorator="[
                item.key,
                {
                  initialValue:
                    item.defaultValue !== null &&
                    item.defaultValue !== undefined
                      ? item.defaultValue
                      : undefined,
                  rules: [
                    {
                      required:
                        !item.canEdit || !item.validator
                          ? false
                          : item.validator.requiredFunc
                          ? item.validator.requiredFunc(item.uploadOption)
                          : item.validator.required,
                      message: errorMessage(item)
                    },
                    {
                      validator:
                        !item.canEdit || !item.validator
                          ? validatorFunc
                          : item.validator.validatorFunc
                          ? (rule, value, callback) => {
                              item.validator.validatorFunc(
                                rule,
                                value,
                                callback
                              );
                            }
                          : item.validator.validator
                          ? item.validator.validator
                          : validatorFunc
                    }
                  ]
                }
              ]"
            >
              <a-tooltip
                slot="suffix"
                :title="
                  `示例：${
                    item.example
                      ? item.example.textFunc
                        ? item.example.textFunc()
                        : item.example.text
                        ? item.example.text
                        : ''
                      : ''
                  }`
                "
              >
                <a-icon
                  type="info-circle"
                  style="color: #999999"
                  v-if="
                    item.example && (item.example.text || item.example.textFunc)
                  "
                />
              </a-tooltip>
            </a-input>
            <section class="item-operation" v-if="item.needOperation">
              <slot :name="`${item.key}Operation`" :item="item"></slot>
            </section>
          </section>
          <!-- 数字输入框 -->
          <section
            class="row"
            :style="editComponentStyle"
            v-if="item.editType === 'inputnumber'"
          >
            <a-input-number
              :disabled="!item.canEdit"
              :min="item.min || 0"
              :max="item.max || 10000000000000"
              allowClear
              :placeholder="item.label"
              :title="form.getFieldsValue([item.key])[item.key] || ''"
              :style="editComponentStyle"
              v-decorator="[
                item.key,
                {
                  initialValue:
                    item.defaultValue !== null &&
                    item.defaultValue !== undefined
                      ? item.defaultValue
                      : undefined,
                  rules: [
                    {
                      required:
                        !item.canEdit || !item.validator
                          ? false
                          : item.validator.requiredFunc
                          ? item.validator.requiredFunc(item.uploadOption)
                          : item.validator.required,
                      message: errorMessage(item)
                    },
                    {
                      validator:
                        !item.canEdit || !item.validator
                          ? validatorFunc
                          : item.validator.validatorFunc
                          ? (rule, value, callback) => {
                              item.validator.validatorFunc(
                                rule,
                                value,
                                callback
                              );
                            }
                          : item.validator.validator
                          ? item.validator.validator
                          : validatorFunc
                    }
                  ]
                }
              ]"
            />
            <span class="suffix" v-cloak v-if="item.suffix">{{
              item.suffix
            }}</span>
          </section>
          <!-- 文本框 -->
          <section
            class="row-vertical-not-center"
            :style="editComponentStyle"
            v-if="item.editType === 'textarea'"
          >
            <a-textarea
              :disabled="!item.canEdit"
              :max-length="item.maxLength ? item.maxLength : maxLengthDef"
              :auto-size="item.autoSize ? item.autoSize : true"
              allowClear
              :placeholder="item.label"
              :title="form.getFieldsValue([item.key])[item.key] || ''"
              :style="editComponentStyle"
              @pressEnter="e => item.pressEnter && item.pressEnter(e)"
              v-decorator="[
                item.key,
                {
                  initialValue:
                    item.defaultValue !== null &&
                    item.defaultValue !== undefined
                      ? item.defaultValue
                      : undefined,
                  rules: [
                    {
                      required:
                        !item.canEdit || !item.validator
                          ? false
                          : item.validator.requiredFunc
                          ? item.validator.requiredFunc(item.uploadOption)
                          : item.validator.required,
                      message: errorMessage(item)
                    },
                    {
                      validator:
                        !item.canEdit || !item.validator
                          ? validatorFunc
                          : item.validator.validatorFunc
                          ? (rule, value, callback) => {
                              item.validator.validatorFunc(
                                rule,
                                value,
                                callback
                              );
                            }
                          : item.validator.validator
                          ? item.validator.validator
                          : validatorFunc
                    }
                  ]
                }
              ]"
            />
            <section class="item-operation" v-if="item.needOperation">
              <slot :name="`${item.key}Operation`" :item="item"></slot>
            </section>
          </section>
          <!-- 自动完成输入框 -->
          <a-auto-complete
            :disabled="!item.canEdit"
            :max-length="item.maxLength ? item.maxLength : maxLengthDef"
            allowClear
            :dropdown-menu-style="{
              maxHeight: '300px',
              overflow: 'auto'
            }"
            :filter-option="false"
            :option-label-prop="'title'"
            :placeholder="item.label"
            :title="form.getFieldsValue([item.key])[item.key] || ''"
            :style="editComponentStyle"
            v-decorator="[
              item.key,
              {
                initialValue:
                  item.defaultValue !== null && item.defaultValue !== undefined
                    ? item.defaultValue
                    : undefined,
                rules: [
                  {
                    required:
                      !item.canEdit || !item.validator
                        ? false
                        : item.validator.requiredFunc
                        ? item.validator.requiredFunc(item.uploadOption)
                        : item.validator.required,
                    message: errorMessage(item)
                  },
                  {
                    validator:
                      !item.canEdit || !item.validator
                        ? validatorFunc
                        : item.validator.validatorFunc
                        ? (rule, value, callback) => {
                            item.validator.validatorFunc(rule, value, callback);
                          }
                        : item.validator.validator
                        ? item.validator.validator
                        : validatorFunc
                  }
                ]
              }
            ]"
            v-if="item.editType === 'autocomplete'"
          >
            <template v-slot:dataSource>
              <a-select-option
                v-for="option in item.dataSource.options"
                :key="option.title"
                :title="option.title"
              >
                {{ option.title }}
              </a-select-option>
            </template>
          </a-auto-complete>
          <!-- 下拉框 -->
          <a-select
            allowClear
            :disabled="!item.canEdit"
            :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
            :filter-option="selectFilterOption"
            labelInValue
            :mode="item.editType === 'selectmulti' ? 'multiple' : 'default'"
            optionFilterProp="children"
            :placeholder="item.label"
            showSearch
            :style="editComponentStyle"
            :loading="item.selectOption.loading"
            v-decorator="[
              item.key,
              {
                initialValue:
                  item.defaultValue !== null && item.defaultValue !== undefined
                    ? item.defaultValue
                    : undefined,
                rules: [
                  {
                    required:
                      !item.canEdit || !item.validator
                        ? false
                        : item.validator.requiredFunc
                        ? item.validator.requiredFunc(item.uploadOption)
                        : item.validator.required,
                    message: errorMessage(item)
                  },
                  {
                    validator:
                      !item.canEdit || !item.validator
                        ? validatorFunc
                        : item.validator.validatorFunc
                        ? (rule, value, callback) => {
                            item.validator.validatorFunc(rule, value, callback);
                          }
                        : item.validator.validator
                        ? item.validator.validator
                        : validatorFunc
                  }
                ]
              }
            ]"
            @change="
              value =>
                item.editType === 'selectmulti'
                  ? handleSelectMultiChange(item, value)
                  : handleSelectChange(item, value)
            "
            @search="$emit('selectSearch', $event)"
            v-if="item.editType === 'select' || item.editType === 'selectmulti'"
          >
            <a-select-option
              :key="option.value"
              :title="option.label"
              :value="option.value"
              :disabled="option.disabled"
              v-for="option in item.selectOption.options"
            >
              {{ option.label }}
            </a-select-option>
          </a-select>
          <!-- 日期时间选择框 -->
          <a-date-picker
            allowClear
            :disabled="!item.canEdit"
            :disabled-date="item.dateTimeOption.disabledDate"
            :disabled-time="item.dateTimeOption.disabledTime"
            :placeholder="item.label"
            inputReadOnly
            :format="item.dateTimeOption.format"
            :show-time="
              item.editType === 'datetime' ||
              item.editType === 'datetimenosecond'
                ? { format: item.dateTimeOption.format.split(' ')[1] }
                : false
            "
            :show-today="item.dateTimeOption.showToday"
            :title="
              form.getFieldsValue([item.key])[item.key]
                ? $moment(form.getFieldsValue([item.key])[item.key]).format(
                    item.dateTimeOption.format
                  )
                : ''
            "
            :style="editComponentStyle"
            v-decorator="[
              item.key,
              {
                initialValue:
                  item.defaultValue !== null && item.defaultValue !== undefined
                    ? item.defaultValue
                    : undefined,
                rules: [
                  {
                    type: 'object',
                    required:
                      !item.canEdit || !item.validator
                        ? false
                        : item.validator.requiredFunc
                        ? item.validator.requiredFunc(item.uploadOption)
                        : item.validator.required,
                    message: errorMessage(item)
                  },
                  {
                    validator:
                      !item.canEdit || !item.validator
                        ? validatorFunc
                        : item.validator.validatorFunc
                        ? (rule, value, callback) => {
                            item.validator.validatorFunc(rule, value, callback);
                          }
                        : item.validator.validator
                        ? item.validator.validator
                        : validatorFunc
                  }
                ]
              }
            ]"
            v-if="
              item.editType === 'date' ||
                item.editType === 'datetime' ||
                item.editType === 'datetimenosecond'
            "
          />
          <!-- 日期时间范围选择框 -->
          <a-range-picker
            allowClear
            :disabled="!item.canEdit"
            :disabled-date="item.dateTimeOption.disabledDate"
            :disabled-time="item.dateTimeOption.disabledTime"
            :placeholder="item.label"
            inputReadOnly
            :format="item.dateTimeOption.format"
            :show-time="
              item.editType === 'datetimerange' ||
              item.editType === 'datetimenosecondrange'
                ? { format: item.dateTimeOption.format.split(' ')[1] }
                : false
            "
            :title="
              form.getFieldsValue([item.key])[item.key]
                ? `${
                    form.getFieldsValue([item.key])[item.key][0]
                      ? $moment(
                          form.getFieldsValue([item.key])[item.key][0]
                        ).format(item.dateTimeOption.format)
                      : ''
                  }~${
                    form.getFieldsValue([item.key])[item.key][1]
                      ? $moment(
                          form.getFieldsValue([item.key])[item.key][1]
                        ).format(item.dateTimeOption.format)
                      : ''
                  }`
                : ''
            "
            :style="editComponentStyle"
            v-decorator="[
              item.key,
              {
                initialValue:
                  item.defaultValue !== null && item.defaultValue !== undefined
                    ? item.defaultValue
                    : undefined,
                rules: [
                  {
                    type: 'array',
                    required:
                      !item.canEdit || !item.validator
                        ? false
                        : item.validator.requiredFunc
                        ? item.validator.requiredFunc(item.uploadOption)
                        : item.validator.required,
                    message: errorMessage(item)
                  },
                  {
                    validator:
                      !item.canEdit || !item.validator
                        ? validatorFunc
                        : item.validator.validatorFunc
                        ? (rule, value, callback) => {
                            item.validator.validatorFunc(rule, value, callback);
                          }
                        : item.validator.validator
                        ? item.validator.validator
                        : validatorFunc
                  }
                ]
              }
            ]"
            v-if="
              item.editType === 'daterange' ||
                item.editType === 'datetimerange' ||
                item.editType === 'datetimenosecondrange'
            "
          />
          <!-- 单选框组合 -->
          <a-radio-group
            :disabled="!item.canEdit"
            v-decorator="[
              item.key,
              {
                initialValue:
                  item.defaultValue !== null && item.defaultValue !== undefined
                    ? item.defaultValue
                    : item.radioOption &&
                      item.radioOption.options &&
                      item.radioOption.options[0]
                    ? item.radioOption.options[0].value
                    : undefined,
                rules: [
                  {
                    required:
                      !item.canEdit || !item.validator
                        ? false
                        : item.validator.requiredFunc
                        ? item.validator.requiredFunc(item.uploadOption)
                        : item.validator.required,
                    message: errorMessage(item)
                  },
                  {
                    validator:
                      !item.canEdit || !item.validator
                        ? validatorFunc
                        : item.validator.validatorFunc
                        ? (rule, value, callback) => {
                            item.validator.validatorFunc(rule, value, callback);
                          }
                        : item.validator.validator
                        ? item.validator.validator
                        : validatorFunc
                  }
                ]
              }
            ]"
            @change="e => handleRadioGroupChange(item, { key: e.target.value })"
            v-if="item.editType === 'radiogroup'"
          >
            <template v-if="!item.radioOption.isButton">
              <a-radio
                :key="option.value"
                :value="option.value"
                :disabled="option.disabled"
                v-for="option in item.radioOption.options"
              >
                {{ option.label }}
              </a-radio>
            </template>
            <template v-else>
              <a-radio-button
                :key="option.value"
                :value="option.value"
                :disabled="option.disabled"
                v-for="option in item.radioOption.options"
              >
                {{ option.label }}
              </a-radio-button>
            </template>
          </a-radio-group>
          <!-- 多选框组合 -->
          <a-checkbox-group
            :disabled="!item.canEdit"
            :name="`checkboxgroup${item.key}`"
            :options="item.checkboxOption.options"
            v-decorator="[
              item.key,
              {
                initialValue:
                  item.defaultValue !== null && item.defaultValue !== undefined
                    ? item.defaultValue
                    : undefined,
                rules: [
                  {
                    required:
                      !item.canEdit || !item.validator
                        ? false
                        : item.validator.requiredFunc
                        ? item.validator.requiredFunc(item.uploadOption)
                        : item.validator.required,
                    message: errorMessage(item)
                  },
                  {
                    validator:
                      !item.canEdit || !item.validator
                        ? validatorFunc
                        : item.validator.validatorFunc
                        ? (rule, value, callback) => {
                            item.validator.validatorFunc(rule, value, callback);
                          }
                        : item.validator.validator
                        ? item.validator.validator
                        : validatorFunc
                  }
                ]
              }
            ]"
            v-if="item.editType === 'checkboxgroup'"
          />
          <!-- 开关 -->
          <a-switch
            :disabled="!item.canEdit"
            v-decorator="[
              item.key,
              {
                valuePropName: 'checked',
                rules: [
                  {
                    required: false
                  }
                ]
              }
            ]"
            v-if="item.editType === 'switch'"
          />
          <!-- 上传 -->
          <a-upload
            :disabled="!item.canEdit"
            :accept="
              item.uploadOption
                ? item.uploadOption.accept || uploadFileTypeDef
                : uploadFileTypeDef
            "
            :action="item.uploadOption ? item.uploadOption.apiUrl || '' : ''"
            :custom-request="
              item.uploadOption
                ? item.uploadOption.upload
                  ? options =>
                      item.uploadOption.upload(options, item.uploadOption)
                  : null
                : null
            "
            :headers="item.uploadOption ? item.uploadOption.headers || {} : {}"
            :multiple="
              item.uploadOption ? item.uploadOption.multiple || false : false
            "
            :name="
              item.uploadOption ? item.uploadOption.fileName || 'file' : 'file'
            "
            :file-list="
              item.uploadOption ? item.uploadOption.fileList || [] : []
            "
            v-decorator="[
              item.key,
              {
                rules: [
                  {
                    required:
                      !item.canEdit || !item.validator
                        ? false
                        : item.validator.requiredFunc
                        ? item.validator.requiredFunc(item.uploadOption)
                        : item.validator.required,
                    message: errorMessage(item)
                  },
                  {
                    validator:
                      !item.canEdit || !item.validator
                        ? validatorFunc
                        : item.validator.validatorFunc
                        ? (rule, value, callback) => {
                            item.validator.validatorFunc(rule, value, callback);
                          }
                        : item.validator.validator
                        ? item.validator.validator
                        : validatorFunc
                  }
                ]
              }
            ]"
            @change="info => handleUploadChange(item, info)"
            v-if="item.editType === 'upload'"
          >
            <a-button> <a-icon type="upload" />上传</a-button>
          </a-upload>
          <!-- 上传单个图片 -->
          <a-upload
            :disabled="!item.canEdit"
            :accept="
              item.uploadOption
                ? item.uploadOption.accept || uploadImageTypeDef
                : uploadImageTypeDef
            "
            :action="item.uploadOption ? item.uploadOption.apiUrl || '' : ''"
            :custom-request="
              item.uploadOption
                ? item.uploadOption.upload
                  ? options =>
                      item.uploadOption.upload(options, item.uploadOption)
                  : null
                : null
            "
            :headers="item.uploadOption ? item.uploadOption.headers || {} : {}"
            :name="
              item.uploadOption
                ? item.uploadOption.fileName || 'image'
                : 'image'
            "
            :file-list="
              item.uploadOption ? item.uploadOption.fileList || [] : []
            "
            list-type="picture-card"
            :show-upload-list="false"
            :before-upload="file => beforeUploadImage(file, item.uploadOption)"
            class="image-uploader"
            v-decorator="[
              item.key,
              {
                rules: [
                  {
                    required:
                      !item.canEdit || !item.validator
                        ? false
                        : item.validator.requiredFunc
                        ? item.validator.requiredFunc(item.uploadOption)
                        : item.validator.required,
                    message: errorMessage(item)
                  },
                  {
                    validator:
                      !item.canEdit || !item.validator
                        ? validatorFunc
                        : item.validator.validatorFunc
                        ? (rule, value, callback) => {
                            item.validator.validatorFunc(rule, value, callback);
                          }
                        : item.validator.validator
                        ? item.validator.validator
                        : validatorFunc
                  }
                ]
              }
            ]"
            v-if="item.editType === 'uploadImage'"
          >
            <img
              :src="item.uploadOption.url"
              v-if="item.uploadOption.url !== ''"
            />
            <div v-else>
              <a-icon
                :type="item.uploadOption.uploading ? 'loading' : 'plus'"
              />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
          <!-- 上传多个图片（图片墙） -->
          <a-upload
            :disabled="!item.canEdit"
            :accept="
              item.uploadOption
                ? item.uploadOption.accept || uploadFileTypeDef
                : uploadFileTypeDef
            "
            :action="item.uploadOption ? item.uploadOption.apiUrl || '' : ''"
            :custom-request="
              item.uploadOption
                ? item.uploadOption.upload
                  ? options =>
                      item.uploadOption.upload(options, item.uploadOption)
                  : null
                : null
            "
            :headers="item.uploadOption ? item.uploadOption.headers || {} : {}"
            :multiple="
              item.uploadOption ? item.uploadOption.multiple || false : false
            "
            :name="
              item.uploadOption ? item.uploadOption.fileName || 'file' : 'file'
            "
            :file-list="
              item.uploadOption ? item.uploadOption.fileList || [] : []
            "
            :show-upload-list="
              item.uploadOption ? item.uploadOption.showUploadList : true
            "
            :list-type="item.uploadOption ? item.uploadOption.listType : 'text'"
            v-decorator="[
              item.key,
              {
                getValueFromEvent:
                  item.uploadOption && item.uploadOption.getValueFromEvent,
                rules: [
                  {
                    required:
                      !item.canEdit || !item.validator
                        ? false
                        : item.validator.requiredFunc
                        ? item.validator.requiredFunc(item.uploadOption)
                        : item.validator.required,
                    message: errorMessage(item)
                  },
                  {
                    validator:
                      !item.canEdit || !item.validator
                        ? validatorFunc
                        : item.validator.validatorFunc
                        ? (rule, value, callback) => {
                            item.validator.validatorFunc(rule, value, callback);
                          }
                        : item.validator.validator
                        ? item.validator.validator
                        : validatorFunc
                  }
                ]
              }
            ]"
            @change="info => handleUploadChange(item, info)"
            v-if="item.editType === 'uploadImageCard'"
          >
            <a-button
              v-if="
                (item.uploadOption && item.uploadOption.listType) !==
                  'picture-card'
              "
            >
              <a-icon type="upload" />上传</a-button
            >
            <div
              v-if="
                (item.uploadOption && item.uploadOption.listType) ===
                  'picture-card'
              "
            >
              <a-icon
                :type="
                  item.uploadOption && item.uploadOption.uploading
                    ? 'loading'
                    : 'plus'
                "
              />
              <div class="ant-upload-text">
                上传
              </div>
            </div>
          </a-upload>
          <!-- 上传证件照(正反面) -->
          <a-row
            v-if="item.editType === 'uploadImageIdCard'"
            class="image-idcard-uploader"
          >
            <a-col :span="12">
              <a-form-item>
                <a-upload
                  :disabled="
                    !item.canEdit ||
                      (item.uploadOption &&
                        (item.uploadOption.uploadingFront ||
                          item.uploadOption.uploadingReverse))
                  "
                  :accept="
                    item.uploadOption
                      ? item.uploadOption.accept || uploadImageTypeDef
                      : uploadImageTypeDef
                  "
                  :action="
                    item.uploadOption ? item.uploadOption.apiUrl || '' : ''
                  "
                  :custom-request="
                    item.uploadOption
                      ? item.uploadOption.upload
                        ? options =>
                            item.uploadOption.upload(
                              options,
                              item.uploadOption,
                              true
                            )
                        : null
                      : null
                  "
                  :headers="
                    item.uploadOption ? item.uploadOption.headers || {} : {}
                  "
                  :name="
                    item.uploadOption
                      ? item.uploadOption.fileName || 'image'
                      : 'image'
                  "
                  :file-list="
                    item.uploadOption ? item.uploadOption.fileList || [] : []
                  "
                  list-type="picture-card"
                  :show-upload-list="false"
                  :before-upload="
                    file => beforeUploadImage(file, item.uploadOption)
                  "
                  v-decorator="[
                    `${item.submitKey[0]}`,
                    {
                      rules: [
                        {
                          required:
                            !item.canEdit || !item.validator
                              ? false
                              : item.validator.requiredFunc
                              ? item.validator.requiredFunc(item.uploadOption)
                              : item.validator.required,
                          message: errorMessage(item)
                        },
                        {
                          validator:
                            !item.canEdit || !item.validator
                              ? validatorFunc
                              : item.validator.validatorFunc
                              ? (rule, value, callback) => {
                                  item.validator.validatorFunc(
                                    rule,
                                    value,
                                    callback
                                  );
                                }
                              : item.validator.validator
                              ? item.validator.validator
                              : validatorFunc
                        }
                      ]
                    }
                  ]"
                >
                  <img
                    :src="item.uploadOption.urlFront"
                    v-if="item.uploadOption.urlFront !== ''"
                  />
                  <div v-else>
                    <a-icon
                      :type="
                        item.uploadOption.uploadingFront ? 'loading' : 'plus'
                      "
                    />
                    <div class="ant-upload-text">
                      正面
                    </div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item>
                <a-upload
                  :disabled="
                    !item.canEdit ||
                      (item.uploadOption &&
                        (item.uploadOption.uploadingFront ||
                          item.uploadOption.uploadingReverse))
                  "
                  :accept="
                    item.uploadOption
                      ? item.uploadOption.accept || uploadImageTypeDef
                      : uploadImageTypeDef
                  "
                  :action="
                    item.uploadOption ? item.uploadOption.apiUrl || '' : ''
                  "
                  :custom-request="
                    item.uploadOption
                      ? item.uploadOption.upload
                        ? options =>
                            item.uploadOption.upload(options, item.uploadOption)
                        : null
                      : null
                  "
                  :headers="
                    item.uploadOption ? item.uploadOption.headers || {} : {}
                  "
                  :name="
                    item.uploadOption
                      ? item.uploadOption.fileName || 'image'
                      : 'image'
                  "
                  :file-list="
                    item.uploadOption ? item.uploadOption.fileList || [] : []
                  "
                  list-type="picture-card"
                  :show-upload-list="false"
                  :before-upload="
                    file => beforeUploadImage(file, item.uploadOption)
                  "
                  v-decorator="[
                    `${item.submitKey[1]}`,
                    {
                      rules: [
                        {
                          required:
                            !item.canEdit || !item.validator
                              ? false
                              : item.validator.requiredFunc
                              ? item.validator.requiredFunc(item.uploadOption)
                              : item.validator.required,
                          message: errorMessage(item)
                        },
                        {
                          validator:
                            !item.canEdit || !item.validator
                              ? validatorFunc
                              : item.validator.validatorFunc
                              ? (rule, value, callback) => {
                                  item.validator.validatorFunc(
                                    rule,
                                    value,
                                    callback
                                  );
                                }
                              : item.validator.validator
                              ? item.validator.validator
                              : validatorFunc
                        }
                      ]
                    }
                  ]"
                >
                  <img
                    :src="item.uploadOption.urlReverse"
                    v-if="item.uploadOption.urlReverse !== ''"
                  />
                  <div v-else>
                    <a-icon
                      :type="
                        item.uploadOption.uploadingReverse ? 'loading' : 'plus'
                      "
                    />
                    <div class="ant-upload-text">
                      反面
                    </div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import dataValidation from "@/mixins/common/data-validation";

export default {
  mixins: [dataValidation],
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
    // 检验联动是否可见
    checkLinkVisibled: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      // 表单
      form: this.$form.createForm(this),
      // 输入最大长度默认值
      maxLengthDef: 100,
      // 文件上传默认类型
      uploadFileTypeDef: ".*",
      // 图片上传默认类型
      uploadImageTypeDef: ".jpg,.jpeg,.png"
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
    // 编辑组件样式
    editComponentStyle() {
      return { width: "100%" };
    },
    // 数据验证错误信息
    errorMessage() {
      return item => {
        switch (item.editType) {
          case "input":
          case "inputnumber":
          case "textarea":
          case "autocomplete":
            return `请输入${item.label}！`;
          case "select":
          case "selectmulti":
          case "treeselect":
          case "date":
          case "datetime":
          case "datetimenosecond":
          case "daterange":
          case "datetimerange":
          case "datetimenosecondrange":
          case "radiogroup":
          case "checkboxgroup":
            return `请选择${item.label}！`;
          case "upload":
          case "uploadImage":
          case "uploadImageCard":
          case "uploadImageIdCard":
            return `请上传${item.label}！`;
        }
      };
    }
  },
  methods: {
    // 默认自定义校验函数
    validatorFunc(rule, value, callback) {
      callback();
    },
    // 下拉框过滤
    selectFilterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    // 下拉框改变
    handleSelectChange(item, value) {
      if (!value) {
        return;
      }
      this.checkLinkVisibled && this.checkLinkVisibled(item, value);
      this.$emit("selectchange", {
        changeItem: item,
        changeValue: value
      });
    },
    // 多选下拉框改变
    handleSelectMultiChange(item, value) {
      if (!value) {
        return;
      }
      this.checkLinkVisibled && this.checkLinkVisibled(item, value);
    },
    // 单选框组合改变
    handleRadioGroupChange(item, value) {
      if (!value) {
        return;
      }
      this.checkLinkVisibled && this.checkLinkVisibled(item, value);
      this.$emit("radiogroupchange", {
        changeItem: item,
        changeValue: value
      });
    },
    // 上传文件改变
    handleUploadChange(item, info) {
      let { fileList } = info;
      if (item.uploadOption && !item.uploadOption.multiple) {
        fileList = [fileList[fileList.length - 1]];
      }
      this.$emit("uploadchange", {
        changeItem: item,
        fileList: fileList,
        uploadOption: item.uploadOption
      });
    },
    // 上传图片前
    beforeUploadImage(file, uploadOption) {
      let accepts = (uploadOption.accept || this.uploadImageTypeDef).split(",");
      let checkImageType = false;
      accepts.map(type => {
        if (file.type === `image/${type.replace(".", "")}`) {
          checkImageType = true;
        }
      });
      if (!checkImageType) {
        this.$message.warning(`${this.$t("message.warning.imageType")}！`);
        return checkImageType;
      }
      const limitt2M = file.size / 1024 / 1024 < 2;
      if (!limitt2M) {
        this.$message.warning(`${this.$t("message.warning.imageLimit2M")}！`);
      }
      return checkImageType && limitt2M;
    },
    // 校验表单（外部调用）
    validateFields(callback, fields) {
      if (fields) {
        this.form.validateFieldsAndScroll(fields, (err, values) => {
          callback && callback(err, values);
        });
        return;
      }
      this.form.validateFieldsAndScroll((err, values) => {
        callback && callback(err, values);
      });
    },
    // 获取值通过表单配置（外部调用）
    getValuesByConfig(data, config) {
      const values = {};
      config.items.map(item => {
        if (item.visible) {
          switch (item.editType) {
            // submitClearSpace清除所有空格，默认清除前后空格
            // submitAllSpace不清除空格
            case "input":
            case "textarea":
            case "autocomplete":
              values[item.key] =
                data[item.submitKey || item.key] !== undefined &&
                data[item.submitKey || item.key] !== null
                  ? item.submitAllSpace
                    ? String(data[item.submitKey || item.key])
                    : item.submitClearSpace
                    ? String(data[item.submitKey || item.key]).trim()
                    : String(data[item.submitKey || item.key]).replace(
                        /(^\s*)|(\s*$)/g,
                        ""
                      )
                  : "";
              break;
            case "inputnumber":
              values[item.key] =
                data[item.submitKey || item.key] !== undefined &&
                data[item.submitKey || item.key] !== null
                  ? data[item.submitKey || item.key]
                  : 0;
              break;
            case "select":
              values[item.key] =
                data[item.submitKey || item.key] !== undefined &&
                data[item.submitKey || item.key] !== null
                  ? {
                      key: data[item.submitKey || item.key],
                      label:
                        data[(item.submitKey || item.key).replace("Id", "Name")]
                    }
                  : undefined;
              break;
            case "date":
            case "datetime":
              values[item.key] =
                data[item.submitKey || item.key] !== undefined &&
                data[item.submitKey || item.key] !== null
                  ? this.$moment(data[item.submitKey || item.key]).format(
                      item.dateTimeOption.format
                    )
                  : "";
              break;
            case "datetimenosecond":
              values[item.key] =
                data[item.submitKey || item.key] !== undefined &&
                data[item.submitKey || item.key] !== null
                  ? `${this.$moment(data[item.submitKey || item.key]).format(
                      item.dateTimeOption.format
                    )}:00`
                  : "";
              break;
            case "daterange":
            case "datetimerange":
              values[item.key] =
                data[item.submitKey[0] || item.key] !== undefined &&
                data[item.submitKey[0] || item.key] !== null &&
                data[item.submitKey[1] || item.key] !== undefined &&
                data[item.submitKey[1] || item.key] !== null
                  ? [
                      this.$moment(data[item.submitKey[0] || item.key]),
                      this.$moment(data[item.submitKey[1] || item.key])
                    ]
                  : [];
              break;
            case "datetimenosecondrange":
              values[item.key] =
                data[item.submitKey[0] || item.key] !== undefined &&
                data[item.submitKey[0] || item.key] !== null &&
                data[item.submitKey[1] || item.key] !== undefined &&
                data[item.submitKey[1] || item.key] !== null
                  ? [
                      this.$moment(data[item.submitKey[0] || item.key]),
                      this.$moment(data[item.submitKey[1] || item.key])
                    ]
                  : [];
              break;
            case "radiogroup":
              values[item.key] =
                data[item.submitKey || item.key] !== undefined &&
                data[item.submitKey || item.key] !== null
                  ? data[item.submitKey || item.key]
                  : undefined;
              break;
            case "checkboxgroup":
              values[item.key] =
                data[item.submitKey || item.key] !== undefined &&
                data[item.submitKey || item.key] !== null
                  ? data[item.submitKey || item.key]
                  : [];
              break;
            case "switch":
              values[item.key] =
                data[item.submitKey || item.key] !== undefined &&
                data[item.submitKey || item.key] !== null
                  ? data[item.submitKey || item.key]
                  : false;
              break;
            case "upload":
              {
                item.uploadOption.url =
                  data[item.submitKey || item.key] !== undefined &&
                  data[item.submitKey || item.key] !== null
                    ? data[item.submitKey || item.key]
                    : "";
                item.uploadOption.name =
                  data[(item.submitKey || item.key).replace("Url", "Name")] !==
                    undefined &&
                  data[(item.submitKey || item.key).replace("Url", "Name")] !==
                    null
                    ? data[(item.submitKey || item.key).replace("Url", "Name")]
                    : "";
              }
              break;
            case "uploadImage":
              item.uploadOption.url =
                data[item.submitKey || item.key] !== undefined &&
                data[item.submitKey || item.key] !== null
                  ? data[item.submitKey || item.key]
                  : "";
              break;
            case "uploadImageIdCard":
              if (Array.isArray(item.submitKey)) {
                item.uploadOption.urlFront =
                  data[item.submitKey[0]] !== undefined &&
                  data[item.submitKey[0]] !== null
                    ? data[item.submitKey[0]]
                    : "";
                item.uploadOption.urlReverse =
                  data[item.submitKey[1]] !== undefined &&
                  data[item.submitKey[1]] !== null
                    ? data[item.submitKey[1]]
                    : "";
              }
              break;
          }
        }
      });
      return values;
    },
    // 获取提交数据通过表单配置（外部调用）
    getDataByConfig(data, config) {
      const values = {};
      config.items.map(item => {
        switch (item.editType) {
          // submitClearSpace清除所有空格，默认清除前后空格
          // submitAllSpace不清除空格
          case "input":
          case "textarea":
          case "autocomplete":
            values[item.submitKey || item.key] =
              data[item.key] !== undefined
                ? item.submitAllSpace
                  ? String(data[item.key])
                  : item.submitClearSpace
                  ? String(data[item.key]).trim()
                  : String(data[item.key]).replace(/(^\s*)|(\s*$)/g, "")
                : "";
            break;
          case "inputnumber":
            values[item.submitKey || item.key] =
              data[item.key] !== undefined ? data[item.key] : 0;
            break;
          case "select":
            {
              values[item.submitKey || item.key] =
                data[item.key] && data[item.key].key ? data[item.key].key : "";
              values[(item.submitKey || item.key).replace("Id", "Name")] =
                data[item.key] && data[item.key].label
                  ? data[item.key].label
                  : "";
            }
            break;
          case "date":
          case "datetime":
            values[item.submitKey || item.key] = data[item.key]
              ? this.$moment(data[item.key]).format(item.dateTimeOption.format)
              : "";
            break;
          case "datetimenosecond":
            values[item.submitKey || item.key] = data[item.key]
              ? `${this.$moment(data[item.key]).format(
                  item.dateTimeOption.format
                )}:00`
              : "";
            break;
          case "daterange":
          case "datetimerange":
            {
              values[item.submitKey[0] || item.key] =
                data[item.key] && data[item.key][0]
                  ? this.$moment(data[item.key][0]).format(
                      item.dateTimeOption.format
                    )
                  : "";
              values[item.submitKey[1] || item.key] =
                data[item.key] && data[item.key][1]
                  ? this.$moment(data[item.key][1]).format(
                      item.dateTimeOption.format
                    )
                  : "";
            }
            break;
          case "datetimenosecondrange":
            {
              values[item.submitKey[0] || item.key] =
                data[item.key] && data[item.key][0]
                  ? `${this.$moment(data[item.key][0]).format(
                      item.dateTimeOption.format
                    )}:00`
                  : "";
              values[item.submitKey[1] || item.key] =
                data[item.key] && data[item.key][1]
                  ? `${this.$moment(data[item.key][1]).format(
                      item.dateTimeOption.format
                    )}:00`
                  : "";
            }
            break;
          case "radiogroup":
            values[item.submitKey || item.key] = data[item.key]
              ? data[item.key]
              : "";
            break;
          case "checkboxgroup":
            values[item.submitKey || item.key] = data[item.key]
              ? data[item.key]
              : [];
            break;
          case "switch":
            values[item.submitKey || item.key] = data[item.key]
              ? data[item.key]
              : false;
            break;
          case "upload":
            {
              values[item.submitKey || item.key] = item.uploadOption.url
                ? item.uploadOption.url
                : "";
              values[(item.submitKey || item.key).replace("Url", "Name")] = item
                .uploadOption.name
                ? item.uploadOption.name
                : "";
            }
            break;
          case "uploadImage":
            values[item.submitKey || item.key] = item.uploadOption.url
              ? item.uploadOption.url
              : "";
            break;
          case "uploadImageIdCard":
            if (Array.isArray(item.submitKey)) {
              values[item.submitKey[0]] = item.uploadOption.urlFront || "";
              values[item.submitKey[1]] = item.uploadOption.urlReverse || "";
            } else {
              values[item.submitKey || item.key] = [
                item.uploadOption.urlFront || "",
                item.uploadOption.urlReverse || ""
              ];
            }
            break;
        }
      });
      return values;
    },
    // 设置值（外部调用）
    setFieldsValue(values) {
      this.form.setFieldsValue(values);
    },
    // 获取值（外部调用）
    getFieldsValue(fields) {
      if (fields) {
        return this.form.getFieldsValue(fields);
      }
      return this.form.getFieldsValue();
    }
  }
};
</script>

<style lang="scss" scoped>
.row {
  @include flex;
  @include flex-secondary-axis-center;
  height: 40px;

  .suffix,
  .item-operation {
    margin-left: 8px;
    flex-shrink: 0;
  }
}
.row-vertical-not-center {
  @include flex;

  .item-operation {
    margin-left: 8px;
    flex-shrink: 0;
  }
}
</style>
