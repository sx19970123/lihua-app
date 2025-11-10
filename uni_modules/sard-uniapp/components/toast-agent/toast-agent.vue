<template>
  <sar-toast
    ref="elRef"
    :visible="innerProps.visible"
    :root-style="innerProps.rootStyle"
    :root-class="innerProps.rootClass"
    :type="innerProps.type"
    :title="innerProps.title"
    :position="innerProps.position"
    :overlay="innerProps.overlay"
    :transparent="innerProps.transparent"
    :timeout="innerProps.timeout"
    :duration="innerProps.duration"
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
import SarToast from "../toast/toast.vue";
import {
  imperativeName,
  defaultToastAgentProps
} from "./common";
import { useImperative } from "../../use";
/**
 * @property {'text' | 'loading' | 'success' | 'fail'} type 提示框类型，默认值：'text'。
 * @property {string | number} title 标题，默认值：-。
 * @property {boolean} visible 是否可见，默认值：-。
 * @property {'top' | 'center' | 'bottom'} position 提示框垂直方向放置的位置，默认值：'center'。
 * @property {boolean} overlay 是否显示背景遮罩，默认值：false。
 * @property {boolean} transparent 使背景透明，默认值：false。
 * @property {number} timeout 提示的延迟时间，单位 ms，默认值：1500。
 * @property {number} duration 显隐动画时长，单位 ms，默认值：300。
 * @property {string} id 提示组件的 id，默认值：'toast'。
 * @property {(name: TransitionHookName) => void} onVisibleHook 入场/退场动画状态改变时调用，默认值：undefined。
 * @property {() => void} onBeforeEnter 入场动画开始前调用，默认值：undefined。
 * @property {() => void} onEnter 入场动画开始时调用，默认值：undefined。
 * @property {() => void} onAfterEnter 入场动画结束时调用，默认值：undefined。
 * @property {() => void} onEnterCancelled 入场动画取消时调用，默认值：undefined。
 * @property {() => void} onBeforeLeave 退场动画开始前调用，默认值：undefined。
 * @property {() => void} onLeave 退场动画开始时调用，默认值：undefined。
 * @property {() => void} onAfterLeave 退场动画结束时调用，默认值：undefined。
 * @property {() => void} onLeaveCancelled 退场动画取消时调用，默认值：undefined。
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
    SarToast,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "toast-agent",
  props:  _mergeDefaults({
    id: { type: String, required: false },
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    type: { type: String, required: false },
    title: { type: [String, Number], required: false },
    visible: { type: Boolean, required: false },
    position: { type: String, required: false },
    overlay: { type: Boolean, required: false },
    transparent: { type: Boolean, required: false },
    timeout: { type: Number, required: false },
    duration: { type: Number, required: false },
    onVisibleHook: { type: Function, required: false },
    onBeforeEnter: { type: Function, required: false },
    onEnter: { type: Function, required: false },
    onAfterEnter: { type: Function, required: false },
    onEnterCancelled: { type: Function, required: false },
    onBeforeLeave: { type: Function, required: false },
    onLeave: { type: Function, required: false },
    onAfterLeave: { type: Function, required: false },
    onLeaveCancelled: { type: Function, required: false }
  }, defaultToastAgentProps()),
  emits: ["update:visible", "before-enter", "enter", "after-enter", "enter-cancelled", "before-leave", "leave", "after-leave", "leave-cancelled", "visible-hook"],
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
    const __returned__ = { props, emit, innerProps, elRef, imperative, onUpdateVisible, onVisibleHook, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, SarToast };
    return __returned__;
  }
});
</script>
