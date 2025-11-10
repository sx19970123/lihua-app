<template>
  <sar-popout-input
    v-model="inputValue"
    :placeholder="placeholder"
    :readonly="readonly"
    :disabled="disabled"
    :clearable="clearable"
    :root-class="rootClass"
    :root-style="rootStyle"
    :arrow="arrow"
    :internal-arrow="$slots.arrow ? 1 : 0"
    :input-props="inputProps"
    @clear="onClear"
    @click="show"
  >
    <template v-if="$slots.arrow" #arrow>
      <slot name="arrow"></slot>
    </template>
    <sar-datetime-picker-popout
      v-model:visible="innerVisible"
      v-model="innerValue"
      keep-render
      :title="title ?? placeholder"
      :root-class="popoutClass"
      :root-style="popoutStyle"
      :type="type"
      :min="min"
      :max="max"
      :filter="filter"
      :formatter="formatter"
      :value-format="valueFormat"
      :validate-event="validateEvent"
      :calendar="calendar"
      :resettable="resettable"
      @change="onChange"
      @visible-hook="onVisibleHook"
      @confirm="onConfirm"
    />
  </sar-popout-input>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { watch } from "vue";
import SarPopoutInput from "../popout-input/popout-input.vue";
import SarDatetimePickerPopout from "../datetime-picker-popout/datetime-picker-popout.vue";
import { formatDate, isString, parseDate } from "../../utils";
import { usePopoutInput } from "../../use";
import {
  defaultDatetimePickerInputProps,
  mapTypeFormat
} from "./common";
/**
 * @property {string} rootClass 弹出式输入框根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 弹出式输入框根元素样式，默认值：-。
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
 * @property {boolean} disabled 禁用状态，默认值：false。
 * @property {boolean} readonly 只读状态，默认值：false。
 * @property {boolean} clearable 是否显示清空按钮，默认值：false。
 * @property {string} placeholder 输入框占位符内容，默认值：-。
 * @property {string [详见特殊符号](../utilities/date#日期格式特殊符号)} outletFormat 输出到输入框的日期格式，不指定则根据 `type` 属性自动生成格式，默认值：-。
 * @property {() => any} valueOnClear 设置点击清除按钮后的值，默认值：() => undefined。
 * @property {string} arrow 自定义箭头图标名，默认值：'caret-right'。
 * @property {string} arrowFamily 自定义箭头图标字体，默认值：'sari'。
 * @property {InputProps} inputProps 自定义输入框组件属性，默认值：-。
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
    SarPopoutInput,
    SarDatetimePickerPopout,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "datetime-picker-input",
  props:  _mergeDefaults({
    outletFormat: { type: String, required: false },
    valueOnClear: { type: Function, required: false },
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
    valueFormat: { type: String, required: false },
    placeholder: { type: String, required: false },
    readonly: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    clearable: { type: Boolean, required: false },
    multiline: { type: Boolean, required: false },
    arrow: { type: String, required: false },
    arrowFamily: { type: String, required: false },
    internalArrow: { type: Number, required: false },
    inputProps: { type: Object, required: false }
  }, defaultDatetimePickerInputProps()),
  emits: ["update:visible", "update:model-value", "change", "confirm", "before-enter", "enter", "after-enter", "enter-cancelled", "before-leave", "leave", "after-leave", "leave-cancelled", "visible-hook"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const {
      innerVisible,
      innerValue,
      inputValue,
      show,
      onChange,
      onClear,
      onVisibleHook
    } = usePopoutInput(props, emit);
    function getOutletText(value) {
      if (isString(value) && props.valueFormat) {
        value = parseDate(value, props.valueFormat);
      }
      if (value instanceof Date) {
        return formatDate(
          value,
          props.outletFormat || mapTypeFormat[props.type]
        );
      }
      return value;
    }
    function getInputValue() {
      if (!innerValue.value) {
        return "";
      }
      return getOutletText(innerValue.value);
    }
    watch(
      innerValue,
      () => {
        inputValue.value = getInputValue();
      },
      {
        immediate: true
      }
    );
    const onConfirm = () => {
      emit("confirm");
    };
    const __returned__ = { props, emit, innerVisible, innerValue, inputValue, show, onChange, onClear, onVisibleHook, getOutletText, getInputValue, onConfirm, SarPopoutInput, SarDatetimePickerPopout };
    return __returned__;
  }
});
</script>
