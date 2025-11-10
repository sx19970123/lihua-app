<template>
  <view :class="scrollListClass" :style="scrollListStyle">
    <scroll-view
      scroll-x
      :class="bem.e('scroll-view')"
      :upper-threshold="upperThreshold"
      :lower-threshold="lowerThreshold"
      @scroll="onScroll"
      @scrolltoupper="onScrolltoupper"
      @scrolltolower="onScrolltolower"
    >
      <view :id="contentId" :class="bem.e('content')">
        <slot></slot>
        <sar-resize-sensor initial :threshold="0" @resize="onResize" />
      </view>
    </scroll-view>
    <view
      v-if="!hideScrollbar"
      :class="bem.e('scrollbar')"
      :style="scrollbarStyle"
    >
      <view :class="bem.e('scrollbar-thumb')" :style="thumbStyle"></view>
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, getCurrentInstance, ref } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid,
  getBoundingClientRect,
  debounce
} from "../../utils";
import SarResizeSensor from "../resize-sensor/resize-sensor.vue";
import {
  defaultScrollListProps
} from "./common";
import { useWindowResize } from "../../use";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} scrollbarWidth 滚动条宽度，默认值：-。
 * @property {string} scrollbarBg 滚动条的背景色，默认值：-。
 * @property {string} thumbBg 滑块的的背景色，默认值：-。
 * @property {number} upperThreshold 距左边多远时（单位px），触发 scrolltoupper 事件，默认值：50。
 * @property {number} lowerThreshold 距右边多远时（单位px），触发 scrolltolower 事件，默认值：50。
 * @event {( event: any) => void} scroll 滚动时触发
 * @event {( event: any) => void} scrolltoupper 滚动到左边时触发
 * @event {( event: any) => void} scrolltolower 滚动到右边时触发
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
  __name: "scroll-list",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    scrollbarBg: { type: String, required: false },
    scrollbarWidth: { type: Number, required: false },
    thumbBg: { type: String, required: false },
    thumbWidth: { type: Number, required: false },
    upperThreshold: { type: Number, required: false },
    lowerThreshold: { type: Number, required: false }
  }, defaultScrollListProps),
  emits: ["scroll", "scrolltoupper", "scrolltolower"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("scroll-list");
    const scrollListId = uniqid();
    const contentId = uniqid();
    const instance = getCurrentInstance();
    const scrollLeft = ref(0);
    const scrollWidth = ref(0);
    const clientWidth = ref(0);
    const update = debounce(
      async () => {
        const scrollListRect = await getBoundingClientRect(
          `.${scrollListId}`,
          instance
        );
        clientWidth.value = scrollListRect.width;
        const contentRect = await getBoundingClientRect(`#${contentId}`, instance);
        scrollWidth.value = contentRect.width;
      },
      50,
      {
        leading: false,
        trailing: true
      }
    );
    useWindowResize(update);
    const onResize = () => {
      update();
    };
    const onScroll = (event) => {
      scrollLeft.value = event.detail.scrollLeft;
      scrollWidth.value = event.detail.scrollWidth;
      emit("scroll", event);
    };
    const onScrolltoupper = (event) => {
      emit("scrolltoupper", event);
    };
    const onScrolltolower = (event) => {
      emit("scrolltolower", event);
    };
    __expose({ update });
    const scrollListClass = computed(() => {
      return classNames(bem.b(), scrollListId, props.rootClass);
    });
    const scrollListStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const scrollbarStyle = computed(() => {
      return {
        width: props.scrollbarWidth || "",
        backgroundColor: props.scrollbarBg
      };
    });
    const thumbWidth = computed(() => {
      let width = clientWidth.value / scrollWidth.value;
      if (!Number.isFinite(width)) {
        width = 0;
      }
      return width;
    });
    const hideScrollbar = computed(() => thumbWidth.value >= 1);
    const thumbStyle = computed(() => {
      let left = scrollLeft.value / scrollWidth.value;
      if (!Number.isFinite(left)) {
        left = 0;
      }
      return {
        left: left * 100 + "%",
        width: thumbWidth.value * 100 + "%",
        backgroundColor: props.thumbBg
      };
    });
    const __returned__ = { props, emit, bem, scrollListId, contentId, instance, scrollLeft, scrollWidth, clientWidth, update, onResize, onScroll, onScrolltoupper, onScrolltolower, scrollListClass, scrollListStyle, scrollbarStyle, thumbWidth, hideScrollbar, thumbStyle, SarResizeSensor };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>