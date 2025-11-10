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
    <sar-radio-popout
      v-model:visible="innerVisible"
      v-model="innerValue"
      :title="title ?? placeholder"
      :root-class="popoutClass"
      :root-style="popoutStyle"
      :size="size"
      :type="type"
      :checkedColor="checkedColor"
      :direction="direction"
      :options="options"
      :option-keys="optionKeys"
      :validate-event="validateEvent"
      :searchable="searchable"
      :filter-placeholder="filterPlaceholder"
      :resettable="resettable"
      :icon-position="iconPosition"
      @change="onChange"
      @visible-hook="onVisibleHook"
      @confirm="onConfirm"
    />
  </sar-popout-input>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { watch, computed } from "vue";
import SarPopoutInput from "../popout-input/popout-input.vue";
import SarRadioPopout from "../radio-popout/radio-popout.vue";
import { defaultOptionKeys } from "../radio/common";
import {
  defaultRadioInputProps
} from "./common";
import { getMayPrimitiveOption, isEmptyBinding, isNullish } from "../../utils";
import { usePopoutInput } from "../../use";
/**
 * @property {string} rootClass 弹出式输入框根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 弹出式输入框根元素样式，默认值：-。
 * @property {any} modelValue 指定选中的选项，默认值：-。
 * @property {boolean} disabled 禁用状态，默认值：-。
 * @property {boolean} readonly 只读状态，默认值：-。
 * @property {string} size 图标的尺寸，默认值：-。
 * @property {'circle' | 'record'} type 图标类型，默认值：'circle'。
 * @property {string} checkedColor 选中时图标的颜色，默认值：-。
 * @property {'horizontal' | 'vertical'} direction 排列方向，默认值：'vertical'。
 * @property {boolean} validateEvent 是否触发表单验证，默认值：true。
 * @property {RadioGroupOption[]} options 自动设置单选按钮，默认值：-。
 * @property {RadioGroupOptionKeys} optionKeys 自定义 options 的 label、value 的字段，默认值：{label: 'label', value: 'value'}。
 * @property {string} popoutClass 弹窗框根元素类名，默认值：-。
 * @property {StyleValue} popoutStyle 弹窗框根元素样式，默认值：-。
 * @property {boolean} visible 是否显示弹出框，默认值：-。
 * @property {string} title 弹出框标题，默认值：-。
 * @property {boolean} searchable 是否可搜索，默认值：false。
 * @property {string} filterPlaceholder 搜索输入框占位符内容，默认值：-。
 * @property {boolean} resettable 关闭弹出框后，是否可复位弹出框值，默认值：false。
 * @property {'left' | 'right'} iconPosition 可定义单选按钮的位置，默认值：'left'。
 * @property {boolean} clearable 是否显示清空按钮，默认值：false。
 * @property {string} placeholder 输入框占位符内容，默认值：-。
 * @property {() => any} valueOnClear 设置点击清除按钮后的值，默认值：() => undefined。
 * @property {string} arrow 自定义箭头图标名，默认值：'caret-right'。
 * @property {string} arrowFamily 自定义箭头图标字体，默认值：'sari'。
 * @property {InputProps} inputProps 自定义输入框组件属性，默认值：-。
 * @event {(visible: boolean) => void} update 弹出框显隐时触发
 * @event {(value: any | undefined) => void} change 单选输入组件值改变时触发
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
    SarRadioPopout,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "radio-input",
  props:  _mergeDefaults({
    valueOnClear: { type: Function, required: false },
    visible: { type: Boolean, required: false },
    title: { type: String, required: false },
    popoutClass: { type: String, required: false },
    popoutStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    searchable: { type: Boolean, required: false },
    filterPlaceholder: { type: String, required: false },
    resettable: { type: Boolean, required: false },
    iconPosition: { type: String, required: false },
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    modelValue: { type: null, required: false },
    disabled: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false },
    size: { type: String, required: false },
    type: { type: String, required: false },
    checkedColor: { type: String, required: false },
    direction: { type: String, required: false },
    validateEvent: { type: Boolean, required: false },
    options: { type: Array, required: false },
    optionKeys: { type: Object, required: false },
    placeholder: { type: String, required: false },
    clearable: { type: Boolean, required: false },
    loading: { type: Boolean, required: false },
    multiline: { type: Boolean, required: false },
    arrow: { type: String, required: false },
    arrowFamily: { type: String, required: false },
    internalArrow: { type: Number, required: false },
    inputProps: { type: Object, required: false }
  }, defaultRadioInputProps()),
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
    const fieldKeys = computed(() => {
      return Object.assign({}, defaultOptionKeys, props.optionKeys);
    });
    function getOutletText(options, optionKeys, value) {
      const option = options.find(
        (option2) => getMayPrimitiveOption(option2, optionKeys.value) === value
      );
      return isNullish(option) ? "" : getMayPrimitiveOption(option, optionKeys.label);
    }
    function getInputValue() {
      if (isEmptyBinding(innerValue.value)) {
        return "";
      }
      return getOutletText(props.options, fieldKeys.value, innerValue.value);
    }
    watch(
      [innerValue, () => props.options],
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
    const __returned__ = { props, emit, innerVisible, innerValue, inputValue, show, onChange, onClear, onVisibleHook, fieldKeys, getOutletText, getInputValue, onConfirm, SarPopoutInput, SarRadioPopout };
    return __returned__;
  }
});
</script>
