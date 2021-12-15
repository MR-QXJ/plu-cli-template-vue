// 表格（常规）
<template>
  <section
    ref="tableWrapper"
    :class="['h100', 'w100', 'table-wrapper', bordered ? 'table-bordered' : '']"
  >
    <a-form :form="formSubmit">
      <a-table
        ref="table"
        :bordered="false"
        :columns="columns"
        :data-source="data"
        :indent-size="0"
        :loading="loading"
        :pagination="false"
        :row-key="rowKey"
        :row-selection="canCheckSelect ? rowSelection : null"
        :scroll="notLimitHeight ? { x: scrollX } : { x: scrollX, y: scrollY }"
        :size="size"
      >
        <template
          :slot="column.key"
          slot-scope="text, record, index"
          v-for="column in columns"
        >
          <!-- 自定义列 -->
          <span :key="column.key" v-if="column.type === 'diy'">
            <slot
              :name="column.diyName"
              :column="column"
              :record="record"
            ></slot>
          </span>
          <!-- 操作列 -->
          <span :key="column.key" v-else-if="column.key === 'operation'">
            <slot name="operation" :record="record"></slot>
          </span>
          <!-- 文本列 -->
          <span :key="column.key" v-else>
            <!-- 编辑 -->
            <span
              :class="[
                record.editing && column.editType
                  ? 'ant-table-td-edit-content'
                  : ''
              ]"
              v-if="record.editing && column.editType"
            >
              <a-form-item
                :class="[
                  isRequired(record, column) ? 'ant-form-item-required' : ''
                ]"
                v-if="column.editType === 'input'"
              >
                <!-- 输入框 -->
                <span
                  class="star"
                  v-if="
                    isRequired(record, column) && linkVisibled(record, column)
                  "
                  >*</span
                >
                <a-input
                  :disabled="!column.canEdit"
                  :max-length="
                    column.maxLength ? column.maxLength : maxLengthDef
                  "
                  type="text"
                  allowClear
                  :placeholder="column.title"
                  :title="text"
                  :style="editComponentStyle(record, column)"
                  v-decorator="[
                    `${record.key}-${column.key}`,
                    {
                      initialValue: text,
                      rules: [
                        {
                          required:
                            !linkVisibled(record, column) ||
                            !column.canEdit ||
                            !column.validator
                              ? false
                              : column.validator.requiredFunc
                              ? column.validator.requiredFunc(record)
                              : column.validator.required,
                          message: errorMessage(column)
                        },
                        {
                          validator:
                            !linkVisibled(record, column) ||
                            !column.canEdit ||
                            !column.validator
                              ? validatorFunc
                              : column.validator.validatorFunc
                              ? (rule, value, callback) => {
                                  column.validator.validatorFunc(
                                    record,
                                    rule,
                                    value,
                                    callback
                                  );
                                }
                              : column.validator.validator
                              ? column.validator.validator
                              : validatorFunc
                        }
                      ]
                    }
                  ]"
                  @change="
                    e => handleInputChange(e.target.value, record.key, column)
                  "
                  v-show="linkVisibled(record, column)"
                >
                  <a-tooltip
                    slot="suffix"
                    :title="
                      `示例：${
                        column.example
                          ? column.example.textFunc
                            ? column.example.textFunc(record)
                            : column.example.text
                            ? column.example.text
                            : ''
                          : ''
                      }`
                    "
                  >
                    <a-icon
                      type="info-circle"
                      style="color: #999999"
                      v-if="
                        column.example &&
                          (column.example.text || column.example.textFunc)
                      "
                    />
                  </a-tooltip>
                </a-input>
              </a-form-item>
              <a-form-item
                :class="[
                  isRequired(record, column) ? 'ant-form-item-required' : ''
                ]"
                v-if="column.editType === 'autocomplete'"
              >
                <!-- 自动完成输入框 -->
                <span
                  class="star"
                  v-if="
                    isRequired(record, column) && linkVisibled(record, column)
                  "
                  >*</span
                >
                <a-auto-complete
                  :disabled="!column.canEdit"
                  :max-length="
                    column.maxLength ? column.maxLength : maxLengthDef
                  "
                  allowClear
                  :dropdown-menu-style="{
                    maxHeight: '300px',
                    overflow: 'auto'
                  }"
                  :filter-option="false"
                  :option-label-prop="'title'"
                  :placeholder="column.title"
                  :title="text"
                  :style="editComponentStyle(record, column)"
                  v-decorator="[
                    `${record.key}-${column.key}`,
                    {
                      initialValue: text,
                      rules: [
                        {
                          required:
                            !linkVisibled(record, column) ||
                            !column.canEdit ||
                            !column.validator
                              ? false
                              : column.validator.requiredFunc
                              ? column.validator.requiredFunc(record)
                              : column.validator.required,
                          message: errorMessage(column)
                        },
                        {
                          validator:
                            !linkVisibled(record, column) ||
                            !column.canEdit ||
                            !column.validator
                              ? validatorFunc
                              : column.validator.validatorFunc
                              ? (rule, value, callback) => {
                                  column.validator.validatorFunc(
                                    record,
                                    rule,
                                    value,
                                    callback
                                  );
                                }
                              : column.validator.validator
                              ? column.validator.validator
                              : validatorFunc
                        }
                      ]
                    }
                  ]"
                  @change="
                    value => handleAutoCompleteChange(value, record.key, column)
                  "
                  @select="
                    value => handleAutoCompleteChange(value, record.key, column)
                  "
                  v-show="linkVisibled(record, column)"
                >
                  <template v-slot:dataSource>
                    <a-select-option
                      v-for="option in column.dataSource"
                      :key="option.title"
                      :title="option.title"
                    >
                      {{ option.title }}
                    </a-select-option>
                  </template>
                </a-auto-complete>
              </a-form-item>
              <a-form-item
                :class="[
                  isRequired(record, column) ? 'ant-form-item-required' : ''
                ]"
                v-else-if="
                  column.editType === 'select' ||
                    column.editType === 'selectmulti'
                "
              >
                <!-- 下拉框 -->
                <span
                  class="star"
                  v-if="
                    isRequired(record, column) && linkVisibled(record, column)
                  "
                  >*</span
                >
                <a-select
                  allowClear
                  :disabled="!column.canEdit"
                  :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
                  :filter-option="selectFilterOption"
                  labelInValue
                  :mode="
                    column.editType === 'selectmulti' ? 'multiple' : 'default'
                  "
                  optionFilterProp="children"
                  :placeholder="column.title"
                  showSearch
                  :style="editComponentStyle(record, column)"
                  :loading="column.selectOption.loading"
                  v-decorator="[
                    `${record.key}-${column.key}`,
                    {
                      rules: [
                        {
                          required:
                            !linkVisibled(record, column) ||
                            !column.canEdit ||
                            !column.validator
                              ? false
                              : column.validator.requiredFunc
                              ? column.validator.requiredFunc(record)
                              : column.validator.required,
                          message: errorMessage(column)
                        },
                        {
                          validator:
                            !linkVisibled(record, column) ||
                            !column.canEdit ||
                            !column.validator
                              ? validatorFunc
                              : column.validator.validatorFunc
                              ? (rule, value, callback) => {
                                  column.validator.validatorFunc(
                                    record,
                                    rule,
                                    value,
                                    callback
                                  );
                                }
                              : column.validator.validator
                              ? column.validator.validator
                              : validatorFunc
                        }
                      ]
                    }
                  ]"
                  @change="
                    value =>
                      column.editType === 'selectmulti'
                        ? handleSelectMultiChange(value, record.key, column)
                        : handleSelectChange(value, record.key, column)
                  "
                  v-show="linkVisibled(record, column)"
                >
                  <a-select-option
                    :key="option.value"
                    :title="option.label"
                    :value="option.value"
                    :disabled="option.disabled"
                    v-for="option in column.selectOption.options"
                  >
                    {{ option.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item
                :class="[
                  isRequired(record, column) ? 'ant-form-item-required' : ''
                ]"
                v-if="column.editType === 'treeselect'"
              >
                <!-- 树型下拉框 -->
                <span
                  class="star"
                  v-if="
                    isRequired(record, column) && linkVisibled(record, column)
                  "
                  >*</span
                >
                <a-tree-select
                  allowClear
                  :disabled="!column.canEdit"
                  :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
                  labelInValue
                  :placeholder="column.title"
                  search-placeholder="请输入关键字"
                  showSearch
                  :tree-data="column.selectOption.options"
                  :tree-default-expanded-keys="
                    column.selectOption.defaultExpandedKeys
                  "
                  treeNodeFilterProp="title"
                  :style="editComponentStyle(record, column)"
                  :loading="column.selectOption.loading"
                  v-decorator="[
                    `${record.key}-${column.key}`,
                    {
                      rules: [
                        {
                          required:
                            !linkVisibled(record, column) ||
                            !column.canEdit ||
                            !column.validator
                              ? false
                              : column.validator.requiredFunc
                              ? column.validator.requiredFunc(record)
                              : column.validator.required,
                          message: errorMessage(column)
                        },
                        {
                          validator:
                            !linkVisibled(record, column) ||
                            !column.canEdit ||
                            !column.validator
                              ? validatorFunc
                              : column.validator.validatorFunc
                              ? (rule, value, callback) => {
                                  column.validator.validatorFunc(
                                    record,
                                    rule,
                                    value,
                                    callback
                                  );
                                }
                              : column.validator.validator
                              ? column.validator.validator
                              : validatorFunc
                        }
                      ]
                    }
                  ]"
                  @change="
                    value => handleTreeSelectChange(value, record.key, column)
                  "
                  v-show="linkVisibled(record, column)"
                />
              </a-form-item>
              <a-form-item
                :class="[
                  isRequired(record, column) ? 'ant-form-item-required' : ''
                ]"
                v-if="
                  column.editType === 'date' ||
                    column.editType === 'datetime' ||
                    column.editType === 'datetimenosecond'
                "
              >
                <!-- 日期时间选择框 -->
                <span
                  class="star"
                  v-if="
                    isRequired(record, column) && linkVisibled(record, column)
                  "
                  >*</span
                >
                <a-date-picker
                  allowClear
                  :disabled="!column.canEdit"
                  :disabled-date="column.dateTimeOption.disabledDate"
                  :disabled-time="column.dateTimeOption.disabledTime"
                  :placeholder="column.title"
                  inputReadOnly
                  :format="column.dateTimeOption.format"
                  :show-time="
                    column.editType === 'datetime' ||
                    column.editType === 'datetimenosecond'
                      ? { format: column.dateTimeOption.format.split(' ')[1] }
                      : false
                  "
                  :show-today="column.dateTimeOption.showToday"
                  :title="text"
                  :style="editComponentStyle(record, column)"
                  v-decorator="[
                    `${record.key}-${column.key}`,
                    {
                      rules: [
                        {
                          required:
                            !linkVisibled(record, column) ||
                            !column.canEdit ||
                            !column.validator
                              ? false
                              : column.validator.requiredFunc
                              ? column.validator.requiredFunc(record)
                              : column.validator.required,
                          message: errorMessage(column)
                        },
                        {
                          validator:
                            !linkVisibled(record, column) ||
                            !column.canEdit ||
                            !column.validator
                              ? validatorFunc
                              : column.validator.validatorFunc
                              ? (rule, value, callback) => {
                                  column.validator.validatorFunc(
                                    record,
                                    rule,
                                    value,
                                    callback
                                  );
                                }
                              : column.validator.validator
                              ? column.validator.validator
                              : validatorFunc
                        }
                      ]
                    }
                  ]"
                  @ok="value => handleDateTimeChange(value, record.key, column)"
                  v-show="linkVisibled(record, column)"
                />
              </a-form-item>
            </span>
            <!-- 非编辑 -->
            <span
              :class="[multiRows > 1 ? 'multi-rows' : noWrap ? 'nowrap' : '']"
              :style="multiRowsStyle(multiRows)"
              :title="text"
              v-cloak
              v-else
              >{{ text }}</span
            >
          </span>
        </template>
      </a-table>
    </a-form>
  </section>
