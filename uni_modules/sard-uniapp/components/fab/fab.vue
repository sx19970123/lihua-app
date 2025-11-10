<template>
  <sar-overlay
    :visible="visible"
    :z-index="zIndex"
    background="var(--sar-fab-mask)"
    @click="onOverlayClick"
  />

  <view
    :class="fabClass"
    :style="fabStyle"
    @touchstart="onTouchStart"
    @touchmove.stop.prevent="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
    @mousedown="onMouseDown"
  >
    <sar-fab-item
      is-entry
      :color="color"
      :background="background"
      @click="onItemEntryClick"
    >
      <slot :visible="visible">
        <sar-icon :family="iconFamily || 'sari'" :name="entryIcon" />
      </slot>
    </sar-fab-item>

    <view
      :class="contentClass"
      :style="contentStyle"
      @transitionend="onTransitionEnd"
    >
      <slot name="list" :on-item-click="onItemClick">
        <sar-fab-item
          v-for="(item, index) in itemList"
          :key="index"
          :index="index"
          :name="item.name"
          :color="item.color"
          :background="item.background"
          :icon="item.icon"
          :icon-family="item.iconFamily"
          :item="item"
        />
      </slot>
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, provide, reactive, ref, toRef } from "vue";
import { classNames, stringifyStyle, createBem, isNullish } from "../../utils";
import {
  defaultFabProps,
  fabContextSymbol
} from "./common";
import { useTransition, useZIndex } from "../../use";
import SarIcon from "../icon/icon.vue";
import SarOverlay from "../overlay/overlay.vue";
import { useFloatingBubble } from "../floating-bubble/useFloatingBubble";
import SarFabItem from "../fab-item/fab-item.vue";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} top 设置距离窗口顶部的距离，优先级比 `bottom` 高，默认值：-。
 * @property {string} right 设置距离窗口右边的距离，默认值：-。
 * @property {string} bottom 设置距离窗口底部的距离，默认值：-。
 * @property {string} left 设置距离窗口左边的距离，优先级比 `right` 高，默认值：-。
 * @property {string} color 设置按钮图标的颜色，默认值：-。
 * @property {string} background 设置按钮的背景色，默认值：-。
 * @property {string} icon 设置入口按钮的图标，默认值：-。
 * @property {string} visibleIcon 设置弹出扩展按钮时的入口按钮的图标，默认值：-。
 * @property {string} iconFamily 设置入口按钮的图标族，默认值：-。
 * @property {FabItem[]} itemList 设置扩展按钮，默认值：[]。
 * @property {boolean} hideName 是否隐藏按钮名称，默认值：false。
 * @property {boolean} overlayClosable 点击遮罩是否隐藏扩展按钮，默认值：false。
 * @property {number} duration 扩展按钮显隐动画时长，单位 ms，默认值：150。
 * @property {boolean} draggable 是否可拖拽，默认值：false。
 * @property {'x' | 'y' | 'both' | 'none'} axis 允许拖拽的方向轴，默认值：'y'。
 * @property {'x' | 'y'} magnet 吸附到指定轴最近的一边，在拖拽时使用，默认值：-。
 * @property {number} gapX 悬浮按钮与窗口左右两边的最小间距，单位为 px，在拖拽时使用，默认值：24。
 * @property {number} gapY 悬浮按钮与窗口上下两边的最小间距，单位为 px，在拖拽时使用，默认值：24。
 * @property {{ x: number; y: number }} offset 控制悬浮按钮的位置，在拖拽时使用，默认值：-。
 * @property {number} navbarHeight 自定义顶部导航栏的高度，在拖拽时使用，默认值：0。
 * @property {number} tabbarHeight 自定义底部标签栏的高度，在拖拽时使用，默认值：0。
 * @event {(event: any) => void} click 点击入口按钮时触发
 * @event {(item: FabItem, index: number) => void} select 点击扩展按钮时触发
 * @event {(offset: { x: number; y: number }) => void} update 因用户拖拽导致位置改变时触发
 */
