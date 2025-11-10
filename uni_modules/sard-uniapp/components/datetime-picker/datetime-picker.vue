<template>
  <sar-picker
    :root-class="classNames(rootClass)"
    :root-style="stringifyStyle(rootStyle)"
    :columns="columns"
    :model-value="pickerValue"
    @change="onChange"
  />
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref, watch } from "vue";
import {
  classNames,
  formatDate,
  lunarToSolar,
  solarToLunar,
  stringifyStyle,
  toDate
} from "../../utils";
import SarPicker from "../picker/picker.vue";
import {
  correctDate,
  getBoundaryValue,
  getMaxDate,
  getMinDate,
  letterArray,
  strategies,
  getColumnData,
  defaultDatetimePickerProps
} from "./common";
import { useTranslate } from "../locale";
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
 * @event {(date: Date | string) => void} update 选中的选项改变时触发
 * @event {(date: Date | string) => void} change 选中的选项改变时触发
 */
export default  _defineComponent({
  components: {
    SarPicker,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "datetime-picker",
  props:  _mergeDefaults({
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
  }, defaultDatetimePickerProps),
  emits: ["update:model-value", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const { t } = useTranslate("datetimePicker");
    const createColumnData = (types, currentDate) => {
      minValues = getBoundaryValue(
        props.calendar,
        false,
        minDate.value,
        currentDate
      );
      maxValues = getBoundaryValue(props.calendar, true, maxDate.value, currentDate);
      const getColumnDataByType = (letter) => {
        const strategy = strategies[letter];
        const index = strategy[0];
        return getColumnData(
          props.calendar,
          minValues[index],
          maxValues[index],
          strategy[1],
          letter,
          currentDate,
          t,
          props.filter,
          props.formatter
        );
      };
      return types.map(
        (letter) => columnsMap[letter] = getColumnDataByType(letter)
      );
    };
    const getChangedLetter = (currentDate) => {
      const min = getBoundaryValue(
        props.calendar,
        false,
        minDate.value,
        currentDate
      );
      const max = getBoundaryValue(props.calendar, true, maxDate.value, currentDate);
      return letterArray.filter(
        (_, i) => min[i] !== minValues[i] || max[i] !== maxValues[i]
      );
    };
    let lunarYearChanged = false;
    const updateColumns = (currentDate) => {
      const changedLetter = getChangedLetter(currentDate);
      if (props.calendar === "lunar" && !changedLetter.includes("M") && innerType.value.includes("M") && lunarYearChanged) {
        changedLetter.push("M");
        lunarYearChanged = false;
      }
      if (changedLetter.length) {
        const changedColumns = createColumnData(changedLetter, currentDate);
        const nextColumns = innerType.value.map((letter) => {
          for (let i = 0, l = changedLetter.length; i < l; i++) {
            if (changedLetter[i] === letter) {
              return changedColumns[i];
            }
          }
          return columnsMap[letter];
        });
        columns.value = nextColumns;
      }
    };
    const getDateByPickerValue = (value) => {
      let currEvery;
      if (props.calendar === "solar") {
        currEvery = letterArray.map((letter) => {
          const stratery = strategies[letter];
          for (let i = 0, l = innerType.value.length; i < l; i++) {
            if (innerType.value[i] === letter) {
              return value[i];
            }
          }
          return stratery[4](innerValue.value);
        });
      } else {
        const lunarDate = solarToLunar(
          innerValue.value.getFullYear(),
          innerValue.value.getMonth() + 1,
          innerValue.value.getDate()
        );
        const yearIndex = innerType.value.indexOf("y");
        if (yearIndex !== -1) {
          lunarYearChanged = lunarDate.year !== value[yearIndex];
        }
        currEvery = letterArray.map((letter) => {
          for (let i = 0, l = innerType.value.length; i < l; i++) {
            if (innerType.value[i] === letter) {
              return value[i];
            }
          }
          switch (letter) {
            case "y":
              return lunarDate.year;
            case "M":
              return lunarDate.month;
            case "d":
              return lunarDate.day;
            default:
              return strategies[letter][4](innerValue.value);
          }
        });
      }
      correctDate(
        props.calendar,
        currEvery,
        minDate.value,
        maxDate.value
      );
      let date;
      if (props.calendar === "solar") {
        currEvery[1]--;
        date = new Date(...currEvery);
      } else {
        const solarDate = lunarToSolar(currEvery[0], currEvery[1], currEvery[2]);
        date = new Date(
          solarDate.year,
          solarDate.month - 1,
          solarDate.day,
          currEvery[3],
          currEvery[4],
          currEvery[5]
        );
      }
      return date;
    };
    const normalizeValue = (value) => {
      const date = value ? toDate(value, props.valueFormat) :  new Date();
      return date < minDate.value ? new Date(minDate.value) : date > maxDate.value ? new Date(maxDate.value) : date;
    };
    const innerType = computed(() => {
      return props.type.split("");
    });
    const minDate = computed(
      () => toDate(props.min || getMinDate(), props.valueFormat)
    );
    const maxDate = computed(() => {
      const maxDate2 = toDate(props.max || getMaxDate());
      return maxDate2 < minDate.value ? new Date(minDate.value) : maxDate2;
    });
    const innerValue = ref(normalizeValue(props.modelValue));
    let currentEmitValue = innerValue.value;
    watch(
      () => props.modelValue,
      () => {
        if (currentEmitValue !== props.modelValue) {
          innerValue.value = normalizeValue(props.modelValue);
          if (props.modelValue) {
            updateColumns(innerValue.value);
          }
        }
      }
    );
    const emitChange = () => {
      const emitValue = props.valueFormat ? formatDate(innerValue.value, props.valueFormat) : innerValue.value;
      currentEmitValue = emitValue;
      emit("update:model-value", emitValue);
      emit("change", emitValue);
    };
    watch([minDate, maxDate], () => {
      const oldDate = toDate(innerValue.value, props.valueFormat);
      const value = normalizeValue(innerValue.value);
      innerValue.value = value;
      updateColumns(value);
      if (value.getTime() !== oldDate.getTime()) {
        emitChange();
      }
    });
    const pickerValue = computed(() => {
      if (props.calendar === "solar") {
        return innerType.value.map((letter) => {
          return strategies[letter][4](innerValue.value);
        });
      } else {
        const lunarDate = solarToLunar(
          innerValue.value.getFullYear(),
          innerValue.value.getMonth() + 1,
          innerValue.value.getDate()
        );
        return innerType.value.map((letter) => {
          switch (letter) {
            case "y":
              return lunarDate.year;
            case "M":
              return lunarDate.month;
            case "d":
              return lunarDate.day;
            default:
              return strategies[letter][4](innerValue.value);
          }
        });
      }
    });
    const columnsMap = {};
    let minValues = [];
    let maxValues = [];
    const columns = ref(createColumnData(innerType.value, innerValue.value));
    const onChange = (value) => {
      value = value.map((item) => item || 0);
      const nextValue = getDateByPickerValue(value);
      innerValue.value = nextValue;
      updateColumns(nextValue);
      emitChange();
    };
    const __returned__ = { props, emit, t, createColumnData, getChangedLetter, get lunarYearChanged() {
      return lunarYearChanged;
    }, set lunarYearChanged(v) {
      lunarYearChanged = v;
    }, updateColumns, getDateByPickerValue, normalizeValue, innerType, minDate, maxDate, innerValue, get currentEmitValue() {
      return currentEmitValue;
    }, set currentEmitValue(v) {
      currentEmitValue = v;
    }, emitChange, pickerValue, columnsMap, get minValues() {
      return minValues;
    }, set minValues(v) {
      minValues = v;
    }, get maxValues() {
      return maxValues;
    }, set maxValues(v) {
      maxValues = v;
    }, columns, onChange, get classNames() {
      return classNames;
    }, get stringifyStyle() {
      return stringifyStyle;
    }, SarPicker };
    return __returned__;
  }
});
</script>
