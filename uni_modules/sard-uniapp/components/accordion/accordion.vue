<template>
  <view :class="accordionClass" :style="accordionStyle">
    <slot></slot>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed, provide, ref, watch, toRef, reactive } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import {
  accoridonContextSymbol
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string | number | (string | number)[]} modelValue 当前展开面板的 `name`，默认值：-。
 * @property {boolean} multiple 是否可同时展开多个面板，默认值：false。
 * @property {boolean} hideBorder 是否隐藏边框，默认值：false。
 * @event {(value: string | number | (string | number)[]) => void} update 切换面板时触发
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "accordion",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    modelValue: { type: [Array, String, Number], required: false },
    multiple: { type: Boolean, required: false },
    hideBorder: { type: Boolean, required: false }
  },
  emits: ["update:model-value"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("accordion");
    const innerValue = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => {
        innerValue.value = props.modelValue || [];
      }
    );
    const toggle = (name) => {
      let value;
      if (props.multiple) {
        value = Array.isArray(innerValue.value) ? innerValue.value : [];
        if (value.includes(name)) {
          value = value.filter((item) => item !== name);
        } else {
          value = value.concat(name);
        }
      } else {
        if (innerValue.value === name) {
          value = void 0;
        } else {
          value = name;
        }
      }
      innerValue.value = value;
      emit("update:model-value", value);
    };
    provide(
      accoridonContextSymbol,
      reactive({
        value: innerValue,
        multiple: toRef(() => props.multiple),
        toggle,
        hideBorder: toRef(() => props.hideBorder)
      })
    );
    const accordionClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("borderless", props.hideBorder),
        props.rootClass
      );
    });
    const accordionStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, innerValue, toggle, accordionClass, accordionStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>