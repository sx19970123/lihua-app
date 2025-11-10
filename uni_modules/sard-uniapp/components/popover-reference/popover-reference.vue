<template>
  <view :class="refClass" :style="refStyle" @click="onClick">
    <slot></slot>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed, inject, onMounted, getCurrentInstance } from "vue";
import {
  classNames,
  stringifyStyle,
  getBoundingClientRect,
  uniqid
} from "../../utils";
import {
  popoverContextSymbol
} from "../popover/common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @event {(event: any) => void} click 点击组件时触发
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "popover-reference",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false }
  },
  emits: ["click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const referenceId = uniqid();
    const instance = getCurrentInstance();
    const context = inject(popoverContextSymbol);
    const getRect = () => {
      return getBoundingClientRect(`.${referenceId}`, instance);
    };
    onMounted(() => {
      context?.register({
        getRect
      });
    });
    const onClick = (event) => {
      context?.show();
      emit("click", event);
    };
    const refClass = computed(() => {
      return classNames(props.rootClass, referenceId);
    });
    const refStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, referenceId, instance, context, getRect, onClick, refClass, refStyle };
    return __returned__;
  }
});
</script>
