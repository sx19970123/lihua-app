<template>
  <view
    :class="dndHandleClass"
    :style="dndHandleStyle"
    @touchstart.stop.prevent="onDragTouchStart"
    @touchmove.stop.prevent="onDragTouchMove"
    @touchend="onDragTouchEnd"
    @touchcancel="onDragTouchEnd"
    @mousedown.stop="onDragMouseDown"
  >
    <slot></slot>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed, inject, ref } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import { useMouseDown, useSimulatedPress } from "../../use";
import { dndItemContextKey } from "../dnd-item/common";
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "dnd-handle",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const bem = createBem("dnd-handle");
    const itemContext = inject(dndItemContextKey);
    if (!itemContext) {
      throw new Error("DndHandle must be included in DndItem.");
    }
    const dragging = ref(false);
    const onDragTouchStart = (event) => {
      itemContext.immediateStart();
      onDragSimulatedPressTouchStart(event);
    };
    const onDragTouchMove = (event) => {
      onDragSimulatedPressTouchMove(event);
    };
    const onDragTouchEnd = () => {
      dragging.value = false;
      onDragSimulatedPressTouchEnd();
    };
    const [
      onDragSimulatedPressTouchStart,
      onDragSimulatedPressTouchMove,
      onDragSimulatedPressTouchEnd
    ] = useSimulatedPress({
      start: () => {
        dragging.value = true;
        itemContext.start();
      },
      move: (_, { delta }) => {
        itemContext.move(delta.y);
      },
      end: () => {
        itemContext.end();
      },
      duration: 150
    });
    const onDragMouseDown = useMouseDown(
      onDragTouchStart,
      onDragTouchMove,
      onDragTouchEnd
    );
    __expose({});
    const dndHandleClass = computed(() => {
      return classNames(bem.b(), bem.m("dragging", dragging), props.rootClass);
    });
    const dndHandleStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, bem, itemContext, dragging, onDragTouchStart, onDragTouchMove, onDragTouchEnd, onDragSimulatedPressTouchStart, onDragSimulatedPressTouchMove, onDragSimulatedPressTouchEnd, onDragMouseDown, dndHandleClass, dndHandleStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>