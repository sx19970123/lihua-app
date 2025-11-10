<template>
  <view
    :class="swipeActionClass"
    :style="swipeActionStyle"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
    @mousedown="onMouseDown"
  >
    <view
      :id="contentId"
      :class="bem.e('content')"
      :style="translateStyle"
      @click="onContentClick"
      @mousedown="onContentMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
    >
      <slot></slot>
      <view v-if="$slots.left" :id="leftId" :class="bem.e('left')" @click.stop>
        <slot name="left" :hide="hide"></slot>
      </view>
      <view
        v-if="$slots.right"
        :id="rightId"
        :class="bem.e('right')"
        @click.stop
      >
        <slot name="right" :hide="hide"></slot>
      </view>
    </view>
  </view>
</template>

<script>
import { useSlots as _useSlots, defineComponent as _defineComponent } from "vue";
import { computed, getCurrentInstance, onMounted, ref, watch } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid,
  getBoundingClientRect
} from "../../utils";
import { useMouseDown, useInitialVelocity, useStopMovedClick } from "../../use";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {boolean} disabled 是否禁用滑动，默认值：false。
 * @property {'left' | 'right' | false} visible 控制显隐，默认值：false。
 * @event {(visible: 'left' | 'right' | false) => void} update 操作按钮显隐时触发
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "swipe-action",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    visible: { type: [String, Boolean], required: false }
  },
  emits: ["update:visible"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const slots = _useSlots();
    const emit = __emit;
    const bem = createBem("swipe-action");
    const innerVisible = ref(props.visible || false);
    watch(
      () => props.visible,
      () => {
        if (props.visible !== innerVisible.value) {
          innerVisible.value = props.visible || false;
          setTranslateXByVisible(innerVisible.value);
        }
      }
    );
    const triggerVisible = (visible) => {
      if (innerVisible.value !== visible) {
        innerVisible.value = visible;
        emit("update:visible", visible);
      }
    };
    const hide = () => {
      triggerVisible(false);
      setTranslateXByVisible(false);
    };
    const onContentClick = () => {
      if (!props.disabled && !isStoppedClick.value) {
        hide();
      }
    };
    const {
      isStoppedClick,
      onMouseDown: onContentMouseDown,
      onMouseMove,
      onMouseUp
    } = useStopMovedClick();
    const contentId = uniqid();
    const leftId = uniqid();
    const rightId = uniqid();
    const instance = getCurrentInstance();
    let contentWidth = null;
    let leftWidth = null;
    let rightWidth = null;
    const translateX = ref(0);
    const movable = ref(false);
    let startX = 0;
    let startY = 0;
    let downTranslateX = 0;
    let lockDirection = "";
    let canResolveVisible = false;
    const initVelocity = useInitialVelocity();
    const getWidth = async () => {
      return Promise.all([
        getBoundingClientRect(`#${contentId}`, instance).then((rect) => {
          contentWidth = rect.width;
        }),
        slots.left && getBoundingClientRect(`#${leftId}`, instance).then((rect) => {
          leftWidth = rect.width;
        }),
        slots.right && getBoundingClientRect(`#${rightId}`, instance).then((rect) => {
          rightWidth = rect.width;
        })
      ]);
    };
    const setTranslateXByVisible = (visible) => {
      translateX.value = visible === "left" ? leftWidth || 0 : visible === "right" ? -(rightWidth || 0) : 0;
    };
    onMounted(() => {
      setTimeout(() => {
        if (innerVisible.value) {
          getWidth().then(() => {
            setTranslateXByVisible(innerVisible.value);
          });
        } else {
          getWidth();
        }
      });
    });
    const onTouchStart = async (event) => {
      if (props.disabled || !slots.left && !slots.right) {
        return;
      }
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      initVelocity.onStart({
        x: startX,
        y: startY
      });
      downTranslateX = translateX.value;
      movable.value = true;
      getWidth();
    };
    const onTouchMove = (event) => {
      if (!movable.value || lockDirection && lockDirection !== "x") {
        return;
      }
      const clientX = event.touches[0].clientX;
      const clientY = event.touches[0].clientY;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;
      initVelocity.onMove({
        x: clientX,
        y: clientY
      });
      if (!lockDirection) {
        const isHorizontal = Math.abs(deltaX) >= Math.abs(deltaY);
        lockDirection = isHorizontal ? "x" : "y";
      }
      if (lockDirection === "x") {
        if (contentWidth !== null && (!slots.left || leftWidth !== null) && (!slots.right || rightWidth !== null)) {
          event.preventDefault();
          if (event.stopImmediatePropagation) {
            event.stopImmediatePropagation();
          } else if (event.stopPropagation) {
            event.stopPropagation();
          }
          let nextTranslateX = downTranslateX + deltaX;
          const leftEdge = leftWidth !== null ? leftWidth : 0;
          const rightEdge = rightWidth !== null ? -rightWidth : 0;
          if (nextTranslateX > leftEdge) {
            nextTranslateX = leftEdge;
          }
          if (nextTranslateX < rightEdge) {
            nextTranslateX = rightEdge;
          }
          translateX.value = nextTranslateX;
          canResolveVisible = true;
        }
      }
    };
    const onTouchEnd = () => {
      if (canResolveVisible) {
        const velocity = initVelocity.onEnd();
        const dependsOnSpeed = Math.abs(velocity.x) > 0.2;
        const x = translateX.value;
        let nextVisible = false;
        if (x < 0) {
          if (dependsOnSpeed && velocity.x < 0 || !dependsOnSpeed && Math.abs(x) >= rightWidth / 2) {
            nextVisible = "right";
            translateX.value = -rightWidth;
          } else {
            translateX.value = 0;
          }
        } else if (x > 0) {
          if (dependsOnSpeed && velocity.x > 0 || !dependsOnSpeed && Math.abs(x) >= leftWidth / 2) {
            nextVisible = "left";
            translateX.value = leftWidth;
          } else {
            translateX.value = 0;
          }
        }
        triggerVisible(nextVisible);
      }
      movable.value = false;
      lockDirection = "";
      canResolveVisible = false;
    };
    const onMouseDown = useMouseDown(onTouchStart, onTouchMove, onTouchEnd);
    __expose({
      hide
    });
    const swipeActionClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const swipeActionStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const translateStyle = computed(() => {
      return stringifyStyle({
        transform: `translate3d(${translateX.value}px,0,0)`,
        transition: movable.value ? "none" : `transform 300ms`
      });
    });
    const __returned__ = { props, slots, emit, bem, innerVisible, triggerVisible, hide, onContentClick, isStoppedClick, onContentMouseDown, onMouseMove, onMouseUp, contentId, leftId, rightId, instance, get contentWidth() {
      return contentWidth;
    }, set contentWidth(v) {
      contentWidth = v;
    }, get leftWidth() {
      return leftWidth;
    }, set leftWidth(v) {
      leftWidth = v;
    }, get rightWidth() {
      return rightWidth;
    }, set rightWidth(v) {
      rightWidth = v;
    }, translateX, movable, get startX() {
      return startX;
    }, set startX(v) {
      startX = v;
    }, get startY() {
      return startY;
    }, set startY(v) {
      startY = v;
    }, get downTranslateX() {
      return downTranslateX;
    }, set downTranslateX(v) {
      downTranslateX = v;
    }, get lockDirection() {
      return lockDirection;
    }, set lockDirection(v) {
      lockDirection = v;
    }, get canResolveVisible() {
      return canResolveVisible;
    }, set canResolveVisible(v) {
      canResolveVisible = v;
    }, initVelocity, getWidth, setTranslateXByVisible, onTouchStart, onTouchMove, onTouchEnd, onMouseDown, swipeActionClass, swipeActionStyle, translateStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>