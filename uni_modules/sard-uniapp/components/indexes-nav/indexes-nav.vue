<template>
  <view
    :class="navClass"
    :style="navStyle"
    @touchstart="onTouchStart"
    @touchmove.stop.prevent="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
    @mousedown="onMouseDown"
  >
    <view
      v-for="(name, i) in anchors"
      :key="i"
      :class="
        classNames(
          bem.e('nav-item'),
          bem.em('nav-item', 'active', name === innerCurrent),
        )
      "
    >
      {{ name }}
    </view>
    <view
      v-if="realVisible"
      :class="classNames(bem.e('hint'), transitionClass)"
      :style="
        stringifyStyle({
          top: hintTop,
        })
      "
      @transitionend="onTransitionEnd"
    >
      <view :class="bem.e('hint-text')">
        {{ innerCurrent }}
      </view>
    </view>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed, ref, getCurrentInstance, reactive, watch } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid,
  getBoundingClientRect,
  clamp
} from "../../utils";
import { useMouseDown, useTransition } from "../../use";
import { defaultConfig } from "../config";
const itemSize = 20;
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "indexes-nav",
  props: {
    anchors: { type: Array, required: true },
    current: { type: [String, Number], required: false }
  },
  emits: ["select"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("indexes");
    const instance = getCurrentInstance();
    const navId = uniqid();
    const navRect = ref();
    const hintVisible = ref(false);
    let moved = false;
    const innerCurrent = ref();
    watch(
      () => props.current,
      (current) => {
        innerCurrent.value = current;
      },
      {
        immediate: true
      }
    );
    const getNavRect = async () => {
      navRect.value = await getBoundingClientRect(`.${navId}`, instance);
    };
    const { realVisible, transitionClass, onTransitionEnd } = useTransition(
      reactive({
        visible: hintVisible,
        duration: defaultConfig.indexes.hintDuration,
        prefix: bem.em("hint", "")
      })
    );
    const hintTop = computed(() => {
      let index = innerCurrent.value !== void 0 ? props.anchors.indexOf(innerCurrent.value) : -1;
      if (index < 0) {
        index = 0;
      }
      return index * itemSize + itemSize / 2 + "px";
    });
    const calcPosition = (touch) => {
      if (!navRect.value) {
        return;
      }
      const offsetY = touch.clientY - navRect.value.top;
      const itemIndex = clamp(
        Math.floor(offsetY / itemSize),
        0,
        props.anchors.length - 1
      );
      const current = props.anchors[itemIndex];
      if (current !== innerCurrent.value) {
        innerCurrent.value = current;
        emit("select", current);
      }
    };
    const onTouchStart = async (event) => {
      hintVisible.value = true;
      moved = false;
      await getNavRect();
      if (!moved) {
        calcPosition(event.touches[0]);
      }
    };
    const onTouchMove = (event) => {
      moved = true;
      if (!navRect.value) {
        return;
      }
      calcPosition(event.touches[0]);
    };
    const onTouchEnd = () => {
      hintVisible.value = false;
      navRect.value = void 0;
    };
    const onMouseDown = useMouseDown(onTouchStart, onTouchMove, onTouchEnd);
    const navClass = computed(() => {
      return classNames(bem.e("nav"), navId);
    });
    const navStyle = computed(() => {
      return stringifyStyle({
        "--sar-indexes-nav-item-size": `${itemSize}px`
      });
    });
    const __returned__ = { props, emit, bem, instance, itemSize, navId, navRect, hintVisible, get moved() {
      return moved;
    }, set moved(v) {
      moved = v;
    }, innerCurrent, getNavRect, realVisible, transitionClass, onTransitionEnd, hintTop, calcPosition, onTouchStart, onTouchMove, onTouchEnd, onMouseDown, navClass, navStyle, get classNames() {
      return classNames;
    }, get stringifyStyle() {
      return stringifyStyle;
    } };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>