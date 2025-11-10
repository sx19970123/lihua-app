<template>
  <view :class="pickerItemClass" :style="pickerItemStyle">
    <slot></slot>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "picker-item",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const bem = createBem("picker");
    __expose({});
    const pickerItemClass = computed(() => {
      return classNames(bem.e("item"), props.rootClass);
    });
    const pickerItemStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, bem, pickerItemClass, pickerItemStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>