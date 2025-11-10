<template>
  <view :class="timelineClass" :style="timelineStyle">
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
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "timeline",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("timeline");
    const timelineClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const timelineStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, bem, timelineClass, timelineStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>