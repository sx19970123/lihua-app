<template>
  <view :class="marqueeClass" :style="marqueeStyle">
    <view :id="wrapperId" :class="bem.e('wrapper')" :style="wrapperStyle">
      <slot></slot>
      <sar-resize-sensor @resize="onResize" />
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, getCurrentInstance, onMounted, ref } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid,
  getBoundingClientRect
} from "../../utils";
import SarResizeSensor from "../resize-sensor/resize-sensor.vue";
import {
  defaultMarqueeProps
} from "./common";
import { useTimeout } from "../../use";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {'vertical' | 'horizontal'} direction 动画滚动方向，默认值：'vertical'。
 * @property {number} speed 滚动速率 (px/s)，默认值：50。
 * @property {number} delay 挂载后，延迟动画时间（单位 ms），避免进入页面时卡顿，默认值：1000。
 */
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
  __name: "marquee",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    direction: { type: String, required: false },
    delay: { type: Number, required: false },
    speed: { type: Number, required: false }
  }, defaultMarqueeProps),
  setup(__props, { expose: __expose }) {
    const props = __props;
    const bem = createBem("marquee");
    const instance = getCurrentInstance();
    const wrapperId = uniqid();
    const duration = ref(0);
    const update = async () => {
      const { width, height } = await getBoundingClientRect(
        `#${wrapperId}`,
        instance
      );
      const size = props.direction === "vertical" ? height : width;
      duration.value = size / props.speed * 1e3;
    };
    const { start: updateLater } = useTimeout(
      () => {
        update();
      },
      () => props.delay
    );
    onMounted(() => {
      updateLater();
    });
    const onResize = () => {
      update();
    };
    __expose({
      update
    });
    const marqueeClass = computed(() => {
      return classNames(bem.b(), bem.m(props.direction), props.rootClass);
    });
    const marqueeStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const wrapperStyle = computed(() => {
      return stringifyStyle({
        animationDuration: `${duration.value}ms`,
        animationPlayState: duration.value ? "running" : "paused"
      });
    });
    const __returned__ = { props, bem, instance, wrapperId, duration, update, updateLater, onResize, marqueeClass, marqueeStyle, wrapperStyle, SarResizeSensor };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>