<template>
  <!-- #ifdef WEB -->
  <teleport to="body">
    <!-- #endif -->
    <!-- #ifdef MP -->
    <root-portal>
      <!-- #endif -->
      <view v-show="pageVisible" class="sar-portal">
        <sar-overlay
          v-if="overlay"
          :visible="visible"
          :duration="duration"
          :z-index="zIndex"
          :background="background"
          :transparent="transparent"
          :root-style="overlayStyle"
          :root-class="overlayClass"
          @click="onOverlayClick"
        />
        <!-- #ifndef MP -->
        <view
          v-bind="$attrs"
          :class="popupClass"
          :style="popupStyle"
          @transitionend="onTransitionEnd"
        >
          <slot></slot>
        </view>
        <!-- #endif -->
        <!-- #ifdef MP -->
        <view
          :class="popupClass"
          :style="popupStyle"
          @transitionend="onTransitionEnd"
        >
          <slot></slot>
        </view>
        <!-- #endif -->
      </view>
      <!-- #ifdef MP -->
    </root-portal>
    <!-- #endif -->
    <!-- #ifdef WEB -->
  </teleport>
  <!-- #endif -->
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, reactive, ref, toRef } from "vue";
import { onHide, onShow } from "@dcloudio/uni-app";
import { classNames, stringifyStyle, createBem, isWeb } from "../../utils";
import { useTransition, useZIndex } from "../../use";
import SarOverlay from "../overlay/overlay.vue";
import {
  defaultPopupProps,
  usePopupVisibleHookProvide
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {boolean} visible 是否可见，默认值：false。
 * @property {number} duration 显隐动画时长，单位 ms，默认值：300。
 * @property {'slide-top' | 'slide-right' | 'slide-bottom' | 'slide-left' | 'zoom' | 'fade'} effect 显隐效果，默认值：'fade'。
 * @property {boolean} overlay 是否显示遮罩，默认值：true。
 * @property {string} overlayClass 添加到遮罩的类名，默认值：-。
 * @property {string} overlayStyle 添加到遮罩的样式，默认值：-。
 * @property {string} background 遮罩背景色，默认值：-。
 * @property {boolean} transparent 透明遮罩，默认值：false。
 * @property {boolean} overlayClosable 是否在点击遮罩层后关闭，默认值：true。
 * @property {boolean} keepRender 无论刚挂载还是隐藏，都始终不设置 display 为 none，一般用于内部包含计算尺寸的组件的情况，默认值：false。
 * @event {(event: any) => void} overlay-click 点击遮罩时触发
 * @event {(name: TransitionHookName) => void} visible-hook 入场/退场动画状态改变时触发
 * @event {() => void} before-enter 入场动画开始前触发
 * @event {() => void} enter 入场动画开始时触发
 * @event {() => void} after-enter 入场动画结束时触发
 * @event {() => void} enter-cancelled 入场动画取消时触发
 * @event {() => void} before-leave 退场动画开始前触发
 * @event {() => void} leave 退场动画开始时触发
 * @event {() => void} after-leave 退场动画结束时触发
 * @event {() => void} leave-cancelled 退场动画取消时触发
 * @event {(visible: boolean) => void} update 显隐时触发
 */
export default  _defineComponent({
  components: {
    SarOverlay,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    },
    inheritAttrs: false
  },
  __name: "popup",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    visible: { type: Boolean, required: false },
    duration: { type: Number, required: false },
    effect: { type: String, required: false },
    overlay: { type: Boolean, required: false },
    overlayClass: { type: String, required: false },
    overlayStyle: { type: String, required: false },
    background: { type: String, required: false },
    transparent: { type: Boolean, required: false },
    keepRender: { type: Boolean, required: false },
    overlayClosable: { type: Boolean, required: false }
  }, defaultPopupProps),
  emits: ["overlay-click", "update:visible", "before-enter", "enter", "after-enter", "enter-cancelled", "before-leave", "leave", "after-leave", "leave-cancelled", "visible-hook"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("popup");
    const [zIndex, increaseZIndex] = useZIndex();
    const callVisibleHook = usePopupVisibleHookProvide();
    const keepRenderClass = ref(
      props.keepRender ? bem.m(props.effect) + "-keep" : ""
    );
    const onVisibleHook = (name) => {
      callVisibleHook(name);
      emit("visible-hook", name);
      emit(name);
      if (name === "before-enter") {
        increaseZIndex();
      }
      if (props.keepRender) {
        keepRenderClass.value = name === "after-leave" ? bem.m(props.effect) + "-" + name + "-keep" : "";
      }
    };
    const { realVisible, transitionClass, onTransitionEnd } = useTransition(
      reactive({
        visible: toRef(() => props.visible),
        duration: toRef(() => props.duration),
        prefix: computed(() => bem.m(props.effect) + "-"),
        onVisibleHook
      })
    );
    const onOverlayClick = (event) => {
      emit("overlay-click", event);
      if (props.overlayClosable) {
        emit("update:visible", false);
      }
    };
    const pageVisible = ref(true);
    onShow(() => {
      if (isWeb) {
        pageVisible.value = true;
      }
    });
    onHide(() => {
      if (isWeb) {
        pageVisible.value = false;
      }
    });
    const popupClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m(props.effect),
        props.rootClass,
        transitionClass.value,
        keepRenderClass.value
      );
    });
    const popupStyle = computed(() => {
      return stringifyStyle(props.rootStyle, {
        zIndex: zIndex.value,
        display: props.keepRender || realVisible.value ? "flex" : "none",
        transitionDuration: props.duration + "ms"
      });
    });
    const __returned__ = { props, emit, bem, zIndex, increaseZIndex, callVisibleHook, keepRenderClass, onVisibleHook, realVisible, transitionClass, onTransitionEnd, onOverlayClick, pageVisible, popupClass, popupStyle, SarOverlay };
    return __returned__;
  }
});
</script>

<!-- #ifdef APP-PLUS -->
<script module="render" lang="renderjs">
// @ts-expect-error ignore renderjs
export default {
  mounted() {
    const root = document.querySelector('uni-app') || document.body
    // @ts-expect-error ignore renderjs
    if (this.$ownerInstance.$el) {
      // @ts-expect-error ignore renderjs
      root.appendChild(this.$ownerInstance.$el)
    }
  }
}
</script>
<!-- #endif -->


<style lang="scss">
@import './index.scss';
</style>