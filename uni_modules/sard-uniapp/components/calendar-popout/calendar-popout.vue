<template>
  <sar-popout
    v-model:visible="innerVisible"
    :title="$slots.title ? '' : title"
    :show-confirm="showConfirm"
    :confirm-disabled="confirmDisabled"
    :root-class="popoutClass"
    :root-style="popoutStyle"
    @confirm="onConfirm"
    @visible-hook="onVisibleHook"
  >
    <template #title-prepend>
      <slot name="title-prepend"></slot>
    </template>
    <template #title>
      <slot name="title"></slot>
    </template>
    <template #visible="{ already }">
      <sar-calendar
        v-if="already"
        :model-value="popoutValue"
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
        @change="onChange"
      />
    </template>
  </sar-popout>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import SarPopout from "../popout/popout.vue";
import SarCalendar from "../calendar/calendar.vue";
import {
  defaultCalendarPopoutProps
} from "./common";
import { useFormPopout } from "../../use";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
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
    SarPopout,
    SarCalendar,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "calendar-popout",
  props:  _mergeDefaults({
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
    sameDateText: { type: String, required: false }
  }, defaultCalendarPopoutProps()),
  emits: ["update:visible", "update:model-value", "change", "confirm", "before-enter", "enter", "after-enter", "enter-cancelled", "before-leave", "leave", "after-leave", "leave-cancelled", "visible-hook"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const { innerVisible, popoutValue, onChange, onConfirm, onVisibleHook } = useFormPopout(props, emit, {
      onChange() {
        if (!props.showConfirm && !confirmDisabled.value) {
          onConfirm(false);
          innerVisible.value = false;
        }
      }
    });
    const confirmDisabled = computed(() => {
      const value = popoutValue.value;
      return !value || Array.isArray(value) && value.length === 0;
    });
    const __returned__ = { props, emit, innerVisible, popoutValue, onChange, onConfirm, onVisibleHook, confirmDisabled, SarPopout, SarCalendar };
    return __returned__;
  }
});
</script>
