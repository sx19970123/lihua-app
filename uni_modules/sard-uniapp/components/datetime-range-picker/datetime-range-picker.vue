<template>
  <view :class="datetimeRangePickerClass" :style="datetimeRangePickerStyle">
    <sar-tabs v-model:current="tabsCurrent" :list="tabsList" scrollable />

    <view :class="bem.e('container')">
      <view
        :class="bem.e('wrapper')"
        :style="
          stringifyStyle({
            transform: `translateX(${-Number(tabsCurrent) * 100}%)`,
          })
        "
      >
        <view :class="bem.e('pane')">
          <sar-datetime-picker
            v-bind="datetimePickerProps"
            v-model="startValue"
            @change="onChange"
          />
        </view>
        <view :class="bem.e('pane')">
          <sar-datetime-picker
            v-bind="datetimePickerProps"
            v-model="endValue"
            :min="startValue"
            @change="onChange"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, watch, ref } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  omit,
  toDate
} from "../../utils";
import SarDatetimePicker from "../datetime-picker/datetime-picker.vue";
import SarTabs from "../tabs/tabs.vue";
import {
  defaultDatetimeRangePickerProps
} from "./common";
import {
  getMaxDate,
  getMinDate,
  normalizeRangeValue
} from "../datetime-picker/common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string [详见特殊符号](#DatetimeLetter)} type 设置每一列要展示的数据类型，每个字母对应一列，默认值：'yMd'。
 * @property {'solar' | 'lunar'} calendar 历法类型，可选公历或农历，默认值：'solar'。
 * @property {Date} min 可选的最小日期，默认值：十年前。
 * @property {Date} max 可选的最大日期，默认值：十年后。
 * @property {(Date | string)[]} modelValue 绑定的值，默认值：-。
 * @property {(letter: DatetimeLetter, value: number, date: Date, index: number) => boolean} filter 选项的过滤函数，默认值：-。
 * @property {(letter: DatetimeLetter, option: DatetimeColumnOption, date: Date, index: number) => string | void |undefined} formatter 选项的格式化函数，默认值：-。
 * @property {string [详见特殊符号](../utilities/date#日期格式特殊符号)} valueFormat 绑定值的格式，不指定则绑定值为 Date 对象，默认值：-。
 * @property {string[]} tabs 设置起始和结束标签页标题，默认值：-。
 * @event {(date: (Date | string)[]) => void} update 选中的选项改变时触发
 * @event {(date: (Date | string)[]) => void} change 选中的选项改变时触发
 */
export default  _defineComponent({
  components: {
    SarDatetimePicker,
    SarTabs,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "datetime-range-picker",
  props:  _mergeDefaults({
    modelValue: { type: Array, required: false },
    tabs: { type: Array, required: false },
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    type: { type: String, required: false },
    calendar: { type: String, required: false },
    min: { type: [Date, String], required: false },
    max: { type: [Date, String], required: false },
    filter: { type: Function, required: false },
    formatter: { type: Function, required: false },
    valueFormat: { type: String, required: false }
  }, defaultDatetimeRangePickerProps),
  emits: ["update:model-value", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("datetime-range-picker");
    const datetimePickerProps = computed(() => {
      return omit(props, ["modelValue"]);
    });
    const tabsList = computed(() => {
      return [
        {
          title: props.tabs?.[0]
        },
        {
          title: props.tabs?.[1]
        }
      ];
    });
    const tabsCurrent = ref(0);
    const minDate = computed(
      () => toDate(props.min || getMinDate(), props.valueFormat)
    );
    const maxDate = computed(() => {
      const maxDate2 = toDate(props.max || getMaxDate(), props.valueFormat);
      return maxDate2 < minDate.value ? new Date(minDate.value) : maxDate2;
    });
    const startValue = ref();
    const endValue = ref();
    watch(
      () => props.modelValue,
      (value) => {
        const [start, end] = normalizeRangeValue(
          minDate.value,
          maxDate.value,
          value,
          props.valueFormat
        );
        startValue.value = start;
        endValue.value = end;
      },
      {
        immediate: true
      }
    );
    const onChange = () => {
      if (startValue.value && endValue.value) {
        const emitValue = [startValue.value, endValue.value];
        emit("update:model-value", emitValue);
        emit("change", emitValue);
      }
    };
    const datetimeRangePickerClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const datetimeRangePickerStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, datetimePickerProps, tabsList, tabsCurrent, minDate, maxDate, startValue, endValue, onChange, datetimeRangePickerClass, datetimeRangePickerStyle, get stringifyStyle() {
      return stringifyStyle;
    }, SarDatetimePicker, SarTabs };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>