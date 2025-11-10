<template>
  <view :class="countDownClass" :style="countDownStyle">
    <slot :time="currentTime">
      {{ formatTime(format, currentTime) }}
    </slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  getCurrentTime,
  formatTime,
  defaultCountDownProps
} from "./common";
import { classNames, stringifyStyle, createBem } from "../../utils";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number} time 倒计时总时长，单位毫秒，默认值：0。
 * @property {boolean} autoStart 是否自动开始倒计时，默认值：true。
 * @property {string} format 时间格式，默认值：'HH:mm:ss'。
 * @property {boolean} millisecond 是否开启毫秒级别渲染，默认值：false。
 * @event {(time: CountDownCurrentTime) => void} change 倒计时变化时触发
 * @event {() => void} finish 倒计时结束时触发
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "count-down",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    time: { type: Number, required: false },
    autoStart: { type: Boolean, required: false },
    format: { type: String, required: false },
    millisecond: { type: Boolean, required: false }
  }, defaultCountDownProps),
  emits: ["change", "finish"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("count-down");
    const remainTime = ref(props.time);
    let endTime = 0;
    let timer = null;
    let paused = true;
    const tick = () => {
      const now = Date.now();
      remainTime.value = Math.max(endTime - now, 0);
      if (remainTime.value === 0) {
        pause();
        emit("finish");
        return;
      }
      timer = setTimeout(() => {
        tick();
      }, 30);
    };
    const start = () => {
      if (!paused) {
        return;
      }
      paused = false;
      endTime = Date.now() + remainTime.value;
      tick();
    };
    const pause = () => {
      if (paused) {
        return;
      }
      clearTimeout(timer);
      timer = null;
      paused = true;
    };
    const reset = () => {
      pause();
      remainTime.value = props.time;
    };
    const precisionTime = computed(() => {
      if (props.millisecond) {
        return remainTime.value;
      }
      return Math.floor(remainTime.value / 1e3) * 1e3;
    });
    const currentTime = ref(
      getCurrentTime(precisionTime.value)
    );
    watch(precisionTime, () => {
      currentTime.value = getCurrentTime(precisionTime.value);
      emit("change", currentTime.value);
    });
    __expose({
      start,
      pause,
      reset
    });
    onMounted(() => {
      if (props.autoStart) {
        start();
      }
    });
    onBeforeUnmount(() => {
      pause();
    });
    const countDownClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const countDownStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, remainTime, get endTime() {
      return endTime;
    }, set endTime(v) {
      endTime = v;
    }, get timer() {
      return timer;
    }, set timer(v) {
      timer = v;
    }, get paused() {
      return paused;
    }, set paused(v) {
      paused = v;
    }, tick, start, pause, reset, precisionTime, currentTime, countDownClass, countDownStyle, get formatTime() {
      return formatTime;
    } };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>