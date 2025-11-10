<template>
  <view :class="bem.e('month')">
    <view v-if="severalMonths" :class="bem.e('month-title')">
      {{
        t('monthTitle', {
          year,
          month: month + 1,
        })
      }}
    </view>
    <view :class="bem.e('days')">
      <view
        v-for="(item, i) in daysInfo"
        :key="i"
        :class="item.className"
        :style="item.style"
        @click="onDayClick(item.day)"
      >
        <view v-if="item.day.top" :class="bem.e('top')">
          {{ item.day.top }}
        </view>
        {{ item.day.text }}
        <view v-if="item.day.bottom" :class="bem.e('bottom')">
          {{ item.day.bottom }}
        </view>
      </view>

      <view :class="bem.e('mark')">{{ month + 1 }}</view>
    </view>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import {
  getDaysInMonth,
  getDaysBeforeFirstDay,
  getPrevMonthTailDays,
  getNextMonthHeadDays,
  toDateNumber,
  stringifyStyle,
  classNames
} from "../../utils";
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "calendar-month",
  props: {
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    type: { type: String, required: true },
    minDate: { type: Date, required: true },
    maxDate: { type: Date, required: true },
    currentDates: { type: Array, required: true },
    formatter: { type: Function, required: false },
    disabledDate: { type: Function, required: false },
    todayNumber: { type: Number, required: true },
    weekStartsOn: { type: Number, required: true },
    severalMonths: { type: Boolean, required: false },
    t: { type: Function, required: true },
    bem: { type: null, required: true },
    startDateText: { type: String, required: false },
    endDateText: { type: String, required: false },
    sameDateText: { type: String, required: false }
  },
  emits: ["day-click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const days = computed(() => {
      return getDaysInMonth(props.year, props.month);
    });
    const daysBefore = computed(() => {
      return getDaysBeforeFirstDay(props.year, props.month, props.weekStartsOn);
    });
    const allDays = computed(() => {
      const currentDays = Array(days.value).fill(0).map((_, i) => new Date(props.year, props.month, i + 1));
      if (props.severalMonths) {
        return currentDays;
      }
      const prevMonthTailDays = getPrevMonthTailDays(
        props.year,
        props.month,
        props.weekStartsOn
      );
      const nextMonthHeadDays = getNextMonthHeadDays(
        props.year,
        props.month,
        props.weekStartsOn
      );
      return [...prevMonthTailDays, ...currentDays, ...nextMonthHeadDays];
    });
    function withinMonth(i) {
      return props.severalMonths ? true : i >= daysBefore.value && i < daysBefore.value + days.value;
    }
    const types = {
      same: "same",
      start: "start",
      middle: "middle",
      end: "end",
      selected: "selected",
      normal: "normal"
    };
    const daysInfo = computed(() => {
      return allDays.value.map((date, i) => {
        const dateNumber = toDateNumber(date);
        const within = withinMonth(i);
        let disabled = false;
        if (!within) {
          disabled = true;
        } else {
          if (props.disabledDate) {
            disabled = props.disabledDate(date);
          }
          if (dateNumber < toDateNumber(props.minDate) || dateNumber > toDateNumber(props.maxDate)) {
            disabled = true;
          }
        }
        const selected = within && props.type !== "range" && props.currentDates.some((d) => toDateNumber(d) === dateNumber);
        const isStart = within && props.type === "range" && props.currentDates[0] && toDateNumber(props.currentDates[0]) === dateNumber;
        const isEnd = within && props.type === "range" && props.currentDates[1] && toDateNumber(props.currentDates[1]) === dateNumber;
        const isMiddle = within && props.type === "range" && props.currentDates.length === 2 && dateNumber > toDateNumber(props.currentDates[0]) && dateNumber < toDateNumber(props.currentDates[1]);
        const day = {
          date,
          disabled,
          top: "",
          text: date.getDate() + "",
          bottom: isStart && isEnd ? props.sameDateText || `${props.t("start")}/${props.t("end")}` : isStart ? props.startDateText || props.t("start") : isEnd ? props.endDateText || props.t("end") : "",
          type: isStart && isEnd ? "same" : isStart ? "start" : isMiddle ? "middle" : isEnd ? "end" : selected ? "selected" : "normal"
        };
        if (within && props.formatter) {
          props.formatter(day);
        }
        const type = types[day.type];
        return {
          day,
          style: stringifyStyle(day.style, {
            marginLeft: props.severalMonths && i === 0 ? daysBefore.value / 7 * 100 + "%" : null
          }),
          className: classNames(
            props.bem.e("day"),
            props.bem.em("day", type, type !== "normal"),
            props.bem.em("day", "without", !within),
            props.bem.em("day", "disabled", disabled),
            props.bem.em("day", "today", props.todayNumber === dateNumber),
            day.className
          )
        };
      });
    });
    const onDayClick = (day) => {
      if (!day.disabled) {
        emit("day-click", day.date);
      }
    };
    const __returned__ = { props, emit, days, daysBefore, allDays, withinMonth, types, daysInfo, onDayClick };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>