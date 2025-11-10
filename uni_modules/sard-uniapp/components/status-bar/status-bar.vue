<template>
  <view :class="statusBarClass" :style="statusBarStyle">
    <slot></slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  getWindowInfo
} from "../../utils";
import {
  defaultStatusBarProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} height 手动设置状态栏高度，，默认值：-。
 * @property {boolean} reverse 设置宽度而不是高度，默认值：false。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "status-bar",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    height: { type: String, required: false },
    reverse: { type: Boolean, required: false }
  }, defaultStatusBarProps),
  setup(__props, { expose: __expose }) {
    const props = __props;
    const bem = createBem("status-bar");
    const statusBarHeight = computed(() => {
      return props.height || getWindowInfo().statusBarHeight + "px";
    });
    __expose();
    const statusBarClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const statusBarStyle = computed(() => {
      return stringifyStyle(props.rootStyle, {
        [props.reverse ? "width" : "height"]: statusBarHeight.value
      });
    });
    const __returned__ = { props, bem, statusBarHeight, statusBarClass, statusBarStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>