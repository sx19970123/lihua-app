<template>
  <scroll-view
    :class="classNames(props.rootClass, scrollViewId)"
    :style="rootStyle"
    :scroll-y="!disabled"
    :scroll-top="scrollTop"
    :upper-threshold="upperThreshold"
    :lower-threshold="lowerThreshold"
    @scroll="onScroll"
    @scrolltoupper="onScrolltoupper"
    @scrolltolower="onScrolltolower"
  >
    <view>
      <slot></slot>
    </view>
  </scroll-view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import {
  getCurrentInstance,
  onMounted,
  provide,
  reactive,
  toRef,
  watch
} from "vue";
import {
  isNullish,
  uniqid,
  getBoundingClientRect,
  classNames
} from "../../utils";
import {
  scrollSpyContextSymbol
} from "./common";
import { useScrollSpy } from "../../use";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string | number} current 当前绑定锚点名称，默认值：-。
 * @property {number} offset 锚点距离顶部的偏移量，默认值：0。
 * @property {number | string} upperThreshold 距顶部/左边多远时（单位 px），触发 scrolltoupper 事件，默认值：50。
 * @property {number | string} lowerThreshold 距底部/右边多远时（单位 px），触发 scrolltolower 事件，默认值：50。
 * @property {boolean} disabled 是否禁用，禁用时无法滚动，默认值：false。
 * @event {(name: number | string) => void} update 当前锚点改变时触发
 * @event {(name: number | string) => void} change 当前锚点改变时触发
 * @event {() => void} scrolltoupper 滚动到顶部时触发
 * @event {() => void} scrolltolower 滚动到底部时触发
 * @event {(event: any) => void} scroll 滚动时触发
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "scroll-spy",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    current: { type: [String, Number], required: false },
    offset: { type: Number, required: false },
    upperThreshold: { type: [Number, String], required: false, default: 50 },
    lowerThreshold: { type: [Number, String], required: false, default: 50 },
    disabled: { type: Boolean, required: false }
  },
  emits: ["update:current", "change", "scrolltoupper", "scrolltolower", "scroll"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const scrollViewId = uniqid();
    const instance = getCurrentInstance();
    const {
      scrollTop,
      innerCurrent,
      anchorRectList,
      register,
      unregister,
      onScroll: onScrollAlias,
      scrollTo,
      update,
      initialize
    } = useScrollSpy(
      reactive({
        startOffset: toRef(() => props.offset),
        defaultCurrent: props.current,
        getSpiedRect() {
          return getBoundingClientRect(`.${scrollViewId}`, instance);
        },
        onChange(name) {
          emit("update:current", name);
          emit("change", name);
        }
      })
    );
    const onScrolltoupper = () => {
      emit("scrolltoupper");
    };
    const onScrolltolower = () => {
      emit("scrolltolower");
    };
    const onScroll = (event) => {
      emit("scroll", event);
      onScrollAlias(event);
    };
    provide(scrollSpyContextSymbol, {
      register,
      unregister
    });
    onMounted(() => {
      initialize();
    });
    watch(
      () => props.current,
      () => {
        if (!isNullish(props.current) && anchorRectList.value.find((item) => item[0] === props.current) && props.current !== innerCurrent.value) {
          innerCurrent.value = props.current;
          scrollTo(props.current);
        }
      }
    );
    __expose({
      scrollTo,
      update
    });
    const __returned__ = { props, emit, scrollViewId, instance, scrollTop, innerCurrent, anchorRectList, register, unregister, onScrollAlias, scrollTo, update, initialize, onScrolltoupper, onScrolltolower, onScroll, get classNames() {
      return classNames;
    } };
    return __returned__;
  }
});
</script>
