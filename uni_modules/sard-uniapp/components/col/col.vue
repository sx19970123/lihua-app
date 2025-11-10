<template>
  <view :class="colClass" :style="colStyle">
    <slot></slot>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed, inject } from "vue";
import {
  rowSymbol
} from "../layout/common";
import { classNames, stringifyStyle, createBem } from "../../utils";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number | 'auto' | 'none'} span 列元素宽度，默认值：-。
 * @property {number} offset 列元素偏移距离，默认值：-。
 * @property {number} order 列元素顺序，默认值：-。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "col",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    span: { type: [Number, String], required: false },
    offset: { type: Number, required: false },
    order: { type: Number, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const context = inject(rowSymbol);
    if (!context) {
      throw new Error("Col must be included in Row.");
    }
    const bem = createBem("col");
    const colClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m(props.span, props.span !== void 0),
        bem.m(`offset-${props.offset}`, props.offset !== void 0),
        props.rootClass
      );
    });
    const colStyle = computed(() => {
      const gutter = context.gutter;
      return stringifyStyle(
        props.order !== void 0 ? {
          order: props.order
        } : null,
        context.gap ? {
          paddingLeft: gutter[0] + gutter[1],
          paddingRight: gutter[0] + gutter[1]
        } : null,
        props.rootStyle
      );
    });
    const __returned__ = { props, context, bem, colClass, colStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>