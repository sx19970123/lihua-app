<template>
  <view :class="skeletonBlockClass" :style="skeletonBlockStyle"></view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {boolean} animated 是否开启动画，默认值：false。
 * @property {boolean} round 是否显示为圆角风格，默认值：false。
 * @property {string} width 设置宽度，默认值：-。
 * @property {string} height 设置高度，默认值：-。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "skeleton-block",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    animated: { type: Boolean, required: false },
    round: { type: Boolean, required: false },
    width: { type: String, required: false },
    height: { type: String, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("skeleton");
    const skeletonBlockClass = computed(() => {
      return classNames(
        bem.e("block"),
        bem.m("animated", props.animated),
        bem.m("round", props.round),
        props.rootClass
      );
    });
    const skeletonBlockStyle = computed(() => {
      return stringifyStyle(
        {
          width: props.width,
          height: props.height
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, bem, skeletonBlockClass, skeletonBlockStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>