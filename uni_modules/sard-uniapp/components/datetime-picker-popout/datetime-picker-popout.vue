<template>
  <sar-popout
    v-model:visible="innerVisible"
    keep-render
    :title="title"
    :root-class="popoutClass"
    :root-style="popoutStyle"
    @confirm="onConfirm"
    @enter="onEnter"
    @visible-hook="onVisibleHook"
  >
    <template #visible="{ already }">
      <sar-datetime-picker
        v-if="already"
        :model-value="popoutValue"
        :type="type"
        :min="min"
        :max="max"
        :filter="filter"
        :formatter="formatter"
        :value-format="valueFormat"
        :calendar="calendar"
        @change="onChange"
      />
    </template>
  </sar-popout>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, watch } from "vue";
import SarPopout from "../popout/popout.vue";
import SarDatetimePicker from "../datetime-picker/datetime-picker.vue";
import {
  defaultDatetimePickerPopoutProps
} from "./common";
import { formatDate, isEmptyBinding, toDate } from "../../utils";
import {
  getInitialValue,
  getMaxDate,
  getMinDate
} from "../datetime-picker/common";
import { useFormPopout } from "../../use";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string [详见特殊符号](#DatetimeLetter)} type 设置每一列要展示的数据类型，每个字母对应一列，默认值：'yMd'。
 * @property {'solar' | 'lunar'} calendar 历法类型，可选公历或农历，默认值：'solar'。
 * @property {Date} min 可选的最小日期，默认值：十年前。
 * @property {Date} max 可选的最大日期，默认值：十年后。
 * @property {Date | string} modelValue 当前选中的日期，默认值：-。
 * @property {(letter: DatetimeLetter, value: number, date: Date, index: number) => boolean} filter 选项的过滤函数，默认值：-。
 * @property {(letter: DatetimeLetter, option: DatetimeColumnOption, date: Date, index: number) => string | void |undefined} formatter 选项的格式化函数，默认值：-。
 * @property {string [详见特殊符号](../utilities/date#日期格式特殊符号)} valueFormat 绑定值的格式，不指定则绑定值为 Date 对象，默认值：-。
 * @property {string} popoutClass 弹窗框根元素类名，默认值：-。
 * @property {StyleValue} popoutStyle 弹窗框根元素样式，默认值：-。
 * @property {boolean} visible 是否显示弹出框，默认值：-。
 * @property {string} title 弹出框标题，默认值：-。
 * @property {boolean} validateEvent 是否触发表单验证，默认值：true。
 * @property {boolean} resettable 关闭弹出框后，是否可复位弹出框值，默认值：false。
 * @event {(visible: boolean) => void} update 弹出框显隐时触发
 * @event {(value: Date |string | undefined) => void} change 日期时间输入组件值改变时触发
 * @event {() => void} confirm 点击确定按钮时触发
 * @event {(name: TransitionHookName) => void} visible-hook 入场/退场动画状态改变时触发
 * @event {() => void} before-enter 入场动画开始前触发
 * @event {() => void} enter 入场动画开始时触发
 * @event {() => void} after-enter 入场动画结束时触发
 * @event {() => void} enter-cancelled 入场动画取消时触发
 * @event {() => void} before-leave 退场动画开始前触发
 * @event {() => void} leave 退场动画开始时触发
 * @event {() => void} after-leave 退场动画结束时触发
 * @event {() => void} leave-cancelled 退场动画取消时触发
 */
export default  _defineComponent({
  components: {
    SarPopout,
    SarDatetimePicker,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "datetime-picker-popout",
  props:  _mergeDefaults({
    visible: { type: Boolean, required: false },
    title: { type: String, required: false },
    validateEvent: { type: Boolean, required: false },
    popoutClass: { type: String, required: false },
    popoutStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    resettable: { type: Boolean, required: false },
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    type: { type: String, required: false },
    calendar: { type: String, required: false },
    min: { type: [Date, String], required: false },
    max: { type: [Date, String], required: false },
    modelValue: { type: [Date, String], required: false },
    filter: { type: Function, required: false },
    formatter: { type: Function, required: false },
    valueFormat: { type: String, required: false }
  }, defaultDatetimePickerPopoutProps()),
  emits: ["update:visible", "update:model-value", "change", "confirm", "before-enter", "enter", "after-enter", "enter-cancelled", "before-leave", "leave", "after-leave", "leave-cancelled", "visible-hook"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const minDate = computed(
      () => toDate(props.min || getMinDate(), props.valueFormat)
    );
    const maxDate = computed(() => {
      const maxDate2 = toDate(props.max || getMaxDate());
      return maxDate2 < minDate.value ? new Date(minDate.value) : maxDate2;
    });
    const {
      innerVisible,
      innerValue,
      popoutValue,
      onChange,
      onConfirm,
      onVisibleHook
    } = useFormPopout(props, emit, {
      onConfirmBefore() {
        if (!popoutValue.value) {
          const initialValue = getInitialValue(minDate.value, maxDate.value);
          popoutValue.value = props.valueFormat ? formatDate(initialValue, props.valueFormat) : initialValue;
        }
      }
    });
    const onEnter = () => {
      if (!isEmptyBinding(innerValue.value) && popoutValue.value !== innerValue.value) {
        popoutValue.value = innerValue.value;
      }
    };
    const normalizeValue = (value) => {
      const date = value ? toDate(value, props.valueFormat) :  new Date();
      return date < minDate.value ? new Date(minDate.value) : date > maxDate.value ? new Date(maxDate.value) : date;
    };
    watch([minDate, maxDate], () => {
      if (innerValue.value) {
        const oldDate = toDate(innerValue.value, props.valueFormat);
        const value = normalizeValue(innerValue.value);
        if (value.getTime() !== oldDate.getTime()) {
          popoutValue.value = value;
          onConfirm();
        }
      }
    });
    const __returned__ = { props, emit, minDate, maxDate, innerVisible, innerValue, popoutValue, onChange, onConfirm, onVisibleHook, onEnter, normalizeValue, SarPopout, SarDatetimePicker };
    return __returned__;
  }
});
</script>
