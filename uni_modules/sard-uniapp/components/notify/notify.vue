<template>
  <sar-popup
    :visible="innerVisible"
    :overlay="false"
    :effect="effect"
    :duration="duration"
    @visible-hook="onVisibleHook"
  >
    <view :class="notifyClass" :style="notifyStyle" @click="onClick">
      <sar-status-bar v-if="position === 'top' && statusBar" />
      <view :class="bem.e('content')">
        <slot>{{ message }}</slot>
      </view>
    </view>
  </sar-popup>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref, watch, nextTick } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import { useTimeout } from "../../use";
import {
  defaultNotifyProps
} from "./common";
import SarPopup from "../popup/popup.vue";
import SarStatusBar from "../status-bar/status-bar.vue";
/**
 * @property {'primary' | 'success' | 'warning' | 'error'} type 加载类型，默认值：'primary'。
 * @property {string} message 通知内容，默认值：-。
 * @property {string} color 字体颜色，默认值：-。
 * @property {string} background 背景色，默认值：-。
 * @property {boolean} visible 是否显示通知，默认值：-。
 * @property {'top' | 'bottom'} position 通知放置的位置，默认值：'top'。
 * @property {number} timeout 展示时长(ms)，值为 0 时，通知不会消失，默认值：3000。
 * @property {number} duration 显隐动画时长，单位 ms，默认值：300。
 * @property {boolean} statusBar 是否包含状态栏，自定义导航栏时应设为 `true`，默认值：false。
 * @event {(visible: boolean) => void} update 通知框显隐时触发
 * @event {(event: any) => void} click 点击通知框时触发
 * @event {(name: TransitionHookName) => void} visible-hook 入场/退场动画状态改变时触发
 * @event {() => void} before-enter 入场动画开始前触发
 * @event {() => void} enter 入场动画开始时触发
 * @event {() => void} after-enter 入场动画结束时触发
 * @event {() => void} enter-cancelled 入场动画取消时触发
 * @event {() => void} before-leave 退场动画开始前触发
 * @event {() => void} leave 退场动画开始时触发
 * @event {() => void} after-leave 退场动画结束时触发
 * @event {() => void} leave-cancelled 退场动画取消时触发
 */
export default  _defineComponent({
  components: {
    SarPopup,
    SarStatusBar,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "notify",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    type: { type: String, required: false },
    message: { type: String, required: false },
    color: { type: String, required: false },
    background: { type: String, required: false },
    visible: { type: Boolean, required: false },
    position: { type: String, required: false },
    timeout: { type: Number, required: false },
    duration: { type: Number, required: false },
    statusBar: { type: Boolean, required: false }
  }, defaultNotifyProps),
  emits: ["click", "update:visible", "before-enter", "enter", "after-enter", "enter-cancelled", "before-leave", "leave", "after-leave", "leave-cancelled", "visible-hook"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("notify");
    const effect = computed(() => {
      return {
        top: "slide-top",
        bottom: "slide-bottom"
      }[props.position];
    });
    const innerVisible = ref(props.visible);
    const { start: hideLater, stop: cancelHide } = useTimeout(
      () => {
        innerVisible.value = false;
        emit("update:visible", false);
      },
      () => props.timeout
    );
    const reHideLater = () => {
      cancelHide();
      nextTick(() => {
        if (props.timeout > 0) {
          hideLater();
        }
      });
    };
    watch(
      () => props.visible,
      () => {
        innerVisible.value = props.visible;
        if (props.visible) {
          if (props.timeout > 0) {
            hideLater();
          }
        }
      }
    );
    const onVisibleHook = (name) => {
      emit("visible-hook", name);
      emit(name);
    };
    const onClick = (event) => {
      emit("click", event);
    };
    __expose({
      reHideLater,
      cancelHide
    });
    const notifyClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m(props.type),
        bem.m(props.position),
        props.rootClass
      );
    });
    const notifyStyle = computed(() => {
      return stringifyStyle(
        {
          backgroundColor: props.background,
          color: props.color
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, emit, bem, effect, innerVisible, hideLater, cancelHide, reHideLater, onVisibleHook, onClick, notifyClass, notifyStyle, SarPopup, SarStatusBar };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>