<template>
  <sar-skeleton-block
    :root-class="skeletonTitleClass"
    :root-style="skeletonTitleStyle"
    :animated="animated"
    :round="round"
    :width="width"
    :height="height"
  />
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import SarSkeletonBlock from "../skeleton-block/skeleton-block.vue";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {boolean} animated 是否开启动画，默认值：false。
 * @property {boolean} round 是否显示为圆角风格，默认值：false。
 * @property {string} width 设置宽度，默认值：-。
 * @property {string} height 设置高度，默认值：-。
 */
export default  _defineComponent({
  components: {
    SarSkeletonBlock,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "skeleton-title",
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
    const skeletonTitleClass = computed(() => {
      return classNames(bem.e("title"), props.rootClass);
    });
    const skeletonTitleStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, bem, skeletonTitleClass, skeletonTitleStyle, SarSkeletonBlock };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>