<template>
  <sar-popup
    :visible="visible"
    :overlay="overlay"
    :duration="duration"
    :transparent="transparent"
    :root-style="popupStyle"
    effect="fade"
    @visible-hook="onVisibleHook"
  >
    <view :class="toastClass" :style="toastStyle">
      <view v-if="type !== 'text'" :class="iconClass">
        <sar-loading v-if="type === 'loading'" />
        <sar-icon v-else family="sari" :name="type" />
      </view>
      <view :class="bem.e('title')">{{ title }}</view>
    </view>
  </sar-popup>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, watch, nextTick } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import SarPopup from "../popup/popup.vue";
import SarLoading from "../loading/loading.vue";
import SarIcon from "../icon/icon.vue";
import { useTimeout } from "../../use";
import {
  defaultToastProps
} from "./common";
const __default__ = {
  options: {
    virtualHost: true,
    styleIsolation: "shared"
  }
};
export const mapIdToast = {};
/**
 * @property {'text' | 'loading' | 'success' | 'fail'} type 提示框类型，默认值：'text'。
 * @property {string | number} title 标题，默认值：-。
 * @property {boolean} visible 是否可见，默认值：-。
 * @property {'top' | 'center' | 'bottom'} position 提示框垂直方向放置的位置，默认值：'center'。
 * @property {boolean} overlay 是否显示背景遮罩，默认值：false。
 * @property {boolean} transparent 使背景透明，默认值：false。
 * @property {number} timeout 提示的延迟时间，单位 ms，默认值：1500。
 * @property {number} duration 显隐动画时长，单位 ms，默认值：300。
 * @event {(visible: boolean) => void} update 提示框显隐时触发
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
    SarLoading,
    SarIcon,
  },
  ...__default__,
  __name: "toast",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    type: { type: String, required: false },
    title: { type: [String, Number], required: false },
    visible: { type: Boolean, required: false },
    position: { type: String, required: false },
    overlay: { type: Boolean, required: false },
    transparent: { type: Boolean, required: false },
    timeout: { type: Number, required: false },
    duration: { type: Number, required: false }
  }, defaultToastProps),
  emits: ["update:visible", "before-enter", "enter", "after-enter", "enter-cancelled", "before-leave", "leave", "after-leave", "leave-cancelled", "visible-hook"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("toast");
    const { start: hideLater, stop: cancelHide } = useTimeout(
      () => {
        emit("update:visible", false);
      },
      () => props.timeout
    );
    const reHideLater = () => {
      cancelHide();
      nextTick(() => {
        if (props.type !== "loading" && props.timeout > 0) {
          hideLater();
        }
      });
    };
    watch(
      () => props.visible,
      () => {
        if (props.visible) {
          if (props.type !== "loading" && props.timeout > 0) {
            hideLater();
          }
        }
      }
    );
    const onVisibleHook = (name) => {
      emit("visible-hook", name);
      emit(name);
    };
    __expose({
      reHideLater,
      cancelHide
    });
    const toastClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("is-text", props.type === "text"),
        bem.m("not-text", props.type !== "text"),
        props.rootClass
      );
    });
    const toastStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const popupStyle = computed(() => {
      const style = {
        top: {
          top: "var(--sar-toast-top)",
          transform: "translate(-50%, 0)"
        },
        bottom: {
          top: "auto",
          bottom: "var(--sar-toast-bottom)",
          transform: "translate(-50%, 0)"
        },
        center: null
      }[props.position];
      return stringifyStyle({
        width: "max-content",
        maxWidth: "var(--sar-toast-text-max-width)",
        ...style
      });
    });
    const iconClass = computed(() => {
      return classNames(
        bem.e("icon"),
        bem.em("icon", "loading", props.type === "loading")
      );
    });
    const __returned__ = { mapIdToast, props, emit, bem, hideLater, cancelHide, reHideLater, onVisibleHook, toastClass, toastStyle, popupStyle, iconClass, SarPopup, SarLoading, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>