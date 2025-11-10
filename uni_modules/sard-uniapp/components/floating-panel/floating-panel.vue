<template>
  <view
    :class="floatingPanelClass"
    :style="floatingPanelStyle"
    @touchstart.passive="onTouchStart"
    @touchmove.passive="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
    @mousedown="onMouseDown"
  >
    <view :class="bem.e('header')">
      <view :class="bem.e('header-bar')"></view>
    </view>
    <view :class="bem.e('body')">
      <scroll-view
        :scroll-y="canScroll"
        style="height: 100%"
        data-target="scroll-view"
        @touchmove.stop.prevent="onTouchMove"
        @scroll="onScroll"
      >
        <slot></slot>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref, watch } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  getWindowInfo,
  isAlipay
} from "../../utils";
import {
  defaultFloatingPanelProps
} from "./common";
import { useMouseDown } from "../../use";
import { useInitialVelocity } from "../../use/useInitialVelocity";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number} height 当前面板的显示高度，默认值：0。
 * @property {number[]} anchors 设置自定义锚点, 单位 px，默认值：[100, uni.getWindowInfo().windowHeight * 0.6]。
 * @property {number} duration 动画时长，单位毫秒，默认值：300。
 * @property {boolean} contentDraggable 允许拖拽内容容器，默认值：true。
 * @property {boolean} safeAreaInsetBottom 是否开启底部安全区适配，默认值：true。
 * @event {{value: number}} update 面板显示高度改变时触发
 * @event {{value: number}} height-change 面板显示高度改变且结束拖动后触发
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "floating-panel",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    height: { type: Number, required: false },
    anchors: { type: Array, required: false },
    duration: { type: Number, required: false },
    contentDraggable: { type: Boolean, required: false },
    safeAreaInsetBottom: { type: Boolean, required: false }
  }, defaultFloatingPanelProps),
  emits: ["update:height", "height-change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("floating-panel");
    const mergedAnchors = computed(() => {
      const { windowHeight } = getWindowInfo();
      return props.anchors || [100, ~~(windowHeight * 0.6)];
    });
    let prevY = 0;
    let offsetY = ref(0);
    const isDown = ref(false);
    let target = "scroll";
    watch(
      mergedAnchors,
      () => {
        offsetY.value = mergedAnchors.value[0];
      },
      {
        immediate: true
      }
    );
    watch(
      () => props.height,
      () => {
        if (props.height) {
          offsetY.value = props.height;
        }
      },
      {
        immediate: true
      }
    );
    const triggerChange = (value, touchEnd) => {
      if (offsetY.value !== value) {
        offsetY.value = value;
        emit("update:height", offsetY.value);
        if (touchEnd) {
          emit("height-change", offsetY.value);
        }
      }
    };
    const canScroll = ref(false);
    let scrollTop = 0;
    let prevScrollTop = 0;
    let targetLocked = false;
    const onScroll = (event) => {
      scrollTop = event.detail.scrollTop;
    };
    const initVelocity = useInitialVelocity();
    const onTouchStart = (event) => {
      isDown.value = true;
      prevY = event.touches[0].clientY;
      prevScrollTop = scrollTop;
      canScroll.value = offsetY.value > mergedAnchors.value[0];
      initVelocity.onStart({
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      });
    };
    const onTouchMove = (event) => {
      const currentTarget = event.currentTarget;
      if (currentTarget.dataset?.target === "scroll-view") {
        if (!props.contentDraggable || isAlipay) {
          return;
        }
      }
      const currentY = event.touches[0].clientY;
      let deltaY = prevY - currentY;
      prevY = currentY;
      if (!targetLocked) {
        targetLocked = true;
        if (prevScrollTop === scrollTop) {
          target = "panel";
          canScroll.value = false;
        } else {
          target = "scroll";
          canScroll.value = true;
        }
        prevScrollTop = scrollTop;
      }
      if (target === "panel") {
        const anchors = mergedAnchors.value;
        if (offsetY.value > anchors[anchors.length - 1] || offsetY.value < anchors[0]) {
          deltaY /= 4;
        }
        triggerChange(offsetY.value + deltaY);
      }
      initVelocity.onMove({
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      });
    };
    function getCorrectOffset(direction) {
      const anchors = mergedAnchors.value;
      const min = anchors[0];
      const max = anchors[anchors.length - 1];
      const current = offsetY.value;
      if (current <= min) {
        return min;
      } else if (current >= max) {
        return max;
      }
      for (let i = 1; i < anchors.length; i++) {
        const below = anchors[i - 1];
        const above = anchors[i];
        if (current >= below && current <= above) {
          if (direction) {
            return direction === "up" ? above : below;
          } else {
            return above - current < current - below ? above : below;
          }
        }
      }
      return 0;
    }
    const onTouchEnd = () => {
      if (target === "panel") {
        const velocity = initVelocity.onEnd();
        let value = 0;
        if (Math.abs(velocity.y) > 0.4) {
          value = getCorrectOffset(velocity.y > 0 ? "down" : "up");
        } else {
          value = getCorrectOffset();
        }
        triggerChange(value, true);
      }
      target = "scroll";
      canScroll.value = true;
      targetLocked = false;
      isDown.value = false;
    };
    const onMouseDown = useMouseDown(onTouchStart, onTouchMove, onTouchEnd);
    const floatingPanelClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("safe", props.safeAreaInsetBottom),
        props.rootClass
      );
    });
    const floatingPanelStyle = computed(() => {
      return stringifyStyle(
        {
          transform: `translate3d(0, calc(100% - ${offsetY.value}px), 0)`,
          height: `${mergedAnchors.value[mergedAnchors.value.length - 1]}px`,
          transition: isDown.value ? "none" : `transform ${props.duration}ms cubic-bezier(0.18, 0.89, 0.32, 1.28)`
        },
        props.rootStyle
      );
    });
    __expose({});
    const __returned__ = { props, emit, bem, mergedAnchors, get prevY() {
      return prevY;
    }, set prevY(v) {
      prevY = v;
    }, get offsetY() {
      return offsetY;
    }, set offsetY(v) {
      offsetY = v;
    }, isDown, get target() {
      return target;
    }, set target(v) {
      target = v;
    }, triggerChange, canScroll, get scrollTop() {
      return scrollTop;
    }, set scrollTop(v) {
      scrollTop = v;
    }, get prevScrollTop() {
      return prevScrollTop;
    }, set prevScrollTop(v) {
      prevScrollTop = v;
    }, get targetLocked() {
      return targetLocked;
    }, set targetLocked(v) {
      targetLocked = v;
    }, onScroll, initVelocity, onTouchStart, onTouchMove, getCorrectOffset, onTouchEnd, onMouseDown, floatingPanelClass, floatingPanelStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>