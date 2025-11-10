<template>
  <view :class="gridClass" :style="gridStyle">
    <slot></slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, provide, reactive, toRef } from "vue";
import { splitUnit, classNames, stringifyStyle, createBem } from "../../utils";
import {
  gridSymbol,
  defaultGridProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number} columns 列数，默认值：4。
 * @property {string} gap 格子间距，默认值：0。
 * @property {boolean} bordered 是否显示边框，默认值：false。
 * @property {boolean} square 是否将格子显示为正方形，默认值：false。
 * @property {boolean} clickable 格子是否可点击，默认值：false。
 * @property {boolean} reverse 是否调换图标和文本的位置，默认值：false。
 * @property {'horizontal' | 'vertical'} direction 格子排列方向，默认值：'vertical'。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "grid",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    columns: { type: Number, required: false },
    gap: { type: String, required: false },
    bordered: { type: Boolean, required: false },
    square: { type: Boolean, required: false },
    clickable: { type: Boolean, required: false },
    reverse: { type: Boolean, required: false },
    direction: { type: String, required: false }
  }, defaultGridProps),
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("grid");
    const gutter = computed(() => {
      if (props.gap) {
        const result = splitUnit(props.gap);
        return [result[0] / 2, result[1] || "rpx"];
      }
      return [0, "rpx"];
    });
    provide(
      gridSymbol,
      reactive({
        columns: toRef(() => props.columns),
        gap: toRef(() => props.gap),
        gutter
      })
    );
    const gridClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("bordered", props.bordered && gutter.value[0] <= 0),
        bem.m("surround", props.bordered && gutter.value[0] > 0),
        bem.m("square", props.square),
        bem.m("clickable", props.clickable),
        bem.m(props.direction),
        bem.m("reverse", props.reverse),
        props.rootClass
      );
    });
    const gridStyle = computed(() => {
      return stringifyStyle(
        props.gap ? {
          marginLeft: -gutter.value[0] + gutter.value[1],
          marginRight: -gutter.value[0] + gutter.value[1]
        } : null,
        {
          rowGap: props.gap
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, bem, gutter, gridClass, gridStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>