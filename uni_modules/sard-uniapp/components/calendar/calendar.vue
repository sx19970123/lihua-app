<template>
  <view :class="calendarClass" :style="calendarStyle">
    <view :class="bem.e('header')">
      <view v-if="!severalMonths" :class="bem.e('toolbar')">
        <view :class="bem.e('toolbar-inner')">
          <sar-button
            type="pale-text"
            theme="neutral"
            :disabled="
              toMonthNumber(innerCurrentDate) <= toMonthNumber(minDate)
            "
            :block="false"
            @click="onPrevMonthClick"
          >
            <sar-icon family="sari" name="left" size="32rpx" />
          </sar-button>
          <sar-button
            type="pale-text"
            theme="neutral"
            :block="false"
            @click="onMonthClick"
          >
            {{
              t('monthTitle', {
                year: innerCurrentDate.getFullYear(),
                month: String(innerCurrentDate.getMonth() + 1).padStart(2, '0'),
              })
            }}
          </sar-button>
          <sar-button
            type="pale-text"
            theme="neutral"
            :disabled="
              toMonthNumber(innerCurrentDate) >= toMonthNumber(maxDate)
            "
            :block="false"
            @click="onNextMonthClick"
          >
            <sar-icon family="sari" name="right" size="32rpx" />
          </sar-button>
        </view>
      </view>
      <view :class="bem.e('week')">
        <view v-for="(item, i) in weeks" :key="i" :class="bem.e('week-item')">
          {{ t(`weeks.${item}`) }}
        </view>
      </view>
    </view>
    <view :class="bodyClass">
      <scroll-view
        :class="bem.e('scroll')"
        :scroll-y="severalMonths"
        trap-scroll
        :upper-threshold="0"
        :lower-threshold="0"
        :throttle="false"
        @scroll="onScroll"
        @scrolltoupper="onScrolltoupper"
        @scrolltolower="onScrolltolower"
      >
        <sar-calendar-month
          v-for="(month, i) in months"
          :key="i"
          :year="month[0]"
          :month="month[1]"
          :type="type"
          :min-date="minDate"
          :max-date="maxDate"
          :current-dates="currentDates"
          :formatter="formatter"
          :disabled-date="disabledDate"
          :today-number="todayNumber"
          :week-starts-on="weekStartsOn"
          :several-months="severalMonths"
          :start-date-text="startDateText"
          :end-date-text="endDateText"
          :same-date-text="sameDateText"
          :t="t"
          :bem="bem"
          @day-click="onDayClick"
        />
      </scroll-view>
    </view>
    <sar-popout
      v-if="!severalMonths"
      v-model:visible="pickerVisible"
      type="compact"
      @confirm="onPickerConfirm"
    >
      <template #visible="{ already }">
        <sar-datetime-picker
          v-if="already"
          type="yM"
          v-model="pickerValue"
          :min="minDate"
          :max="maxDate"
        />
      </template>
    </sar-popout>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref, watch } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  minmaxDate,
  toDateNumber,
  toMonthNumber,
  getPrevMonthDate,
  getNextMonthDate,
  toArray,
  parseDate,
  formatDate
} from "../../utils";
import { useTranslate } from "../locale";
import { useScrollSide } from "../../use";
import {
  defaultCalendarProps,
  getMaxDate,
  getMinDate,
  sortDates,
  weeksIndex
} from "./common";
import { useInPopup } from "../popup/common";
import SarButton from "../button/button.vue";
import SarIcon from "../icon/icon.vue";
import SarCalendarMonth from "../calendar-month/calendar-month.vue";
import SarPopout from "../popout/popout.vue";
import SarDatetimePicker from "../datetime-picker/datetime-picker.vue";
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
 * @event {(value: Date | Date[] | string | string[]) => void} update 点击并选中任意日期时触发
 * @event {(value: Date | Date[] | string | string[]) => void} change 点击并选中任意日期时触发
 */
