<template>
  <view :class="rowClass" :style="rowStyle">
    <slot></slot>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed, provide, reactive, toRef } from "vue";
import { splitUnit, classNames, stringifyStyle, createBem } from "../../utils";
import {
  rowSymbol,
  mapJustify,
  mapAlign
} from "../layout/common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} gap 列间距，默认值：-。
 * @property {'start' | 'center' | 'end' | 'around' | 'between' | 'evenly'} justify 水平对齐方式，默认值：-。
 * @property {'start' | 'center' | 'end' | 'stretch'} align 垂直对齐方式，默认值：-。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "row",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    gap: { type: [Number, String], required: false },
    justify: { type: String, required: false },
    align: { type: String, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("row");
    const gutter = computed(() => {
      if (props.gap) {
        const result = splitUnit(props.gap);
        return [result[0] / 2, result[1] || "rpx"];
      }
      return [0, "rpx"];
    });
    provide(
      rowSymbol,
      reactive({
        gap: toRef(() => props.gap),
        gutter
      })
    );
    const rowStyle = computed(() => {
      return stringifyStyle(
        {
          justifyContent: props.justify && mapJustify[props.justify],
          alignItems: props.align && mapAlign[props.align]
        },
        props.gap ? {
          marginLeft: -gutter.value[0] + gutter.value[1],
          marginRight: -gutter.value[0] + gutter.value[1]
        } : null,
        props.rootStyle
      );
    });
    const rowClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const __returned__ = { props, bem, gutter, rowStyle, rowClass };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>