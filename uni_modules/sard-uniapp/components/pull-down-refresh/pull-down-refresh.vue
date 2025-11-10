<template>
  <!-- #ifndef MP-WEIXIN -->
  <view
    :class="pullDownRefreshClass"
    :style="pullDownRefreshStyle"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
    @mousedown="onMouseDown"
  >
    <view :class="bem.e('header')" :style="headerStyle">
      <slot v-if="status === 'unready'" name="unready" :progress="progress">
        <sar-loading
          type="clock"
          :class="loadingClass"
          :animated="false"
          :progress="progress"
        />
      </slot>
      <slot v-else-if="status === 'ready'" name="ready">
        <sar-loading type="clock" :class="loadingClass" :animated="false" />
      </slot>
      <slot v-else-if="status === 'loading'" name="loading">
        <sar-loading type="clock" :class="loadingClass" />
      </slot>
      <slot v-else-if="status === 'done'" name="done"></slot>
    </view>
    <slot></slot>
  </view>
  <!-- #endif -->
  <!-- #ifdef MP-WEIXIN -->
  <view
    :class="pullDownRefreshClass"
    :style="pullDownRefreshStyle"
    :prop="status"
    :change:prop="touch.statusYWatch"
    :data-status="status"
    :data-canrefresh="canRefresh"
    :data-threshold="threshold"
    :data-headerheight="headerHeight"
    :data-duration="transitionDuration"
    :data-disabled="disabled"
    @touchstart="touch.onTouchStart"
    @touchmove="touch.onTouchMove"
    @touchend="touch.onTouchEnd"
    @touchcancel="touch.onTouchEnd"
  >
    <view :class="bem.e('header')" :style="headerStyle">
      <slot v-if="status === 'unready'" name="unready" :progress="progress">
        <sar-loading
          type="clock"
          :class="loadingClass"
          :animated="false"
          :progress="progress"
        />
      </slot>
      <slot v-else-if="status === 'ready'" name="ready">
        <sar-loading type="clock" :class="loadingClass" :animated="false" />
      </slot>
      <slot v-else-if="status === 'loading'" name="loading">
        <sar-loading type="clock" :class="loadingClass" />
      </slot>
      <slot v-else-if="status === 'done'" name="done"></slot>
    </view>
    <slot></slot>
  </view>
  <!-- #endif -->
</template>

<!-- #ifdef MP-WEIXIN -->
<script src="./touch.wxs" module="touch" lang="wxs"></script>
<!-- #endif -->

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, onMounted, ref, watch } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import {
  defaultPullDownRefreshProps
} from "./common";
import { useMouseDown, useTimeout } from "../../use";
import SarLoading from "../loading/loading.vue";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number} threshold 触发下拉刷新的阈值，单位 px，默认值：50。
 * @property {number} headerHeight 顶部内容高度，单位 px，默认值：50。
 * @property {boolean} loading 是否处于加载中状态，默认值：false。
 * @property {number} transitionDuration 回弹动画时长，单位 ms，默认值：300。
 * @property {number} doneDuration 加载完成状态持续时长，单位 ms，默认值：0。
 * @property {boolean} disabled 是否禁止用户进行下拉操作，默认值：false。
 * @event {() => void} refresh 下拉到指定阈值并松开手指后触发
 */
