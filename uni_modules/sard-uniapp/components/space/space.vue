<template>
  <view :class="spaceClass" :style="spaceStyle">
    <slot></slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import {
  defaultSpaceProps,
  spaceMapAlign,
  spaceMapJustify,
  spaceSizes
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {'vertical' | 'horizontal'} direction 排列的方向，默认值：'horizontal'。
 * @property {'small' | 'middle' | 'large' | string} size 间隔大小，默认值：'middle'。
 * @property {'start' | 'end' | 'center' | 'baseline'} align 垂直排布方式，默认值：-。
 * @property {'start' | 'end' | 'center' | 'between'| 'around' | 'evenly'} justify 水平排布方式，默认值：-。
 * @property {boolean} wrap 设置是否自动折行，默认值：false。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "space",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    direction: { type: String, required: false },
    size: { type: [String, Object], required: false },
    align: { type: [String, Object], required: false },
    justify: { type: [String, Object], required: false },
    wrap: { type: Boolean, required: false }
  }, defaultSpaceProps),
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("space");
    const presetSize = computed(() => {
      return spaceSizes.includes(props.size);
    });
    const spaceClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m(props.direction),
        bem.m(props.size, presetSize.value),
        bem.m("wrap", props.wrap),
        props.rootClass
      );
    });
    const spaceStyle = computed(() => {
      return stringifyStyle(
        {
          gap: presetSize.value ? null : props.size,
          alignItems: (props.align && spaceMapAlign[props.align]) ?? props.align,
          justifyContent: (props.justify && spaceMapJustify[props.justify]) ?? props.justify
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, bem, presetSize, spaceClass, spaceStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>