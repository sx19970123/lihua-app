<template>
  <sar-popout-input
    v-model="inputValue"
    :placeholder="placeholder"
    :readonly="readonly"
    :disabled="disabled"
    :clearable="clearable"
    :loading="loading"
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
    <sar-cascader-popout
      v-model:visible="innerVisible"
      v-model="innerValue"
      :title="title ?? placeholder"
      :show-confirm="showConfirm"
      :root-class="popoutClass"
      :root-style="popoutStyle"
      :options="options"
      :field-keys="fieldKeys"
      :hint-text="hintText"
      :change-on-select="changeOnSelect"
      :label-render="labelRender"
      :all-levels="allLevels"
      :validate-event="validateEvent"
      :resettable="resettable"
      @select="(option, tabIndex) => $emit('select', option, tabIndex)"
      @change="onChange"
      @visible-hook="onVisibleHook"
      @confirm="onConfirm"
    >
      <template #top="{ tabIndex }">
        <slot name="top" :tab-index="tabIndex"></slot>
      </template>
    </sar-cascader-popout>
  </sar-popout-input>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { watch, computed } from "vue";
import SarPopoutInput from "../popout-input/popout-input.vue";
import SarCascaderPopout from "../cascader-popout/cascader-popout.vue";
import {
  defaultFieldKeys,
  getSelectedOptionsByValue
} from "../cascader/common";
import { isEmptyBinding } from "../../utils";
import { usePopoutInput } from "../../use";
import {
  defaultCascaderInputProps
} from "./common";
/**
 * @property {string} rootClass 弹出式输入框根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 弹出式输入框根元素样式，默认值：-。
 * @property {string | number | (string | number)[]} modelValue 选中项的值，默认值：-。
 * @property {CascaderOption[]} options 可选项数据源，默认值：[]。
 * @property {CascaderFieldKeys} fieldKeys 自定义 `options` 中的字段，默认值：defaultFieldKeys。
 * @property {string} hintText 未选中时的提示文案，默认值：'请选择'。
 * @property {(option: CascaderOption) => string} labelRender 自定义可选项渲染，默认值：-。
 * @property {boolean} changeOnSelect 点击每级选项都会触发变化，默认值：false。
 * @property {boolean} allLevels 是否绑定所有级别的值，而不单单是最后一级，默认值：false。
 * @property {string} popoutClass 弹窗框根元素类名，默认值：-。
 * @property {StyleValue} popoutStyle 弹窗框根元素样式，默认值：-。
 * @property {boolean} visible 是否显示弹出框，默认值：-。
 * @property {string} title 弹出框标题，默认值：-。
 * @property {boolean} showConfirm 是否显示确定按钮，隐藏按钮可用于快捷选择，默认值：true。
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
 * @event {(value: string | number, selectedOptions: CascaderOption[]) => void} change 级联输入组件值改变时触发
 * @event {(option: CascaderOption, tabIndex: number) => void} select 选择级联选择某一项时触发
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
    SarCascaderPopout,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "cascader-input",
  props:  _mergeDefaults({
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
    modelValue: { type: [String, Number, Array], required: false },
    options: { type: Array, required: false },
    fieldKeys: { type: Object, required: false },
    hintText: { type: String, required: false },
    labelRender: { type: Function, required: false },
    changeOnSelect: { type: Boolean, required: false },
    allLevels: { type: Boolean, required: false },
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
  }, defaultCascaderInputProps()),
  emits: ["update:visible", "update:model-value", "change", "select", "confirm", "before-enter", "enter", "after-enter", "enter-cancelled", "before-leave", "leave", "after-leave", "leave-cancelled", "visible-hook"],
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
    } = usePopoutInput(props, emit, {
      onClear(value) {
        emit("update:model-value", value, []);
        emit("change", value, []);
      }
    });
    const fieldkeys = computed(() => {
      return Object.assign(
        {},
        defaultFieldKeys,
        props.fieldKeys
      );
    });
    function getOutletText(options, value, fieldKeys) {
      const selectedOptions = getSelectedOptionsByValue(options, value, fieldKeys);
      if (!selectedOptions) {
        return isEmptyBinding(value) ? "" : String(value);
      }
      const labels = selectedOptions.map((option) => option[fieldKeys.label]);
      return labels.join("/");
    }
    function getInputValue() {
      if (isEmptyBinding(innerValue.value) || !props.options) {
        return "";
      }
      return getOutletText(props.options, innerValue.value, fieldkeys.value);
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
    const __returned__ = { props, emit, innerVisible, innerValue, inputValue, show, onChange, onClear, onVisibleHook, fieldkeys, getOutletText, getInputValue, onConfirm, SarPopoutInput, SarCascaderPopout };
    return __returned__;
  }
});
</script>