export default  _defineComponent({
  components: {
    SarButton,
    SarIcon,
    SarCalendarMonth,
    SarPopout,
    SarDatetimePicker,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "calendar",
  props:  _mergeDefaults({
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
  }, defaultCalendarProps),
  emits: ["update:model-value", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("calendar");
    const { t } = useTranslate("calendar");
    const minDate = computed(() => {
      return props.min || getMinDate(props.severalMonths);
    });
    const maxDate = computed(() => {
      const maxDate2 = props.max || getMaxDate(props.severalMonths);
      return maxDate2.getTime() < minDate.value.getTime() ? new Date(minDate.value) : maxDate2;
    });
    const toDate = (date) => {
      if (date instanceof Date) {
        return date;
      }
      return parseDate(date, props.valueFormat);
    };
    const makeDate = (date) => {
      return Array.isArray(date) ? date.map((item) => toDate(item)) : toDate(date);
    };
    const normalizeValue = (value) => {
      return value ? makeDate(value) : props.type === "single" ? void 0 : [];
    };
    const innerValue = ref(
      normalizeValue(props.modelValue)
    );
    let currentEmitValue = innerValue.value;
    watch(
      () => props.modelValue,
      () => {
        if (currentEmitValue !== props.modelValue) {
          innerValue.value = normalizeValue(props.modelValue);
          currentEmitValue = props.modelValue;
        }
      }
    );
    const getInitialCurrentDate = () => {
      let date =  new Date();
      const value = toArray(innerValue.value)[0];
      if (value) {
        date = value;
      }
      if (props.currentDate) {
        date = props.currentDate;
      }
      return minmaxDate(date, minDate.value, maxDate.value);
    };
    const innerCurrentDate = ref(getInitialCurrentDate());
    watch(
      () => props.currentDate,
      () => {
        innerCurrentDate.value = minmaxDate(
          props.currentDate ||  new Date(),
          minDate.value,
          maxDate.value
        );
      }
    );
    watch(innerValue, () => {
      const onlyOneDate = Array.isArray(innerValue.value) ? innerValue.value.length === 1 ? innerValue.value[0] : void 0 : innerValue.value;
      if (onlyOneDate && toMonthNumber(onlyOneDate) !== toMonthNumber(innerCurrentDate.value)) {
        innerCurrentDate.value = onlyOneDate;
      }
    });
    const startDate = ref(
      props.type === "range" && Array.isArray(innerValue.value) && innerValue.value.length === 1 ? innerValue.value[0] : void 0
    );
    const onPrevMonthClick = () => {
      innerCurrentDate.value = getPrevMonthDate(innerCurrentDate.value);
    };
    const onNextMonthClick = () => {
      innerCurrentDate.value = getNextMonthDate(innerCurrentDate.value);
    };
    const pickerVisible = ref(false);
    const pickerValue = ref(innerCurrentDate.value);
    const onMonthClick = () => {
      pickerValue.value = innerCurrentDate.value;
      pickerVisible.value = true;
    };
    const onPickerConfirm = () => {
      if (toMonthNumber(innerCurrentDate.value) !== toMonthNumber(pickerValue.value)) {
        innerCurrentDate.value = pickerValue.value;
      }
    };
    const weeks = computed(() => {
      return weeksIndex.slice(props.weekStartsOn).concat(weeksIndex.slice(0, props.weekStartsOn));
    });
    const months = computed(() => {
      if (!props.severalMonths) {
        return [
          [innerCurrentDate.value.getFullYear(), innerCurrentDate.value.getMonth()]
        ];
      }
      const minYear = minDate.value.getFullYear();
      const minMonth = minDate.value.getMonth();
      const maxYear = maxDate.value.getFullYear();
      const maxMonth = maxDate.value.getMonth();
      const months2 = (maxYear - minYear) * 12 + (maxMonth - minMonth + 1);
      return Array(months2).fill(0).map((_, i) => {
        return [minYear + Math.floor((minMonth + i) / 12), (minMonth + i) % 12];
      });
    });
    const todayNumber = toDateNumber( new Date());
    const currentDates = computed(() => {
      let dates;
      if (props.type === "range" && startDate.value) {
        dates = [startDate.value];
      } else {
        if (Array.isArray(innerValue.value)) {
          dates = innerValue.value;
        } else if (innerValue.value) {
          dates = [innerValue.value];
        } else {
          dates = [];
        }
      }
      return dates;
    });
    const onDayClick = (date) => {
      let nextValue;
      if (props.type === "single") {
        nextValue = date;
      } else if (props.type === "multiple") {
        if (Array.isArray(innerValue.value)) {
          if (innerValue.value.some((d) => toDateNumber(d) === toDateNumber(date))) {
            nextValue = innerValue.value.filter(
              (d) => toDateNumber(d) !== toDateNumber(date)
            );
          } else {
            if (innerValue.value.length >= props.maxDays) {
              props.overMaxDays?.();
              return;
            }
            nextValue = sortDates(innerValue.value.concat(date));
          }
        }
      } else if (props.type === "range") {
        if (startDate.value) {
          const startDays = toDateNumber(startDate.value);
          const endDays = toDateNumber(date);
          if (!props.allowSameDay && startDays === endDays) {
            return;
          }
          const startAgain = endDays < startDays;
          if (startAgain) {
            startDate.value = date;
            return;
          }
          let endDate = date;
          if (endDays - startDays + 1 > props.maxDays) {
            props.overMaxDays?.();
            endDate = new Date(startDate.value);
            endDate.setDate(endDate.getDate() + (props.maxDays - 1));
          }
          nextValue = [startDate.value, endDate];
        } else {
          nextValue = [];
        }
        startDate.value = startDate.value ? void 0 : date;
      }
      if (nextValue !== void 0) {
        innerValue.value = nextValue;
        const emitValue = props.valueFormat ? Array.isArray(nextValue) ? nextValue.map((item) => formatDate(item, props.valueFormat)) : formatDate(nextValue, props.valueFormat) : nextValue;
        currentEmitValue = emitValue;
        emit("update:model-value", emitValue);
        emit("change", emitValue);
      }
    };
    const inPopup = useInPopup();
    const preventPageScroll = computed(() => {
      return inPopup && !props.severalMonths;
    });
    const { scrollSide, onScroll, onScrolltoupper, onScrolltolower } = useScrollSide();
    const bodyClass = computed(() => {
      return classNames(
        bem.e("body"),
        bem.em("body", scrollSide.value, scrollSide.value)
      );
    });
    const calendarClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("several", props.severalMonths),
        bem.m("no-scroll", preventPageScroll.value),
        props.rootClass
      );
    });
    const calendarStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, t, minDate, maxDate, toDate, makeDate, normalizeValue, innerValue, get currentEmitValue() {
      return currentEmitValue;
    }, set currentEmitValue(v) {
      currentEmitValue = v;
    }, getInitialCurrentDate, innerCurrentDate, startDate, onPrevMonthClick, onNextMonthClick, pickerVisible, pickerValue, onMonthClick, onPickerConfirm, weeks, months, todayNumber, currentDates, onDayClick, inPopup, preventPageScroll, scrollSide, onScroll, onScrolltoupper, onScrolltolower, bodyClass, calendarClass, calendarStyle, get toMonthNumber() {
      return toMonthNumber;
    }, SarButton, SarIcon, SarCalendarMonth, SarPopout, SarDatetimePicker };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>