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
    :loading="loading"
    @clear="onClear"
    @click="onClick"
  >
    <template v-if="$slots.arrow" #arrow>
      <slot name="arrow"></slot>
    </template>

    <sar-picker-popout
      v-model:visible="innerVisible"
      v-model="innerValue"
      keep-render
      :title="title ?? placeholder"
      :root-class="popoutClass"
      :root-style="popoutStyle"
      :columns="columns"
      :option-keys="optionKeys"
      :immediate-change="immediateChange"
      :validate-event="validateEvent"
      :internal-custom="$slots.custom ? 1 : 0"
      :resettable="resettable"
      @change="onChange"
      @visible-hook="onVisibleHook"
      @confirm="onConfirm"
    >
      <template
        v-if="$slots.custom"
        #custom="{
          columns,
          maskClass,
          pickerViewClass,
          indicatorClass,
          value,
          onChange,
        }"
      >
        <slot
          name="custom"
          :columns="columns"
          :picker-view-class="pickerViewClass"
          :mask-class="maskClass"
          :indicator-class="indicatorClass"
          :value="value"
          :on-change="onChange"
        ></slot>
      </template>
    </sar-picker-popout>
  </sar-popout-input>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, watch } from "vue";
import SarPopoutInput from "../popout-input/popout-input.vue";
import SarPickerPopout from "../picker-popout/picker-popout.vue";
import {
  defaultOptionKeys,
  getIndexesByValue,
  getOptionsByIndexes,
  getValueOrLabelByOption
} from "../picker/common";
import { isEmptyArray, isEmptyBinding, toArray } from "../../utils";
import { usePopoutInput } from "../../use";
import {
  defaultPickerInputProps
} from "./common";
/**
 * @property {string} rootClass 弹出式输入框根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 弹出式输入框根元素样式，默认值：-。
 * @property {PickerOption[] | PickerOption[][]} columns 配置每一列的数据，默认值：[]。
 * @property {PickerOptionKeys} optionKeys 自定义 `columns` 结构中的字段，默认值：{label: 'label', value: 'value', children: 'children'}。
 * @property {any} modelValue 选中项的值，默认值：-。
 * @property {boolean} immediateChange 是否在手指松开时立即触发 `update:model-value` 事件，默认值：false。
 * @property {string} popoutClass 弹窗框根元素类名，默认值：-。
 * @property {StyleValue} popoutStyle 弹窗框根元素样式，默认值：-。
 * @property {boolean} visible 是否显示弹出框，默认值：-。
 * @property {string} title 弹出框标题，默认值：-。
 * @property {boolean} validateEvent 是否触发表单验证，默认值：true。
 * @property {boolean} resettable 关闭弹出框后，是否可复位弹出框值，默认值：false。
 * @property {boolean} disabled 禁用状态，默认值：false。
 * @property {boolean} readonly 只读状态，默认值：false。
 * @property {boolean} loading 加载状态，默认值：false。
 * @property {boolean} clearable 是否显示清空按钮，默认值：false。
 * @property {string} placeholder 输入框占位符内容，默认值：-。
 * @property {() => any} valueOnClear 设置点击清除按钮后的值，默认值：() => undefined。
 * @property {string} arrow 自定义箭头图标名，默认值：'caret-right'。
 * @property {string} arrowFamily 自定义箭头图标字体，默认值：'sari'。
 * @property {InputProps} inputProps 自定义输入框组件属性，默认值：-。
 * @event {(visible: boolean) => void} update 弹出框显隐时触发
 * @event {(value: any) => void} change 选择器输入组件值改变时触发
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
    SarPickerPopout,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "picker-input",
  props:  _mergeDefaults({
    valueOnClear: { type: Function, required: false },
    visible: { type: Boolean, required: false },
    title: { type: String, required: false },
    validateEvent: { type: Boolean, required: false },
    popoutClass: { type: String, required: false },
    popoutStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    resettable: { type: Boolean, required: false },
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    columns: { type: Array, required: false },
    optionKeys: { type: Object, required: false },
    modelValue: { type: null, required: false },
    immediateChange: { type: Boolean, required: false },
    internalCustom: { type: Number, required: false },
    placeholder: { type: String, required: false },
    readonly: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    clearable: { type: Boolean, required: false },
    loading: { type: Boolean, required: false },
    multiline: { type: Boolean, required: false },
    arrow: { type: String, required: false },
    arrowFamily: { type: String, required: false },
    internalArrow: { type: Number, required: false },
    inputProps: { type: Object, required: false }
  }, defaultPickerInputProps()),
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
    const onClick = () => {
      if (props.columns && props.columns.length > 0) {
        show();
      }
    };
    const fieldKeys = computed(() => {
      return Object.assign({}, defaultOptionKeys, props.optionKeys);
    });
    function getOutletText(columns, optionKeys, value) {
      const indexes = getIndexesByValue(toArray(value), columns || [], optionKeys);
      const options = getOptionsByIndexes(indexes, columns || [], optionKeys);
      const labels = options.map(
        (option) => getValueOrLabelByOption(option, optionKeys.label)
      );
      return labels.join("/");
    }
    function getInputValue() {
      if (isEmptyBinding(innerValue.value) || isEmptyArray(innerValue.value)) {
        return "";
      }
      return getOutletText(props.columns, fieldKeys.value, innerValue.value);
    }
    watch(
      [innerValue, () => props.columns],
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
    const __returned__ = { props, emit, innerVisible, innerValue, inputValue, show, onChange, onClear, onVisibleHook, onClick, fieldKeys, getOutletText, getInputValue, onConfirm, SarPopoutInput, SarPickerPopout };
    return __returned__;
  }
});
</script>
