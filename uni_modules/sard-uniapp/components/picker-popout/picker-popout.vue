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
      <sar-picker
        v-if="already"
        :model-value="popoutValue"
        :columns="columns"
        :option-keys="optionKeys"
        :immediate-change="immediateChange"
        :internal-custom="
          isNumber(internalCustom) ? internalCustom : $slots.custom ? 1 : 0
        "
        @change="onChange"
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
      </sar-picker>
    </template>
  </sar-popout>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import SarPopout from "../popout/popout.vue";
import SarPicker from "../picker/picker.vue";
import {
  defaultPickerPopoutProps
} from "./common";
import { isEmptyArray, isEmptyBinding, isNumber } from "../../utils";
import { defaultOptionKeys, getInitialValue } from "../picker/common";
import { computed } from "vue";
import { useFormPopout } from "../../use";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
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
    SarPopout,
    SarPicker,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "picker-popout",
  props:  _mergeDefaults({
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
    internalCustom: { type: Number, required: false }
  }, defaultPickerPopoutProps()),
  emits: ["update:visible", "update:model-value", "change", "confirm", "before-enter", "enter", "after-enter", "enter-cancelled", "before-leave", "leave", "after-leave", "leave-cancelled", "visible-hook"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const fieldKeys = computed(() => {
      return Object.assign({}, defaultOptionKeys, props.optionKeys);
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
        if (isEmptyBinding(popoutValue.value) || isEmptyArray(popoutValue.value)) {
          const [initialValue, selectedOptions] = getInitialValue(
            props.columns,
            fieldKeys.value
          );
          popoutValue.value = initialValue;
          return [selectedOptions];
        }
      }
    });
    const onEnter = () => {
      if (!isEmptyBinding(innerValue.value) && !isEmptyArray(innerValue.value) && popoutValue.value !== innerValue.value) {
        popoutValue.value = innerValue.value;
      }
    };
    const __returned__ = { props, emit, fieldKeys, innerVisible, innerValue, popoutValue, onChange, onConfirm, onVisibleHook, onEnter, SarPopout, SarPicker, get isNumber() {
      return isNumber;
    } };
    return __returned__;
  }
});
</script>
