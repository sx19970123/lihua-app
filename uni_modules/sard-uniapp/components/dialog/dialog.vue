<template>
  <sar-popup
    effect="zoom"
    :visible="visible"
    :duration="duration"
    :root-class="popupClass"
    :root-style="mergedPopupStyle"
    @overlay-click="onOverlayClick"
    @visible-hook="onVisibleHook"
  >
    <view :class="dialogClass" :style="dialogStyle">
      <view v-if="headed" :class="bem.e('header')">
        <view v-if="title" :class="bem.e('title')">
          {{ title }}
        </view>
        <view :class="bem.e('close')">
          <sar-button
            type="pale-text"
            theme="neutral"
            size="large"
            block
            @click="onClose"
          >
            <sar-icon family="sari" name="close" />
          </sar-button>
        </view>
      </view>

      <view v-if="(!headed && title) || message" :class="bem.e('body')">
        <view v-if="!headed && title" :class="bem.e('title')">
          {{ title }}
        </view>
        <view v-if="message" :class="bem.e('message')">
          {{ message }}
        </view>
      </view>
      <slot></slot>

      <view :class="bem.e('footer')">
        <sar-button
          v-if="showCancel"
          :root-class="bem.e('button')"
          :loading="loading.cancel"
          :type="buttonProps.cancel.type"
          :theme="buttonProps.cancel.theme"
          :size="buttonProps.cancel.size"
          :round="buttonProps.confirm.round"
          block
          v-bind="cancelProps"
          @click="onCancel"
        >
          {{ cancelText || t('cancel') }}
        </sar-button>
        <view
          v-if="showCancel && buttonType === 'text'"
          :class="bem.e('divider')"
        />
        <sar-button
          v-if="showConfirm"
          :root-class="bem.e('button')"
          :loading="loading.confirm"
          :type="buttonProps.confirm.type"
          :theme="buttonProps.confirm.theme"
          :size="buttonProps.confirm.size"
          :round="buttonProps.confirm.round"
          block
          v-bind="confirmProps"
          @click="onConfirm"
        >
          {{ confirmText || t('confirm') }}
        </sar-button>
      </view>
    </view>
  </sar-popup>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref, watch, readonly, reactive } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  noop,
  isObject,
  isFunction
} from "../../utils";
import { useTranslate } from "../locale";
import SarPopup from "../popup/popup.vue";
import SarButton from "../button/button.vue";
import SarIcon from "../icon/icon.vue";
import {
  defaultDialogProps
} from "./common";
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
    SarPopup,
    SarButton,
    SarIcon,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "dialog",
  props:  _mergeDefaults({
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
    confirmProps: { type: Object, required: false }
  }, defaultDialogProps),
  emits: ["update:visible", "close", "cancel", "confirm", "before-enter", "enter", "after-enter", "enter-cancelled", "before-leave", "leave", "after-leave", "leave-cancelled", "visible-hook"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("dialog");
    const { t } = useTranslate("dialog");
    const innerVisible = ref(props.visible);
    watch(
      () => props.visible,
      () => {
        innerVisible.value = props.visible;
      }
    );
    const loading = reactive({
      cancel: false,
      confirm: false,
      close: false
    });
    const readonlyLoading = readonly(loading);
    const asyncSet =  new Set();
    watch(
      innerVisible,
      () => {
        if (innerVisible.value === false) {
          asyncSet.forEach((obj) => {
            obj.valid = false;
          });
          Object.assign(loading, {
            cancel: false,
            confirm: false,
            close: false
          });
        }
      },
      {
        flush: "sync"
      }
    );
    const perhapsClose = (type) => {
      emit(type);
      if (isFunction(props.beforeClose)) {
        const result = props.beforeClose(type, readonlyLoading);
        if (isObject(result) && isFunction(result.then)) {
          loading[type] = true;
          const obj = {
            valid: true
          };
          asyncSet.add(obj);
          return result.then(() => {
            if (obj.valid) {
              innerVisible.value = false;
              emit("update:visible", false);
            }
          }).catch(noop).finally(() => {
            loading[type] = false;
            asyncSet.delete(obj);
          });
        } else if (result === false) {
          return;
        }
      }
      innerVisible.value = false;
      emit("update:visible", false);
    };
    const onOverlayClick = () => {
      if (props.overlayClosable) {
        perhapsClose("close");
      }
    };
    const onClose = () => {
      perhapsClose("close");
    };
    const onConfirm = () => {
      perhapsClose("confirm");
    };
    const onCancel = () => {
      perhapsClose("cancel");
    };
    const buttonProps = computed(() => {
      return {
        text: {
          cancel: {
            type: "text",
            theme: "neutral",
            size: "large"
          },
          confirm: {
            type: "text",
            theme: "primary",
            size: "large"
          }
        },
        round: {
          cancel: {
            type: "pale",
            theme: "primary",
            round: true
          },
          confirm: {
            type: "default",
            theme: "primary",
            round: true
          }
        }
      }[props.buttonType];
    });
    const onVisibleHook = (name) => {
      emit("visible-hook", name);
      emit(name);
    };
    const dialogClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("headed", props.headed),
        bem.m("untitled", !props.title),
        bem.m(props.buttonType),
        props.rootClass
      );
    });
    const dialogStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const mergedPopupStyle = computed(() => {
      return stringifyStyle(
        { maxWidth: "var(--sar-dialog-max-width)" },
        props.popupStyle
      );
    });
    const __returned__ = { props, emit, bem, t, innerVisible, loading, readonlyLoading, asyncSet, perhapsClose, onOverlayClick, onClose, onConfirm, onCancel, buttonProps, onVisibleHook, dialogClass, dialogStyle, mergedPopupStyle, SarPopup, SarButton, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>