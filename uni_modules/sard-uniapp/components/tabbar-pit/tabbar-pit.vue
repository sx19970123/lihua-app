<template>
  <view :class="tabbarPitClass" :style="tabbarPitStyle">
    <slot></slot>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {boolean} safeAreaInsetBottom 是否开启底部安全区适配，默认值：false。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "tabbar-pit",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    safeAreaInsetBottom: { type: Boolean, required: false }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const bem = createBem("tabbar-pit");
    __expose({});
    const tabbarPitClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("safe", props.safeAreaInsetBottom),
        props.rootClass
      );
    });
    const tabbarPitStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, bem, tabbarPitClass, tabbarPitStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>