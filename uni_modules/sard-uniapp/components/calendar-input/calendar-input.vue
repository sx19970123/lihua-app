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
    <sar-calendar-popout
      v-model:visible="innerVisible"
      v-model="innerValue"
      :title="title ?? placeholder"
      :show-confirm="showConfirm"
      :root-class="popoutClass"
      :root-style="popoutStyle"
      :type="type"
      :min="min"
      :max="max"
      :current-date="currentDate"
      :disabled-date="disabledDate"
      :max-days="maxDays"
      :over-max-days="overMaxDays"
      :week-starts-on="weekStartsOn"
      :formatter="formatter"
      :allow-same-day="allowSameDay"
      :start-date-text="startDateText"
      :end-date-text="endDateText"
      :same-date-text="sameDateText"
      :several-months="severalMonths"
      :value-format="valueFormat"
      :validate-event="validateEvent"
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
import SarCalendarPopout from "../calendar-popout/calendar-popout.vue";
import { formatDate, isString, parseDate } from "../../utils";
import { usePopoutInput } from "../../use";
import { useTranslate } from "../locale";
import {
  defaultCalendarInputProps
} from "./common";
/**
 * @property {string} rootClass 弹出式输入框根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 弹出式输入框根元素样式，默认值：-。
 * @property {CalendarType} type 日历类型，默认值：'single'。
 * @property {Date | Date[] | string | string[]} modelValue 选中的日期，单选时为当个日期，多选时为日期数组，范围时为两个日期数组，默认值：-。
 * @property {Date} min 可选择的最小日期，默认值：前十年，或者当前月（设置了 `several-months`）。
 * @property {Date} max 可选择的最大日期，默认值：后十年，或者三个月后（设置了 `several-months`）。
 * @property {Date} currentDate 当前展示月份的日期，默认值：-。
 * @property {(date: Date) => boolean} disabledDate 指定禁选日期，返回 `true` 表示禁选，默认值：-。
 * @property {number} maxDays 最多可选天数，用于多选和范围，默认值：Number.MAX_SAFE_INTEGER。
 * @property {() => void} overMaxDays 超出最多可选天数时触发，默认值：-。
 * @property {number} weekStartsOn 指定一周以周几开始，`0` 表示周日，`1-6` 分别表示周一至周六，默认值：0。
 * @property {(day: CalendarDay) => void} formatter 通过修改 `CalendarDay` 对象属性值，来自定义日期的文案和样式，默认值：-。
 * @property {boolean} allowSameDay 范围选择中，是否允许起始和结束为同一天，默认值：false。
 * @property {boolean} severalMonths 是否显示多个月，默认值：false。
 * @property {string [详见特殊符号](../utilities/date#日期格式特殊符号)} valueFormat 绑定值的格式，不指定则绑定值为 Date 对象，默认值：-。
 * @property {string} startDateText 开始日期文字，默认值：'开始'。
 * @property {string} endDateText 结束日期文字，默认值：'结束'。
 * @property {string} sameDateText 选择同一天日期文字，默认值：'开始/结束'。
 * @property {string} popoutClass 弹窗框根元素类名，默认值：-。
 * @property {StyleValue} popoutStyle 弹窗框根元素样式，默认值：-。
 * @property {boolean} visible 是否显示弹出框，默认值：-。
 * @property {string} title 弹出框标题，默认值：-。
 * @property {boolean} showConfirm 是否显示确定按钮，隐藏按钮可用于快捷选择，默认值：true。
 * @property {boolean} validateEvent 是否触发表单验证，默认值：true。
 * @property {boolean} resettable 关闭弹出框后，是否可复位弹出框值，默认值：false。
 * @property {boolean} disabled 禁用状态，默认值：false。
 * @property {boolean} readonly 只读状态，默认值：false。
 * @property {boolean} clearable 是否显示清空按钮，默认值：false。
 * @property {string} placeholder 输入框占位符内容，默认值：-。
 * @property {string [详见特殊符号](../utilities/date#日期格式特殊符号)} outletFormat 输出到输入框的日期格式，默认值：'YYYY-MM-DD'。
 * @property {() => any} valueOnClear 设置点击清除按钮后的值，默认值：() => undefined。
 * @property {string} arrow 自定义箭头图标名，默认值：'caret-right'。
 * @property {string} arrowFamily 自定义箭头图标字体，默认值：'sari'。
 * @property {InputProps} inputProps 自定义输入框组件属性，默认值：-。
 * @event {(visible: boolean) => void} update 弹出框显隐时触发
 * @event {(value: Date | Date[] | string | string[] | undefined) => void} change 日历组件值改变时触发
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
    SarCalendarPopout,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "calendar-input",
  props:  _mergeDefaults({
    outletFormat: { type: String, required: false },
    valueOnClear: { type: Function, required: false },
    visible: { type: Boolean, required: false },
    title: { type: String, required: false },
    showConfirm: { type: Boolean, required: false },
    validateEvent: { type: Boolean, required: false },
    popoutClass: { type: String, required: false },
    popoutStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    resettable: { type: Boolean, required: false },
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    type: { type: String, required: false },
    modelValue: { type: [Date, Array, String], required: false },
    min: { type: Date, required: false },
    max: { type: Date, required: false },
    currentDate: { type: Date, required: false },
    disabledDate: { type: Function, required: false },
    maxDays: { type: Number, required: false },
    overMaxDays: { type: Function, required: false },
    weekStartsOn: { type: Number, required: false },
    formatter: { type: Function, required: false },
    allowSameDay: { type: Boolean, required: false },
    severalMonths: { type: Boolean, required: false },
    valueFormat: { type: String, required: false },
    startDateText: { type: String, required: false },
    endDateText: { type: String, required: false },
    sameDateText: { type: String, required: false },
    placeholder: { type: String, required: false },
    readonly: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    clearable: { type: Boolean, required: false },
    multiline: { type: Boolean, required: false },
    arrow: { type: String, required: false },
    arrowFamily: { type: String, required: false },
    internalArrow: { type: Number, required: false },
    inputProps: { type: Object, required: false }
  }, defaultCalendarInputProps()),
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
    const { t } = useTranslate("calendar");
    function getOutletTextMayByStr(date) {
      if (isString(date) && props.valueFormat) {
        date = parseDate(date, props.valueFormat);
      }
      if (date instanceof Date) {
        return formatDate(date, props.outletFormat);
      }
      return date;
    }
    function getOutletText(date, type) {
      if (type === "single") {
        return getOutletTextMayByStr(date);
      }
      if (type === "range") {
        return [
          getOutletTextMayByStr(date[0]),
          getOutletTextMayByStr(date[1])
        ].join(` ${t("to")} `);
      }
      if (type === "multiple") {
        return t("multipleOutlet", {
          count: date.length
        });
      }
      return "";
    }
    function getInputValue() {
      if (!innerValue.value || Array.isArray(innerValue.value) && innerValue.value.length === 0) {
        return "";
      }
      return getOutletText(innerValue.value, props.type);
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
    const __returned__ = { props, emit, innerVisible, innerValue, inputValue, show, onChange, onClear, onVisibleHook, t, getOutletTextMayByStr, getOutletText, getInputValue, onConfirm, SarPopoutInput, SarCalendarPopout };
    return __returned__;
  }
});
</script>