export default  _defineComponent({
  components: {
    SarLoading,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "pull-down-refresh",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    threshold: { type: Number, required: false },
    headerHeight: { type: Number, required: false },
    loading: { type: Boolean, required: false },
    transitionDuration: { type: Number, required: false },
    doneDuration: { type: Number, required: false },
    disabled: { type: Boolean, required: false }
  }, defaultPullDownRefreshProps()),
  emits: ["refresh"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const touch = {};
    const props = __props;
    const emit = __emit;
    const bem = createBem("pull-down-refresh");
    const status = ref("initial");
    const translateY = ref(0);
    const progress = computed(() => {
      return Math.min(translateY.value / props.threshold, 1);
    });
    const { start: toInitialLater, stop: cancelToInitial } = useTimeout(
      () => {
        status.value = "initial";
      },
      () => props.transitionDuration
    );
    const { start: toRecoveringLater, stop: cancelToRecovering } = useTimeout(
      () => {
        toRecovering();
      },
      () => props.doneDuration
    );
    const toLoading = () => {
      cancelToRecovering();
      cancelToInitial();
      status.value = "loading";
      translateY.value = props.headerHeight;
    };
    const toRecovering = () => {
      status.value = "recovering";
      translateY.value = 0;
      toInitialLater();
    };
    const toDone = () => {
      status.value = "done";
      toRecoveringLater();
    };
    watch(
      () => props.loading,
      () => {
        if (props.loading) {
          toLoading();
        } else {
          toDone();
        }
      }
    );
    onMounted(() => {
      if (props.loading) {
        toLoading();
      }
    });
    let startX = 0;
    let startY = 0;
    let movable = false;
    let lockDirection = "";
    const isDragging = ref(false);
    const onTouchStart = (event) => {
      if (props.disabled || status.value !== "initial" || !canRefresh.value) {
        return;
      }
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      movable = true;
    };
    const onTouchMove = (event) => {
      if (!movable || lockDirection && lockDirection !== "down") {
        return;
      }
      const deltaX = event.touches[0].clientX - startX;
      const deltaY = event.touches[0].clientY - startY;
      if (!lockDirection) {
        const isVertical = Math.abs(deltaY) >= Math.abs(deltaX);
        lockDirection = isVertical && deltaY > 0 ? "down" : "others";
      }
      if (lockDirection === "down") {
        const offsetY = Math.max(deltaY, 0) / 2;
        status.value = offsetY >= props.threshold ? "ready" : "unready";
        translateY.value = offsetY;
        isDragging.value = true;
        event.preventDefault();
        if (event.stopImmediatePropagation) {
          event.stopImmediatePropagation();
        } else if (event.stopPropagation) {
          event.stopPropagation();
        }
      }
    };
    const onTouchEnd = () => {
      movable = false;
      lockDirection = "";
      isDragging.value = false;
      switch (status.value) {
        case "unready":
          toRecovering();
          return;
        case "ready":
          toLoading();
          emit("refresh");
          return;
      }
    };
    const onMouseDown = useMouseDown(onTouchStart, onTouchMove, onTouchEnd);
    const canRefresh = ref(true);
    const enableToRefresh = (can) => {
      canRefresh.value = can;
    };
    __expose({
      enableToRefresh,
      _setStatus: (newStatus) => {
        status.value = newStatus;
      },
      _emit(event) {
        emit(event.name);
      },
      _toRecovering: toRecovering,
      _toLoading: toLoading,
      _setTranslateY: (y) => {
        translateY.value = y;
      }
    });
    const pullDownRefreshClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const pullDownRefreshStyle = computed(() => {
      return stringifyStyle(props.rootStyle, {
        transform: `translate3d(0,${translateY.value}px,0)`,
        transitionDuration: (isDragging.value ? 0 : props.transitionDuration) + "ms"
      });
    });
    const headerStyle = computed(() => {
      return stringifyStyle({
        height: props.headerHeight + "px"
      });
    });
    const loadingClass = computed(() => {
      return classNames(bem.e("loading"));
    });
    const __returned__ = { touch, props, emit, bem, status, translateY, progress, toInitialLater, cancelToInitial, toRecoveringLater, cancelToRecovering, toLoading, toRecovering, toDone, get startX() {
      return startX;
    }, set startX(v) {
      startX = v;
    }, get startY() {
      return startY;
    }, set startY(v) {
      startY = v;
    }, get movable() {
      return movable;
    }, set movable(v) {
      movable = v;
    }, get lockDirection() {
      return lockDirection;
    }, set lockDirection(v) {
      lockDirection = v;
    }, isDragging, onTouchStart, onTouchMove, onTouchEnd, onMouseDown, canRefresh, enableToRefresh, pullDownRefreshClass, pullDownRefreshStyle, headerStyle, loadingClass, SarLoading };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>