export default  _defineComponent({
  components: {
    SarIcon,
    SarOverlay,
    SarFabItem,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "fab",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    top: { type: String, required: false },
    right: { type: String, required: false },
    bottom: { type: String, required: false },
    left: { type: String, required: false },
    color: { type: String, required: false },
    background: { type: String, required: false },
    icon: { type: String, required: false },
    visibleIcon: { type: String, required: false },
    iconFamily: { type: String, required: false },
    itemList: { type: Array, required: false },
    hideName: { type: Boolean, required: false },
    overlayClosable: { type: Boolean, required: false },
    duration: { type: Number, required: false },
    draggable: { type: Boolean, required: false },
    axis: { type: String, required: false },
    magnet: { type: String, required: false },
    gapX: { type: Number, required: false },
    gapY: { type: Number, required: false },
    offset: { type: Object, required: false },
    navbarHeight: { type: Number, required: false },
    tabbarHeight: { type: Number, required: false }
  }, defaultFabProps()),
  emits: ["click", "select", "update:offset"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("fab");
    const visible = ref(false);
    const [zIndex, increaseZIndex] = useZIndex();
    const { realVisible, transitionClass, onTransitionEnd } = useTransition(
      reactive({
        visible,
        duration: toRef(() => props.duration),
        prefix: bem.m("zoom-")
      })
    );
    const entryIcon = computed(() => {
      return visible.value ? props.visibleIcon || "close" : props.icon || "plus";
    });
    const onItemEntryClick = (event) => {
      if (stopBubbling.value) return;
      visible.value = !visible.value;
      if (visible.value) {
        increaseZIndex();
      }
      emit("click", event);
    };
    const onItemClick = (item, index) => {
      visible.value = false;
      emit("select", item, index);
    };
    const onOverlayClick = () => {
      if (props.overlayClosable) {
        visible.value = false;
      }
    };
    const {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onMouseDown,
      position,
      initialized,
      animated,
      bubbleId,
      stopBubbling,
      windowWidth,
      windowHeight,
      windowTop
    } = useFloatingBubble(props, emit, {
      disabled: visible
    });
    const isTop = computed(() => {
      return props.draggable ? position.value.y > windowHeight / 2 ? false : true : !isNullish(props.top);
    });
    const isLeft = computed(() => {
      return props.draggable ? position.value.x > windowWidth / 2 ? false : true : !isNullish(props.left);
    });
    provide(
      fabContextSymbol,
      reactive({
        hideName: toRef(() => props.hideName),
        isLeft,
        visible,
        onItemClick
      })
    );
    const fabClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m(isTop.value ? "top" : "bottom"),
        bem.m(isLeft.value ? "left" : "right"),
        bem.m("animated", animated.value),
        bem.m("initialized", initialized.value),
        bem.m("draggable", props.draggable),
        props.rootClass,
        bubbleId
      );
    });
    const fabStyle = computed(() => {
      return stringifyStyle(props.rootStyle, {
        zIndex: visible.value ? zIndex.value : null,
        ...props.draggable ? {
          top: `${windowTop}px`,
          transform: `translate3d(${position.value.x}px, ${position.value.y}px, 0)`
        } : {
          top: props.top,
          left: props.left,
          right: isLeft.value ? "auto" : props.right,
          bottom: isTop.value ? "auto" : props.bottom
        }
      });
    });
    const contentClass = computed(() => {
      return classNames(bem.e("content"), transitionClass.value);
    });
    const contentStyle = computed(() => {
      return stringifyStyle({
        display: realVisible.value ? "flex" : "none",
        transitionDuration: props.duration + "ms",
        transformOrigin: `${isTop.value ? "top" : "bottom"} ${isLeft.value ? "left" : "right"}`
      });
    });
    const __returned__ = { props, emit, bem, visible, zIndex, increaseZIndex, realVisible, transitionClass, onTransitionEnd, entryIcon, onItemEntryClick, onItemClick, onOverlayClick, onTouchStart, onTouchMove, onTouchEnd, onMouseDown, position, initialized, animated, bubbleId, stopBubbling, windowWidth, windowHeight, windowTop, isTop, isLeft, fabClass, fabStyle, contentClass, contentStyle, SarIcon, SarOverlay, SarFabItem };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>