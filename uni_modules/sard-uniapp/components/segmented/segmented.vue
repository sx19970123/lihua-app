<template>
  <view :class="segmentedClass" :style="segmentedStyle">
    <view :class="groupClass">
      <view :class="pointerClass" :style="pointerStyle"></view>
      <slot>
        <sar-segmented-item
          v-for="(option, i) in convertedOptions"
          :key="i"
          :value="option.value"
          :label="option.label"
          :disabled="option.disabled"
          :icon="option.icon"
          :icon-family="option.iconFamily"
          :icon-size="option.iconSize"
        />
      </slot>
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, provide, reactive, ref, toRef, watch } from "vue";
import { classNames, stringifyStyle, createBem, isPrimitive } from "../../utils";
import {
  defaultSegmentedProps,
  defaultOptionKeys,
  segmentedContextSymbol
} from "./common";
import SarSegmentedItem from "../segmented-item/segmented-item.vue";
import { useFormItemContext } from "../form";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {any} modelValue 绑定值，默认值：-。
 * @property {boolean} disabled 是否禁用，默认值：false。
 * @property {boolean} readonly 是否只读，默认值：false。
 * @property {'small' | 'middle' | 'large'} size 组件大小，默认值：'middle'。
 * @property {'horizontal' | 'vertical'} direction 展示的方向，默认值：'horizontal'。
 * @property {'square' | 'round'} shape 形状，默认值：'square'。
 * @property {SegmentedOption[]} options 选项的数据，默认值：-。
 * @property {SegmentedOptionKeys} optionKeys 自定义 options 的 label、value 的字段，默认值：{label: 'label', value: 'value'}。
 * @property {boolean} validateEvent 是否触发表单验证，默认值：true。
 * @event {(value: any) => void} update 当所选值更改时触发
 * @event {(value: any) => void} change 当所选值更改时触发
 */
export default  _defineComponent({
  components: {
    SarSegmentedItem,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "segmented",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    modelValue: { type: null, required: false },
    disabled: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false },
    size: { type: String, required: false },
    direction: { type: String, required: false },
    shape: { type: String, required: false },
    options: { type: Array, required: false },
    optionKeys: { type: Object, required: false },
    validateEvent: { type: Boolean, required: false }
  }, defaultSegmentedProps),
  emits: ["update:model-value", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("segmented");
    const formItemContext = useFormItemContext();
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
    const fieldKeys = computed(() => {
      return Object.assign({}, defaultOptionKeys, props.optionKeys);
    });
    const convertedOptions = computed(() => {
      return (props.options || []).map((option) => {
        return isPrimitive(option) ? {
          label: option,
          value: option
        } : {
          label: option[fieldKeys.value.label],
          value: option[fieldKeys.value.value],
          disabled: option[fieldKeys.value.disabled],
          icon: option.icon,
          iconFamily: option.iconFamily,
          iconSize: option.iconSize
        };
      });
    });
    const currentIndex = computed(() => {
      return convertedOptions.value.findIndex(
        (option) => option.value === innerValue.value
      );
    });
    const optionsCount = computed(() => convertedOptions.value.length);
    const toggle = (value) => {
      if (value !== innerValue.value) {
        innerValue.value = value;
        emit("update:model-value", value);
        emit("change", value);
      }
    };
    provide(
      segmentedContextSymbol,
      reactive({
        disabled: toRef(() => props.disabled),
        readonly: toRef(() => props.readonly),
        size: toRef(() => props.size),
        shape: toRef(() => props.shape),
        value: innerValue,
        toggle
      })
    );
    __expose({});
    const segmentedClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m(props.size),
        bem.m(props.direction),
        bem.m(props.shape),
        props.rootClass
      );
    });
    const segmentedStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const groupClass = computed(() => {
      return classNames(bem.e("group"));
    });
    const pointerClass = computed(() => {
      return classNames(bem.e("pointer"));
    });
    const pointerStyle = computed(() => {
      const isHorizontal = props.direction === "horizontal";
      return {
        [isHorizontal ? "width" : "height"]: 1 / optionsCount.value * 100 + "%",
        transform: `translate${isHorizontal ? "X" : "Y"}(${currentIndex.value * 100}%)`
      };
    });
    const __returned__ = { props, emit, bem, formItemContext, innerValue, fieldKeys, convertedOptions, currentIndex, optionsCount, toggle, segmentedClass, segmentedStyle, groupClass, pointerClass, pointerStyle, SarSegmentedItem };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>