<template>
  <view :class="pickerClass" :style="pickerStyle">
    <slot
      v-if="isNumber(internalCustom) ? internalCustom : $slots.custom"
      name="custom"
      :columns="renderedColumns"
      :picker-view-class="pickerViewClass"
      :mask-class="maskClass"
      :indicator-class="indicatorClass"
      :value="columnIndexes"
      :on-change="onChange"
    ></slot>
    <picker-view
      v-else
      :class="pickerViewClass"
      :immediate-change="immediateChange"
      :indicator-class="indicatorClass"
      :mask-class="maskClass"
      :value="columnIndexes"
      @change="onChange"
    >
      <picker-view-column v-for="(column, i) in renderedColumns" :key="i">
        <sar-picker-item v-for="(option, j) in column" :key="j">
          {{ getLabelByOption(option) }}
        </sar-picker-item>
      </picker-view-column>
    </picker-view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, nextTick, ref, watch } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  nestedToMulti,
  toArray,
  arrayEqual,
  isNumber,
  isEmptyBinding,
  isEmptyArray
} from "../../utils";
import {
  defaultOptionKeys,
  getColumnsType,
  getIndexesByValue,
  getCascaderValidIndexes,
  getOptionsByIndexes,
  getMaySingleValueByOptions,
  getValueOrLabelByOption,
  defaultPickerProps
} from "./common";
import SarPickerItem from "../picker-item/picker-item.vue";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {PickerOption[] | PickerOption[][]} columns 配置每一列的数据，默认值：[]。
 * @property {PickerOptionKeys} optionKeys 自定义 `columns` 结构中的字段，默认值：{label: 'label', value: 'value', children: 'children'}。
 * @property {any} modelValue 选中项的值，默认值：-。
 * @property {boolean} immediateChange 是否在手指松开时立即触发 `update:model-value` 事件，默认值：false。
 * @event {(value: any, selectedOptions: PickerOption[], indexes: number[]) => void} update 选中的选项改变时触发
 * @event {(value: any, selectedOptions: PickerOption[], indexes: number[]) => void} change 选中的选项改变时触发
 */
export default  _defineComponent({
  components: {
    SarPickerItem,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "picker",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    columns: { type: Array, required: false },
    optionKeys: { type: Object, required: false },
    modelValue: { type: null, required: false },
    immediateChange: { type: Boolean, required: false },
    internalCustom: { type: Number, required: false }
  }, defaultPickerProps()),
  emits: ["update:model-value", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("picker");
    const fieldKeys = computed(() => {
      return Object.assign({}, defaultOptionKeys, props.optionKeys);
    });
    const columnsType = computed(() => {
      return getColumnsType(props.columns, fieldKeys.value);
    });
    const innerValue = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => {
        innerValue.value = props.modelValue;
      }
    );
    const columnIndexes = ref([]);
    const updateColumnIndexes = () => {
      const indexes = getIndexesByValue(
        toArray(innerValue.value),
        props.columns,
        fieldKeys.value
      );
      if (!arrayEqual(indexes, columnIndexes.value)) {
        columnIndexes.value = indexes;
      }
    };
    updateColumnIndexes();
    watch([innerValue, () => props.columns, fieldKeys], () => {
      if (!isEmptyBinding(innerValue.value) && !isEmptyArray(innerValue.value)) {
        updateColumnIndexes();
      }
    });
    const onChange = (event) => {
      if (!props.columns || props.columns.length === 0) {
        return;
      }
      let indexes = event.detail.value;
      if (indexes.some((index) => index === Infinity)) {
        nextTick(() => {
          columnIndexes.value = isEmptyBinding(innerValue.value) || isEmptyArray(innerValue.value) ? columnIndexes.value.map(() => 0) : [...columnIndexes.value];
        });
        return;
      }
      indexes = renderedColumns.value.map((_, index) => indexes[index] || 0);
      if (columnsType.value === "cascader") {
        let startIndex = -1;
        const nextIndexes = [];
        for (let i = 0; i < columnIndexes.value.length; i++) {
          if (startIndex < 0 && columnIndexes.value[i] !== indexes[i]) {
            startIndex = i;
          }
          nextIndexes.push(startIndex > -1 && i > startIndex ? 0 : indexes[i]);
        }
        indexes = nextIndexes;
        {
          const validIndexes = getCascaderValidIndexes(
            indexes,
            props.columns,
            fieldKeys.value
          );
          if (!arrayEqual(indexes, validIndexes)) {
            indexes = validIndexes;
          }
        }
      }
      const selectedOptions = getOptionsByIndexes(
        indexes,
        props.columns,
        fieldKeys.value
      );
      if (!arrayEqual(indexes, columnIndexes.value)) {
        columnIndexes.value = indexes;
      }
      const nextValue = getMaySingleValueByOptions(
        selectedOptions,
        fieldKeys.value,
        props.columns
      );
      innerValue.value = nextValue;
      emit("update:model-value", nextValue, selectedOptions, indexes);
      emit("change", nextValue, selectedOptions, indexes);
    };
    const getRenderedColumns = () => {
      switch (columnsType.value) {
        case "single":
          return [props.columns];
        case "multi":
          return props.columns;
        case "cascader":
          return nestedToMulti(
            props.columns,
            toArray(innerValue.value),
            fieldKeys.value
          );
        default:
          return [];
      }
    };
    const renderedColumns = ref(getRenderedColumns());
    const updateRenderedColumns = () => {
      renderedColumns.value = getRenderedColumns();
    };
    watch(
      [() => props.columns, innerValue],
      ([newColumns, newValue], [oldColumns, oldValue]) => {
        if (newColumns !== oldColumns || newValue !== oldValue && columnsType.value === "cascader" && !isEmptyBinding(newValue) && !isEmptyArray(newValue)) {
          updateRenderedColumns();
        }
      }
    );
    watch(
      () => props.modelValue,
      () => {
        if (isEmptyBinding(props.modelValue) || isEmptyArray(props.modelValue)) {
          updateColumnIndexes();
          updateRenderedColumns();
        }
      }
    );
    const getLabelByOption = (option) => {
      return getValueOrLabelByOption(option, fieldKeys.value.label);
    };
    const pickerClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const pickerStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const pickerViewClass = bem.e("picker-view");
    const indicatorClass = bem.e("indicator");
    const maskClass = bem.e("mask");
    const __returned__ = { props, emit, bem, fieldKeys, columnsType, innerValue, columnIndexes, updateColumnIndexes, onChange, getRenderedColumns, renderedColumns, updateRenderedColumns, getLabelByOption, pickerClass, pickerStyle, pickerViewClass, indicatorClass, maskClass, get isNumber() {
      return isNumber;
    }, SarPickerItem };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>