</template>

<script>
import ResizeObserver from "resize-observer-polyfill";

export default {
  props: {
    // 是否显示边框
    bordered: {
      type: Boolean,
      default: false
    },
    // 列
    columns: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 数据
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 是否加载数据
    loading: {
      type: Boolean,
      default: false
    },
    // 记录关键字字段名
    rowKey: {
      type: String,
      default: "key"
    },
    // 是否可以勾选记录
    canCheckSelect: {
      type: Boolean,
      default: false
    },
    // 勾选菜单
    checkSelectMenus: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 勾选条件属性
    checkboxProps: {
      type: Function,
      default: null
    },
    // 勾选记录
    selectedRowKeys: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 大小
    size: {
      type: String,
      default: "default"
    },
    // 不限制高度
    notLimitHeight: {
      type: Boolean,
      default: false
    },
    // 数据不换行
    noWrap: {
      type: Boolean,
      default: true
    },
    // 数据最多显示几行
    multiRows: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      // 表单
      formSubmit: this.$form.createForm(this),
      // 垂直滚动条显示阈值
      scrollY: 0,
      // 输入最大长度默认值
      maxLengthDef: 100
    };
  },
  computed: {
    // 水平滚动条显示阈值
    scrollX() {
      let x = 0;
      this.columns.map(column => {
        x += column.displayWidth || 0;
      });
      // 加100纠正无右固定列最后一列宽度显示不完整问题
      return x + 40;
    },
    // 勾选记录
    rowSelection() {
      const option = {
        onChange: (selectedRowKeys, selectedRows) => {
          this.$emit("rowSelection", {
            selectedRowKeys: selectedRowKeys,
            selectedRows: selectedRows
          });
        },
        hideDefaultSelections:
          this.checkSelectMenus && this.checkSelectMenus.length > 0
            ? true
            : false,
        selections: this.checkSelectMenus
      };
      if (this.checkboxProps) {
        option.getCheckboxProps = this.checkboxProps;
      }
      if (this.selectedRowKeys) {
        option.selectedRowKeys = this.selectedRowKeys;
      }
      return option;
    },
    // 是否必填
    isRequired() {
      return (record, column) => {
        return column.validator.requiredFunc
          ? column.validator.requiredFunc(record)
          : column.validator.required;
      };
    },
    // 编辑组件样式
    editComponentStyle() {
      return (record, column) => {
        return {
          width: (column.validator.requiredFunc
          ? column.validator.requiredFunc(record)
          : column.validator.required)
            ? `calc(${column.displayWidth}px - 8px - 8px - 7px - 8px)`
            : `calc(${column.displayWidth}px - 8px - 8px)`
        };
      };
    },
    // 数据验证错误信息
    errorMessage() {
      return column => {
        switch (column.editType) {
          case "input":
          case "autocomplete":
            return `请输入${column.title || ""}！`;
          case "select":
          case "selectmulti":
          case "treeselect":
          case "date":
          case "datetime":
          case "datetimenosecond":
            return `请选择${column.title || ""}！`;
        }
      };
    },
    // 联动是否可见
    linkVisibled() {
      return (record, column) => {
        return this.checkLinkVisibled(record, column);
      };
    },
    // 数据多行样式
    multiRowsStyle() {
      return rows => {
        return rows > 1
          ? {
              "-webkit-line-clamp": rows
            }
          : {};
      };
    }
  },
  methods: {
    // 默认自定义校验函数
    validatorFunc(rule, value, callback) {
      callback();
    },
    // 获取表格包装对象
    getTableWrapper() {
      return this.$refs["tableWrapper"];
    },
    // 获取表格对象
    getTable() {
      return this.$refs["table"];
    },
    // 获取table body
    getTableBody(children) {
      let tableBody = null;
      children.map(child => {
        if (child.$el.className === "ant-table-body") {
          tableBody = child.$el;
        }
        if (!tableBody && child.$children) {
          tableBody = this.getTableBody(child.$children);
        }
      });
      return tableBody;
    },
    // 获取垂直滚动条显示阈值
    getScrollY() {
      let table = this.getTableWrapper();
      if (table) {
        // 标题栏高度
        let headHeight = 0;
        switch (this.size) {
          case "small":
            headHeight = 38;
            break;
          case "middle":
            headHeight = 46;
            break;
          default:
            headHeight = 54;
            break;
        }
        this.scrollY = table.clientHeight - headHeight;
        this.scrollY = this.scrollY < 0 ? 0 : this.scrollY;
        headHeight = null;
      } else {
        this.scrollY = 0;
      }
      table = null;
    },
    // 联动控制列清空值
    clearLinkControlColumnValue(record, column) {
      if (column.linkControls) {
        let keys = [];
        column.linkControls.map(linkControl => {
          if (linkControl.checkKey && linkControl.checkEditType) {
            switch (linkControl.checkEditType) {
              case "input":
              case "autocomplete":
              case "date":
              case "datetime":
              case "datetimenosecond":
                {
                  record[linkControl.checkKey] = "";
                  keys.push(`${record.key}-${linkControl.checkKey}`);
                }
                break;
              case "select":
              case "treeselect":
                {
                  record[linkControl.checkKey] = -1;
                  record[`${linkControl.checkKey}Title`] = "";
                  keys.push(`${record.key}-${`${linkControl.checkKey}Title`}`);
                }
                break;
              case "selectmulti":
                {
                  record[linkControl.checkKey] = "";
                  record[`${linkControl.checkKey}Title`] = "";
                  keys.push(`${record.key}-${`${linkControl.checkKey}Title`}`);
                }
                break;
            }
          }
        });
        this.resetFields(keys);
        keys = null;
      }
    },
    // 输入框改变
    handleInputChange(value, recordKey, column) {
      const newData = [...this.data];
      const target = newData.filter(record => record.key === recordKey)[0];
      if (target) {
        target[column.key] = column.submitClearSpace
          ? value.trim()
          : value.replace(/(^\s*)|(\s*$)/g, "");
        this.clearLinkControlColumnValue(target, column);
      }
      this.$emit("change", {
        currRecord: target,
        newData: newData
      });
    },
    // 自动完成输入框改变
    handleAutoCompleteChange(value, recordKey, column) {
      const newData = [...this.data];
      const target = newData.filter(record => record.key === recordKey)[0];
      if (target) {
        target[column.key] = column.submitClearSpace
          ? value.trim()
          : value.replace(/(^\s*)|(\s*$)/g, "");
        this.clearLinkControlColumnValue(target, column);
      }
      this.$emit("change", {
        currRecord: target,
        newData: newData
      });
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
    handleSelectChange(value, recordKey, column) {
      if (!value) {
        return;
      }
      const newData = [...this.data];
      const target = newData.filter(record => record.key === recordKey)[0];
      if (target) {
        target[column.key.replace("Title", "")] = value.key;
        target[column.key] = value.label;
        this.clearLinkControlColumnValue(target, column);
      }
      this.$emit("change", {
        currRecord: target,
        newData: newData,
        column: column
      });
    },
    // 多选下拉框改变
    handleSelectMultiChange(value, recordKey, column) {
      if (!value) {
        return;
      }
      const newData = [...this.data];
      const target = newData.filter(record => record.key === recordKey)[0];
      if (target) {
        let values = [];
        let labels = [];
        value.map(item => {
          values.push(item.key);
          labels.push(item.label);
        });
        target[column.key.replace("Title", "")] = values.join(",");
        target[column.key] = labels.join(",");
        values = null;
        labels = null;
        this.clearLinkControlColumnValue(target, column);
      }
      this.$emit("change", {
        currRecord: target,
        newData: newData,
        column: column
      });
    },
    // 树型下拉框改变
    handleTreeSelectChange(value, recordKey, column) {
      if (!value) {
        return;
      }
      const newData = [...this.data];
      const target = newData.filter(record => record.key === recordKey)[0];
      if (target) {
        target[column.key.replace("Title", "")] = value.value;
        target[column.key] = value.label;
        this.clearLinkControlColumnValue(target, column);
      }
      this.$emit("change", {
        currRecord: target,
        newData: newData,
        column: column
      });
    },
    // 日期时间改变
    handleDateTimeChange(value, recordKey, column) {
      const newData = [...this.data];
      const target = newData.filter(record => record.key === recordKey)[0];
      if (target) {
        target[column.key] = this.$moment(value).format(
          column.dateTimeOption.format
        );
        this.clearLinkControlColumnValue(target, column);
      }
      this.$emit("change", {
        currRecord: target,
        newData: newData,
        column: column
      });
    },
    // 检验联动是否可见
    checkLinkVisibled(record, column) {
      if (column.linkVisibled && column.linkVisibled.checkKey) {
        let checkKey = (keys, checkKey) => {
          let exist = false;
          keys.map(key => {
            if (
              parseInt(key) === parseInt(checkKey) ||
              String(key) === String(checkKey)
            ) {
              exist = true;
            }
          });
          return exist;
        };
        if (typeof column.linkVisibled.checkKey === "string") {
          return checkKey(
            column.linkVisibled.checkValue,
            record[column.linkVisibled.checkKey]
          );
        } else {
          let exists = [];
          column.linkVisibled.checkKey.map((key, index) => {
            exists.push(
              checkKey(column.linkVisibled.checkValue[index], record[key])
            );
          });
          return !exists.filter(exist => exist === false).length > 0;
        }
      } else {
        return true;
      }
    },
    // 获取表格列（外部调用）
    getColumns() {
      return this.columns;
    },
    // 滚动到某一行（外部调用）
    scrollToRow(rowIndex) {
      let table = this.getTable();
      if (!table) {
        table = null;
        return;
      }
      let tableBody = this.getTableBody(table.$children);
      if (!tableBody) {
        table = null;
        tableBody = null;
        return;
      }
      let rowHeight = 0;
      switch (this.size) {
        case "default":
          rowHeight = 55;
          break;
        case "middle":
          rowHeight = 47;
          break;
        case "small":
          rowHeight = 39;
          break;
      }
      tableBody.scrollTop = rowHeight * rowIndex;
      table = null;
      tableBody = null;
      rowHeight = null;
    },
    // 表单验证（外部调用）
    validate(callback, fields) {
      if (fields) {
        this.formSubmit.validateFieldsAndScroll(fields, err => {
          if (callback) {
            callback(err);
          }
        });
        return;
      }
      this.formSubmit.validateFieldsAndScroll(err => {
        if (callback) {
          callback(err);
        }
      });
    },
    // 获取提交数据通过表格列配置（外部调用）
    getDataByConfig(data, config) {
      const values = {};
      config.data.map(item => {
        if (item.type === "diy") {
          values[item.submitKey || item.key] = data[item.key];
        } else {
          switch (item.editType) {
            // submitClearSpace清除所有空格，默认清除前后空格
            case "input":
            case "autocomplete":
              values[item.submitKey || item.key] =
                data[item.key] !== undefined
                  ? item.submitClearSpace
                    ? String(data[item.key]).trim()
                    : String(data[item.key]).replace(/(^\s*)|(\s*$)/g, "")
                  : "";
              break;
            case "select":
            case "treeselect":
              values[item.submitKey || item.key] =
                data[item.key.replace("Title", "")];
              break;
            case "date":
            case "datetime":
              values[item.submitKey || item.key] = data[item.key]
                ? this.$moment(data[item.key]).format(
                    item.dateTimeOption.format
                  )
                : "";
              break;
            case "datetimenosecond":
              values[item.submitKey || item.key] = data[item.key]
                ? `${this.$moment(data[item.key]).format(
                    item.dateTimeOption.format
                  )}:00`
                : "";
              break;
          }
        }
      });
      return values;
    },
    // 表单设置值（外部调用）
    setFieldsValue(obj) {
      this.formSubmit.setFieldsValue(obj);
    },
    // 表单重置值（外部调用）
    resetFields(fields) {
      this.formSubmit.resetFields(fields);
    }
  },
  mounted() {
    this.getScrollY();
    let table = this.getTableWrapper();
    if (table) {
      const tableObserver = new ResizeObserver(entries => {
        this.getScrollY(entries);
      });
      tableObserver.observe(table);
    }
  }
};
</script>

<style lang="scss" scoped>
.table-wrapper {
  flex-shrink: 1;
  overflow: hidden;

  &.table-bordered {
    border-top: 1px solid #e8e8e8;
    border-left: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
  }
}
.nowrap {
  @include text-ellipsis;
  display: block;
}
.multi-rows {
  box-orient: vertical;
  -webkit-box-orient: vertical;
  -moz-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
}
</style>
