<template>
  <view
    :class="floatingBubbleClass"
    :style="floatingBubbleStyle"
    @touchstart="onTouchStart"
    @touchmove.stop.prevent="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
    @mousedown="onMouseDown"
    @click="onClick"
  >
    <slot></slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import {
  defaultFloatingBubbleProps
} from "./common";
import { useFloatingBubble } from "./useFloatingBubble";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {'x' | 'y' | 'both' | 'none'} axis 允许拖拽的方向轴，默认值：'y'。
 * @property {'x' | 'y'} magnet 吸附到指定轴最近的一边，默认值：-。
 * @property {number} gapX 气泡与窗口左右两边的最小间距，单位为 px，默认值：24。
 * @property {number} gapY 气泡与窗口上下两边的最小间距，单位为 px，默认值：24。
 * @property {{ x: number; y: number }} offset 控制气泡的位置，默认值：-。
 * @property {boolean} draggable 是否可拖拽，默认值：true。
 * @property {number} navbarHeight 自定义顶部导航栏的高度，默认值：0。
 * @property {number} tabbarHeight 自定义底部标签栏的高度，默认值：0。
 * @event {(event: any) => void} click 点击时触发
 * @event {(offset: { x: number; y: number }) => void} update 因用户拖拽导致位置改变时触发
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "floating-bubble",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    draggable: { type: Boolean, required: false },
    axis: { type: String, required: false },
    magnet: { type: String, required: false },
    gapX: { type: Number, required: false },
    gapY: { type: Number, required: false },
    offset: { type: Object, required: false },
    navbarHeight: { type: Number, required: false },
    tabbarHeight: { type: Number, required: false }
  }, defaultFloatingBubbleProps),
  emits: ["click", "update:offset"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("floating-bubble");
    const {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onMouseDown,
      position,
      initialized,
      animated,
      bubbleId,
      windowTop
    } = useFloatingBubble(props, emit);
    const onClick = (event) => {
      emit("click", event);
    };
    const floatingBubbleClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("animated", animated.value),
        bem.m("initialized", initialized.value),
        props.rootClass,
        bubbleId
      );
    });
    const floatingBubbleStyle = computed(() => {
      const { x, y } = position.value;
      return stringifyStyle(props.rootStyle, {
        top: `${windowTop}px`,
        transform: `translate3d(${x}px, ${y}px, 0)`
      });
    });
    const __returned__ = { props, emit, bem, onTouchStart, onTouchMove, onTouchEnd, onMouseDown, position, initialized, animated, bubbleId, windowTop, onClick, floatingBubbleClass, floatingBubbleStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>