<template>
  <view :class="cellClass" :style="cellStyle">
    <slot></slot>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem, isNullish } from "../../utils";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {boolean | 'left' | 'right'} fixed 固定单元到表格左边或右边，true 表示左边，默认值：-。
 * @property {string} width 设置单元格宽度占比，可以带单位或不带单位，默认值：'1'。
 * @property {boolean} bold 单元格字体加粗，默认值：false。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "table-cell",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    width: { type: String, required: false },
    bold: { type: Boolean, required: false },
    fixed: { type: [Boolean, String], required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("table");
    const cellClass = computed(() => {
      const fixedSide = props.fixed === true ? "left" : props.fixed;
      return classNames(
        bem.e("cell"),
        bem.em("cell", "bold", props.bold),
        bem.em("cell", "fixed-" + fixedSide, props.fixed),
        props.rootClass
      );
    });
    const cellStyle = computed(() => {
      const isFlexGrow = !isNaN(Number(props.width));
      return stringifyStyle(
        {
          width: isNullish(props.width) || isFlexGrow ? void 0 : props.width,
          flex: isNullish(props.width) ? void 0 : isFlexGrow ? props.width : `${parseFloat(props.width)} 0 ${props.width}`
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, bem, cellClass, cellStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>