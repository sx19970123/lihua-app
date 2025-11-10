<template>
  <sar-notify
    ref="elRef"
    :visible="innerProps.visible"
    :root-style="innerProps.rootStyle"
    :root-class="innerProps.rootClass"
    :type="innerProps.type"
    :message="innerProps.message"
    :color="innerProps.color"
    :background="innerProps.background"
    :position="innerProps.position"
    :timeout="innerProps.timeout"
    :duration="innerProps.duration"
    :status-bar="innerProps.statusBar"
    @click="onClick"
    @update:visible="onUpdateVisible"
    @visible-hook="onVisibleHook"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @enter-cancelled="onEnterCancelled"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
    @leave-cancelled="onLeaveCancelled"
  />
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref } from "vue";
import SarNotify from "../notify/notify.vue";
import {
  imperativeName,
  defaultNotifyAgentProps
} from "./common";
import { useImperative } from "../../use";
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
 * @property {string} id 通知组件的 id，默认值：'notify'。
 * @property {(name: TransitionHookName) => void} onVisibleHook 入场/退场动画状态改变时调用，默认值：undefined。
 * @property {() => void} onBeforeEnter 入场动画开始前调用，默认值：undefined。
 * @property {() => void} onEnter 入场动画开始时调用，默认值：undefined。
 * @property {() => void} onAfterEnter 入场动画结束时调用，默认值：undefined。
 * @property {() => void} onEnterCancelled 入场动画取消时调用，默认值：undefined。
 * @property {() => void} onBeforeLeave 退场动画开始前调用，默认值：undefined。
 * @property {() => void} onLeave 退场动画开始时调用，默认值：undefined。
 * @property {() => void} onAfterLeave 退场动画结束时调用，默认值：undefined。
 * @property {() => void} onLeaveCancelled 退场动画取消时调用，默认值：undefined。
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
    SarNotify,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "notify-agent",
  props:  _mergeDefaults({
    id: { type: String, required: false },
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
    statusBar: { type: Boolean, required: false },
    onVisibleHook: { type: Function, required: false },
    onBeforeEnter: { type: Function, required: false },
    onEnter: { type: Function, required: false },
    onAfterEnter: { type: Function, required: false },
    onEnterCancelled: { type: Function, required: false },
    onBeforeLeave: { type: Function, required: false },
    onLeave: { type: Function, required: false },
    onAfterLeave: { type: Function, required: false },
    onLeaveCancelled: { type: Function, required: false }
  }, defaultNotifyAgentProps()),
  emits: ["click", "update:visible", "before-enter", "enter", "after-enter", "enter-cancelled", "before-leave", "leave", "after-leave", "leave-cancelled", "visible-hook"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const innerProps = ref({ ...props });
    const elRef = ref();
    const imperative = {
      show(newProps) {
        innerProps.value = {
          ...props,
          ...newProps,
          visible: true
        };
        elRef.value?.reHideLater();
      },
      hide() {
        innerProps.value = {
          ...innerProps.value,
          visible: false
        };
        elRef.value?.cancelHide();
      }
    };
    const onClick = (event) => {
      emit("click", event);
    };
    const onUpdateVisible = (visible) => {
      innerProps.value.visible = visible;
      emit("update:visible", visible);
    };
    const onVisibleHook = (name) => {
      emit("visible-hook", name);
      innerProps.value.onVisibleHook?.(name);
    };
    const onBeforeEnter = () => {
      emit("before-enter");
      innerProps.value.onBeforeEnter?.();
    };
    const onEnter = () => {
      emit("enter");
      innerProps.value.onEnter?.();
    };
    const onAfterEnter = () => {
      emit("after-enter");
      innerProps.value.onAfterEnter?.();
    };
    const onEnterCancelled = () => {
      emit("enter-cancelled");
      innerProps.value.onEnterCancelled?.();
    };
    const onBeforeLeave = () => {
      emit("before-leave");
      innerProps.value.onBeforeLeave?.();
    };
    const onLeave = () => {
      emit("leave");
      innerProps.value.onLeave?.();
    };
    const onAfterLeave = () => {
      emit("after-leave");
      innerProps.value.onAfterLeave?.();
    };
    const onLeaveCancelled = () => {
      emit("leave-cancelled");
      innerProps.value.onLeaveCancelled?.();
    };
    useImperative(
      imperativeName,
      imperative,
      computed(() => innerProps.value.id)
    );
    const __returned__ = { props, emit, innerProps, elRef, imperative, onClick, onUpdateVisible, onVisibleHook, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, SarNotify };
    return __returned__;
  }
});
</script>
