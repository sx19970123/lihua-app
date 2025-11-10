<template>
  <view :class="classNames(rootClass, anchorId)" :style="rootStyle">
    <slot></slot>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { inject, onBeforeMount, getCurrentInstance } from "vue";
import { classNames, getBoundingClientRect, uniqid } from "../../utils";
import {
  scrollSpyContextSymbol
} from "../scroll-spy/common";
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "scroll-spy-anchor",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    name: { type: [String, Number], required: true }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const context = inject(
      scrollSpyContextSymbol
    );
    if (!context) {
      throw new Error("ScrollSpyAnchor must be included in ScrollSpy.");
    }
    const anchorId = uniqid();
    const instance = getCurrentInstance();
    const getRect = () => {
      return getBoundingClientRect(`.${anchorId}`, instance);
    };
    onBeforeMount(() => {
      context.register(props.name, getRect);
    });
    const __returned__ = { props, context, anchorId, instance, getRect, get classNames() {
      return classNames;
    } };
    return __returned__;
  }
});
</script>
