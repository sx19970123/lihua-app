<template>
  <view :class="dndClass" :style="dndStyle">
    <slot :list="dndList"></slot>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed, provide, reactive, ref, unref, watch } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid,
  arrayMove
} from "../../utils";
import {
  dndContextKey
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {T[]} list 组件根元素样式，默认值：-。
 * @event {(event: { itemIndex: number }) => void} item-drag-start 拖拽开始时触发
 * @event {(event: { itemIndex: number; insertIndex: number }) => void} item-drag-move 拖拽项在拖拽范围内移动时触发
 * @event {(event: { itemIndex: number; insertIndex: number }) => void} item-drop 拖拽被释放时触发
 * @event {(list: T[]) => void} update 拖拽被释放时触发
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "dnd",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    list: { type: Array, required: false }
  },
  emits: ["item-drag-start", "item-drag-move", "item-drop", "update:list"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("dnd");
    const keyMap =  new WeakMap();
    const innerList = ref(props.list || []);
    watch(
      () => props.list,
      () => {
        innerList.value = props.list || [];
      }
    );
    const dndList = computed(() => {
      return unref(innerList.value).map((item) => {
        const key = keyMap.get(item) || uniqid();
        keyMap.set(item, key);
        return reactive({
          data: item,
          itemInfo: reactive({
            offset: 0,
            dragging: false
          }),
          key
        });
      });
    });
    const dragStart = (itemIndex) => {
      emit("item-drag-start", { itemIndex });
    };
    const dragMove = (itemIndex, insertIndex) => {
      emit("item-drag-move", { itemIndex, insertIndex });
    };
    const drop = (itemIndex, insertIndex) => {
      if (itemIndex !== insertIndex) {
        innerList.value = arrayMove(props.list || [], itemIndex, insertIndex);
        emit("update:list", innerList.value);
      }
      emit("item-drop", { itemIndex, insertIndex });
    };
    const dragging = ref(false);
    const rectItems = [];
    const addRectItem = (getRect) => {
      if (!rectItems.includes(getRect)) {
        rectItems.push(getRect);
      }
    };
    const removeRectItem = (getRect) => {
      if (rectItems.includes(getRect)) {
        rectItems.splice(rectItems.indexOf(getRect), 1);
      }
    };
    provide(
      dndContextKey,
      reactive({
        list: dndList,
        dragging,
        currentHeight: 0,
        dragStart,
        dragMove,
        drop,
        rectItems,
        addRectItem,
        removeRectItem
      })
    );
    __expose({});
    const dndClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const dndStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, keyMap, innerList, dndList, dragStart, dragMove, drop, dragging, rectItems, addRectItem, removeRectItem, dndClass, dndStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>