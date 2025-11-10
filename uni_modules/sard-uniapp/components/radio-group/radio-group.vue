<template>
  <view
    :class="classNames(bem.b(), bem.m(direction), rootClass)"
    :style="stringifyStyle(rootStyle)"
  >
    <slot
      v-if="$slots.custom"
      name="custom"
      :toggle="toggle"
      :value="innerValue"
    ></slot>
    <slot v-else>
      <template v-if="options">
        <sar-radio
          v-for="option in options"
          :key="getMayPrimitiveOption(option, fieldKeys.value)"
          :value="getMayPrimitiveOption(option, fieldKeys.value)"
          :validate-event="false"
        >
          {{ getMayPrimitiveOption(option, fieldKeys.label) }}
        </sar-radio>
      </template>
    </slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { ref, watch, provide, toRef, reactive, computed } from "vue";
import {
  radioContextSymbol,
  defaultRadioGroupProps,
  defaultOptionKeys
} from "../radio/common";
import {
  classNames,
  stringifyStyle,
  createBem,
  getMayPrimitiveOption
} from "../../utils";
import { useFormItemContext } from "../form/common";
import SarRadio from "../radio/radio.vue";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
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
 * @event {(value: any) => void} update 单选按钮组值改变时触发
 * @event {(value: any) => void} change 单选按钮组值改变时触发
 */
export default  _defineComponent({
  components: {
    SarRadio,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "radio-group",
  props:  _mergeDefaults({
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
    optionKeys: { type: Object, required: false }
  }, defaultRadioGroupProps),
  emits: ["update:model-value", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("radio-group");
    const formItemContext = useFormItemContext();
    const fieldKeys = computed(() => {
      return Object.assign({}, defaultOptionKeys, props.optionKeys);
    });
    const innerValue = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => {
        innerValue.value = props.modelValue;
        if (props.validateEvent) {
          formItemContext?.onChange();
        }
      }
    );
    const toggle = (value) => {
      if (value !== innerValue.value) {
        innerValue.value = value;
        emit("update:model-value", value);
        emit("change", value);
      }
    };
    provide(
      radioContextSymbol,
      reactive({
        disabled: toRef(() => props.disabled),
        readonly: toRef(() => props.readonly),
        size: toRef(() => props.size),
        type: toRef(() => props.type),
        checkedColor: toRef(() => props.checkedColor),
        value: innerValue,
        toggle
      })
    );
    const __returned__ = { props, emit, bem, formItemContext, fieldKeys, innerValue, toggle, get classNames() {
      return classNames;
    }, get stringifyStyle() {
      return stringifyStyle;
    }, get getMayPrimitiveOption() {
      return getMayPrimitiveOption;
    }, SarRadio };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>