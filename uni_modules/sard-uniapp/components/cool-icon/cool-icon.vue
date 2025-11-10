<template>
  <view :class="coolIconClass" :style="coolIconStyle" @click="onClick">
    <view :class="bgClass" :style="bgStyle">
      <view :class="bem.e('adorns')">
        <view v-for="i in 6" :key="i" :class="bem.e('adorn')"></view>
      </view>
    </view>
    <view :class="bem.e('icon')">
      <slot></slot>
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import {
  defaultCoolIconProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {'circle' | 'square' | 'oval' | 'triangle' | 'flower'} shape 设置外框的形状，默认值：'oval'。
 * @property {string} color 设置图标颜色，默认值：-。
 * @property {string} background 设置外框背景色颜色，默认值：-。
 * @property {string} size 设置外框尺寸，默认值：-。
 * @property {string} iconSize 设置图标尺寸，默认值：-。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "cool-icon",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    shape: { type: String, required: false },
    size: { type: String, required: false },
    iconSize: { type: String, required: false },
    color: { type: String, required: false },
    background: { type: String, required: false }
  }, defaultCoolIconProps),
  emits: ["click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("cool-icon");
    const onClick = (event) => {
      emit("click", event);
    };
    __expose({});
    const coolIconClass = computed(() => {
      return classNames(bem.b(), bem.m(props.shape), props.rootClass);
    });
    const coolIconStyle = computed(() => {
      return stringifyStyle(
        {
          width: props.size,
          height: props.size,
          fontSize: props.iconSize,
          color: props.color
        },
        props.rootStyle
      );
    });
    const bgClass = computed(() => {
      return classNames(bem.e("bg"));
    });
    const bgStyle = computed(() => {
      return stringifyStyle({
        background: props.background
      });
    });
    const __returned__ = { props, emit, bem, onClick, coolIconClass, coolIconStyle, bgClass, bgStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>