<template>
  <view :class="resizeClass" :style="resizeStyle">
    <scroll-view
      :class="bem.e('scroll-view')"
      scroll-x
      scroll-y
      :scroll-left="scrollValue"
      :scroll-top="scrollValue"
      @scroll="onDebouncedScroll"
    >
      <view :class="bem.e('increase')"></view>
    </scroll-view>
    <scroll-view
      :class="bem.e('scroll-view')"
      scroll-x
      scroll-y
      :scroll-left="scrollValue"
      :scroll-top="scrollValue"
      @scroll="onDebouncedScroll"
    >
      <view :class="bem.e('decrease')"></view>
    </scroll-view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  ref,
  watch
} from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid,
  getBoundingClientRect,
  debounce
} from "../../utils";
import {
  defaultResizeSensorProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {boolean} initial 是否在初始化时触发 `resize` 事件，默认值：false。
 * @property {number} threshold 触发 `resize` 事件的阈值，单位毫秒，默认值：150。
 * @event {(value: NodeRect) => void} resize 在元素宽或高发生变化时触发
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "resize-sensor",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    initial: { type: Boolean, required: false },
    threshold: { type: Number, required: false }
  }, defaultResizeSensorProps),
  emits: ["resize"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("resize-sensor");
    const instance = getCurrentInstance();
    const resizeId = uniqid();
    const bounding = ref({
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      height: 0,
      width: 0
    });
    let firstTime = true;
    watch(bounding, () => {
      if (!firstTime || props.initial) {
        emit("resize", { ...bounding.value });
      }
      firstTime = false;
    });
    const scrollValue = ref(0);
    let count = 0;
    const reset = () => {
      scrollValue.value = 1e5 + ++count;
    };
    const debouncedUpdate = debounce(
      async () => {
        const rect = await getBoundingClientRect(`.${resizeId}`, instance);
        bounding.value = {
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
          height: rect.height,
          width: rect.width
        };
      },
      props.threshold,
      {
        maxWait: 0,
        leading: true,
        trailing: true
      }
    );
    const onDebouncedScroll = debounce(
      () => {
        reset();
        debouncedUpdate();
      },
      15,
      {
        maxWait: 0,
        leading: true,
        trailing: false
      }
    );
    onMounted(() => {
      nextTick(reset);
    });
    __expose({});
    const resizeClass = computed(() => {
      return classNames(bem.b(), resizeId, props.rootClass);
    });
    const resizeStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, instance, resizeId, bounding, get firstTime() {
      return firstTime;
    }, set firstTime(v) {
      firstTime = v;
    }, scrollValue, get count() {
      return count;
    }, set count(v) {
      count = v;
    }, reset, debouncedUpdate, onDebouncedScroll, resizeClass, resizeStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>