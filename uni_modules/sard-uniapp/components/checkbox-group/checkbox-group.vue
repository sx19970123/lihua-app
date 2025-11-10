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
        <sar-checkbox
          v-for="option in options"
          :key="getMayPrimitiveOption(option, fieldKeys.value)"
          :value="getMayPrimitiveOption(option, fieldKeys.value)"
          :validate-event="false"
        >
          {{ getMayPrimitiveOption(option, fieldKeys.label) }}
        </sar-checkbox>
      </template>
    </slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { ref, watch, provide, toRef, reactive, computed } from "vue";
import {
  checkboxContextSymbol,
  defaultCheckboxGroupProps,
  defaultOptionKeys
} from "../checkbox/common";
import {
  classNames,
  createBem,
  getMayPrimitiveOption,
  stringifyStyle
} from "../../utils";
import { useFormItemContext } from "../form/common";
import SarCheckbox from "../checkbox/checkbox.vue";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {any[]} modelValue 指定选中的选项，默认值：-。
 * @property {boolean} disabled 禁用状态，默认值：-。
 * @property {boolean} readonly 只读状态，默认值：-。
 * @property {string} size 图标的尺寸，默认值：-。
 * @property {'square' | 'circle'} type 图标类型，默认值：'square'。
 * @property {string} checkedColor 选中时图标的颜色，默认值：-。
 * @property {boolean} validateEvent 是否触发表单验证，默认值：true。
 * @property {CheckboxGroupOption[]} options 自动设置复选框，默认值：-。
 * @property {CheckboxGroupOptionKeys} optionKeys 自定义 options 的 label、value 的字段，默认值：{label: 'label', value: 'value'}。
 * @event {(value: any[]) => void} update 复选框组值改变时触发
 * @event {(value: any[]) => void} change 复选框组值改变时触发
 */
export default  _defineComponent({
  components: {
    SarCheckbox,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "checkbox-group",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    modelValue: { type: Array, required: false },
    disabled: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false },
    size: { type: String, required: false },
    type: { type: String, required: false },
    checkedColor: { type: String, required: false },
    direction: { type: String, required: false },
    validateEvent: { type: Boolean, required: false },
    options: { type: Array, required: false },
    optionKeys: { type: Object, required: false }
  }, defaultCheckboxGroupProps),
  emits: ["click", "update:model-value", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("checkbox-group");
    const formItemContext = useFormItemContext();
    const fieldKeys = computed(() => {
      return Object.assign({}, defaultOptionKeys, props.optionKeys);
    });
    const innerValue = ref(props.modelValue || []);
    watch(
      () => props.modelValue,
      () => {
        innerValue.value = props.modelValue || [];
        if (props.validateEvent) {
          formItemContext?.onChange();
        }
      }
    );
    const toggle = (value) => {
      const nextValue = innerValue.value.includes(value) ? innerValue.value.filter((v) => v !== value) : innerValue.value.concat(value);
      innerValue.value = nextValue;
      emit("update:model-value", nextValue);
      emit("change", nextValue);
    };
    provide(
      checkboxContextSymbol,
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
    }, get getMayPrimitiveOption() {
      return getMayPrimitiveOption;
    }, get stringifyStyle() {
      return stringifyStyle;
    }, SarCheckbox };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>