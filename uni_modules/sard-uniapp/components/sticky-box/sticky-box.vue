<template>
  <view :class="stickyBoxClass" :style="stickyBoxStyle">
    <view :class="observeClass"></view>
    <slot></slot>
    <sar-resize-sensor initial :threshold="0" @resize="handleResize" />
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed, getCurrentInstance, provide } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid
} from "../../utils";
import {
  stickyContextSymbol
} from "./common";
import SarResizeSensor from "../resize-sensor/resize-sensor.vue";
export default  _defineComponent({
  components: {
    SarResizeSensor,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "sticky-box",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const bem = createBem("sticky-box");
    const boxId = uniqid();
    const resizeHandlers = [];
    const onResize = (handler) => {
      const index = resizeHandlers.indexOf(handler);
      if (index === -1) {
        resizeHandlers.push(handler);
      }
    };
    const offResize = (handler) => {
      const index = resizeHandlers.indexOf(handler);
      if (index !== -1) {
        resizeHandlers.splice(index, 1);
      }
    };
    const handleResize = (res) => {
      resizeHandlers.forEach((handler) => handler(res));
    };
    const instance = getCurrentInstance();
    provide(stickyContextSymbol, {
      boxId,
      onResize,
      offResize,
      instance
    });
    __expose({});
    const stickyBoxClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const stickyBoxStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const observeClass = computed(() => {
      return classNames(bem.e("observe"), boxId);
    });
    const __returned__ = { props, bem, boxId, resizeHandlers, onResize, offResize, handleResize, instance, stickyBoxClass, stickyBoxStyle, observeClass, SarResizeSensor };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>