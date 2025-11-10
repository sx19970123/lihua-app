<template>
  <sar-dialog
    :root-style="innerProps.rootStyle"
    :root-class="innerProps.rootClass"
    :popup-style="innerProps.popupStyle"
    :popup-class="innerProps.popupClass"
    :visible="innerProps.visible"
    :title="innerProps.title"
    :message="innerProps.message"
    :headed="innerProps.headed"
    :button-type="innerProps.buttonType"
    :show-cancel="innerProps.showCancel"
    :cancel-text="innerProps.cancelText"
    :show-confirm="innerProps.showConfirm"
    :confirm-text="innerProps.confirmText"
    :overlay-closable="innerProps.overlayClosable"
    :before-close="innerProps.beforeClose"
    :duration="innerProps.duration"
    :cancel-props="innerProps.cancelProps"
    :confirm-props="innerProps.confirmProps"
    @update:visible="onUpdateVisible"
    @confirm="onConfirm"
    @close="onClose"
    @cancel="onCancel"
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
import SarDialog from "../dialog/dialog.vue";
import {
  defaultDialogAgentProps,
  imperativeName
} from "./common";
import { useImperative } from "../../use";
/**
 * @property {string} rootClass 对话框根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 对话框根元素样式，默认值：-。
 * @property {string} popupClass 弹窗框根元素类名，默认值：-。
 * @property {StyleValue} popupStyle 弹窗框根元素样式，默认值：-。
 * @property {boolean} visible 是否可见，默认值：false。
 * @property {string} title 标题，默认值：-。
 * @property {string} message 文本内容，默认值：-。
 * @property {boolean} headed 是否显示带头部类型，默认值：true。
 * @property {'round' | 'text'} buttonType 按钮类型，默认值：'round'。
 * @property {boolean} showCancel 是否显示取消按钮，默认值：true。
 * @property {string} cancelText 取消按钮文案，默认值：'取消'。
 * @property {boolean} showConfirm 是否显示确定按钮，默认值：true。
 * @property {string} confirmText 确定按钮文案，默认值：'确定'。
 * @property {boolean} overlayClosable 点击遮罩是否关闭，默认值：false。
 * @property {DialogBeforeClose} beforeClose 关闭前的回调，返回 `false` 或 `rejected` 状态的 `Promise` 可阻止关闭，默认值：-。
 * @property {number} duration 显隐动画时长，单位 ms，默认值：300。
 * @property {ButtonProps} confirmProps 设置确定按钮 props，默认值：-。
 * @property {ButtonProps} cancelProps 设置取消按钮 props，默认值：-。
 * @property {string} id 对话框组件的 id，默认值：'dialog'。
 * @property {() => void} onClose 点击关闭按钮或遮罩时调用，默认值：undefined。
 * @property {() => void} onCancel 点击取消按钮时调用，默认值：undefined。
 * @property {() => void} onConfirm 点击确定按钮时调用，默认值：undefined。
 * @property {(name: TransitionHookName) => void} onVisibleHook 入场/退场动画状态改变时调用，默认值：undefined。
 * @property {() => void} onBeforeEnter 入场动画开始前调用，默认值：undefined。
 * @property {() => void} onEnter 入场动画开始时调用，默认值：undefined。
 * @property {() => void} onAfterEnter 入场动画结束时调用，默认值：undefined。
 * @property {() => void} onEnterCancelled 入场动画取消时调用，默认值：undefined。
 * @property {() => void} onBeforeLeave 退场动画开始前调用，默认值：undefined。
 * @property {() => void} onLeave 退场动画开始时调用，默认值：undefined。
 * @property {() => void} onAfterLeave 退场动画结束时调用，默认值：undefined。
 * @property {() => void} onLeaveCancelled 退场动画取消时调用，默认值：undefined。
 * @event {(visible: boolean) => void} update 对话框显隐时触发
 * @event {() => void} close 点击关闭按钮或遮罩时触发
 * @event {() => void} cancel 点击取消按钮时触发
 * @event {() => void} confirm 点击确定按钮时触发
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
    SarDialog,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "dialog-agent",
  props:  _mergeDefaults({
    id: { type: String, required: false },
    onClose: { type: Function, required: false },
    onCancel: { type: Function, required: false },
    onConfirm: { type: Function, required: false },
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    popupStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    popupClass: { type: String, required: false },
    visible: { type: Boolean, required: false },
    title: { type: String, required: false },
    message: { type: String, required: false },
    headed: { type: Boolean, required: false },
    buttonType: { type: String, required: false },
    showCancel: { type: Boolean, required: false },
    cancelText: { type: String, required: false },
    showConfirm: { type: Boolean, required: false },
    confirmText: { type: String, required: false },
    overlayClosable: { type: Boolean, required: false },
    beforeClose: { type: Function, required: false },
    duration: { type: Number, required: false },
    cancelProps: { type: Object, required: false },
    confirmProps: { type: Object, required: false },
    onVisibleHook: { type: Function, required: false },
    onBeforeEnter: { type: Function, required: false },
    onEnter: { type: Function, required: false },
    onAfterEnter: { type: Function, required: false },
    onEnterCancelled: { type: Function, required: false },
    onBeforeLeave: { type: Function, required: false },
    onLeave: { type: Function, required: false },
    onAfterLeave: { type: Function, required: false },
    onLeaveCancelled: { type: Function, required: false }
  }, defaultDialogAgentProps()),
  emits: ["update:visible", "close", "cancel", "confirm", "before-enter", "enter", "after-enter", "enter-cancelled", "before-leave", "leave", "after-leave", "leave-cancelled", "visible-hook"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const innerProps = ref({ ...props });
    const imperative = {
      show(newProps) {
        innerProps.value = {
          ...props,
          ...newProps,
          visible: true
        };
      },
      hide() {
        innerProps.value = {
          ...innerProps.value,
          visible: false
        };
      }
    };
    const onConfirm = () => {
      emit("confirm");
      innerProps.value.onConfirm?.();
    };
    const onClose = () => {
      emit("close");
      innerProps.value.onClose?.();
    };
    const onCancel = () => {
      emit("cancel");
      innerProps.value.onCancel?.();
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
    const __returned__ = { props, emit, innerProps, imperative, onConfirm, onClose, onCancel, onUpdateVisible, onVisibleHook, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, SarDialog };
    return __returned__;
  }
});
</script>
