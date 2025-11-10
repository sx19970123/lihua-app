<template>
  <sar-popup
    effect="slide-bottom"
    :visible="visible"
    :duration="duration"
    :keep-render="keepRender"
    :overlay="overlay"
    :overlay-class="overlayClass"
    :overlay-style="overlayStyle"
    :background="background"
    :transparent="transparent"
    @overlay-click="onOverlayClick"
    @before-enter="onBeforeEnter"
    @after-leave="onAfterLeave"
    @visible-hook="onVisibleHook"
  >
    <view :class="popoutClass" :style="popoutStyle" @transitionend.stop>
      <view :class="classNames(bem.e('header'), bem.em('header', props.type))">
        <view v-if="type === 'compact'" :class="bem.e('button-wrap')">
          <slot
            v-if="$slots.cancel"
            name="cancel"
            :on-click="onCancel"
            :loading="loading.cancel"
            :text="mergedCancelText"
          ></slot>
          <sar-button
            v-if="!$slots.cancel"
            type="pale-text"
            theme="neutral"
            :root-class="classNames(bem.e('header-cancel'))"
            :loading="loading.cancel"
            block
            @click="onCancel"
          >
            {{ mergedCancelText }}
          </sar-button>
        </view>
        <slot name="title-prepend"></slot>
        <view :class="bem.e('title')">
          <template v-if="title">
            <text :class="bem.e('title-text')">{{ title }}</text>
          </template>
          <slot v-else-if="$slots.title" name="title"></slot>
        </view>
        <view v-if="type === 'compact'" :class="bem.e('button-wrap')">
          <slot
            v-if="$slots.confirm"
            name="confirm"
            :on-click="onConfirm"
            :disabled="confirmDisabled"
            :loading="loading.confirm"
            :text="mergedConfirmText"
          ></slot>
          <sar-button
            v-if="!$slots.confirm"
            type="pale-text"
            theme="primary"
            :root-class="classNames(bem.e('header-confirm'))"
            :loading="loading.confirm"
            :disabled="confirmDisabled"
            block
            @click="onConfirm"
          >
            {{ mergedConfirmText }}
          </sar-button>
        </view>
        <view
          v-if="type === 'loose' && showClose"
          :class="bem.e('close')"
          @click="onCloseClick"
        >
          <sar-button type="pale-text" theme="neutral" size="large" block>
            <sar-icon family="sari" name="close" />
          </sar-button>
        </view>
      </view>
      <slot></slot>
      <slot name="visible" :whole="wholeVisible" :already="already"></slot>
      <view v-if="showFooter && type === 'loose'" :class="bem.e('footer')">
        <slot
          v-if="$slots.cancel"
          name="cancel"
          :on-click="onCancel"
          :visible="showCancel"
          :loading="loading.cancel"
          :text="mergedCancelText"
        ></slot>
        <sar-button
          v-if="!$slots.cancel && showCancel"
          type="pale"
          theme="primary"
          round
          :loading="loading.cancel"
          block
          @click="onCancel"
        >
          {{ mergedCancelText }}
        </sar-button>
        <slot
          v-if="$slots.confirm"
          name="confirm"
          :visible="showConfirm"
          :on-click="onConfirm"
          :disabled="confirmDisabled"
          :loading="loading.confirm"
          :text="mergedConfirmText"
        ></slot>
        <sar-button
          v-if="!$slots.confirm && showConfirm"
          type="default"
          theme="primary"
          round
          :loading="loading.confirm"
          :disabled="confirmDisabled"
          block
          @click="onConfirm"
        >
          {{ mergedConfirmText }}
        </sar-button>
      </view>
    </view>
  </sar-popup>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, reactive, readonly, ref, watch } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  noop,
  isFunction,
  isObject
} from "../../utils";
import SarPopup from "../popup/popup.vue";
import SarButton from "../button/button.vue";
import SarIcon from "../icon/icon.vue";
import { usePopupVisibleHookProvide } from "../popup/common";
import { useTranslate } from "../locale";
import {
  defaultPopoutProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} title 弹出框标题，默认值：-。
 * @property {boolean} showCancel 是否显示取消按钮，适用 `loose` 类型，默认值：false。
 * @property {string} cancelText 取消按钮文案，默认值：'取消'。
 * @property {boolean} showConfirm 是否显示确定按钮，适用 `loose` 类型，默认值：true。
 * @property {string} confirmText 确定按钮文案，默认值：'确定'。
 * @property {boolean} showClose 是否显示关闭按钮，适用 `loose` 类型，默认值：true。
 * @property {boolean} showFooter 是否显示底部按钮，默认值：true。
 * @property {'compact' | 'loose'} type 弹出框按钮排版方式，默认值：'loose'。
 * @property {boolean} visible 是否显示弹出框，默认值：-。
 * @property {PopoutBeforeClose} beforeClose 关闭前的回调，返回 `false` 或 `rejected` 状态的 `Promise` 可阻止关闭，默认值：-。
 * @property {number} duration 显隐动画时长，单位 ms，默认值：300。
 * @property {boolean} overlay 是否显示遮罩，默认值：true。
 * @property {string} overlayClass 添加到遮罩的类名，默认值：-。
 * @property {string} overlayStyle 添加到遮罩的样式，默认值：-。
 * @property {string} background 遮罩背景色，默认值：-。
 * @property {boolean} transparent 透明遮罩，默认值：false。
 * @property {boolean} overlayClosable 点击遮罩是否关闭，默认值：true。
 * @property {boolean} keepRender 无论刚挂载还是隐藏，都始终不设置 display 为 none，一般用于内部包含计算尺寸的组件的情况，默认值：false。
 * @event {(visible: boolean) => void} update 显隐时触发
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
  __name: "popout",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    visible: { type: Boolean, required: false },
    duration: { type: Number, required: false },
    title: { type: String, required: false },
    type: { type: String, required: false },
    showCancel: { type: Boolean, required: false },
    cancelText: { type: String, required: false },
    showConfirm: { type: Boolean, required: false },
    confirmText: { type: String, required: false },
    confirmDisabled: { type: Boolean, required: false },
    showClose: { type: Boolean, required: false },
    showFooter: { type: Boolean, required: false },
    overlay: { type: Boolean, required: false },
    overlayClass: { type: String, required: false },
    overlayStyle: { type: String, required: false },
    background: { type: String, required: false },
    transparent: { type: Boolean, required: false },
    overlayClosable: { type: Boolean, required: false },
    beforeClose: { type: Function, required: false },
    keepRender: { type: Boolean, required: false }
  }, defaultPopoutProps),
  emits: ["update:visible", "close", "cancel", "confirm", "before-enter", "enter", "after-enter", "enter-cancelled", "before-leave", "leave", "after-leave", "leave-cancelled", "visible-hook"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("popout");
    const { t } = useTranslate("popout");
    const innerVisible = ref(props.visible);
    watch(
      () => props.visible,
      () => {
        innerVisible.value = props.visible;
      }
    );
    const already = ref(props.visible);
    watch(innerVisible, () => {
      if (!already.value && innerVisible.value) {
        already.value = true;
      }
    });
    const wholeVisible = ref(props.visible);
    const onBeforeEnter = () => {
      wholeVisible.value = true;
    };
    const onAfterLeave = () => {
      wholeVisible.value = false;
    };
    const callVisibleHook = usePopupVisibleHookProvide();
    const onVisibleHook = (name) => {
      callVisibleHook(name);
      emit("visible-hook", name);
      emit(name);
    };
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
    const onCloseClick = () => {
      perhapsClose("close");
    };
    const onConfirm = () => {
      perhapsClose("confirm");
    };
    const onCancel = () => {
      perhapsClose("cancel");
    };
    const mergedConfirmText = computed(() => {
      return props.confirmText || t("confirm");
    });
    const mergedCancelText = computed(() => {
      return props.cancelText || t("cancel");
    });
    const popoutClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const popoutStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, t, innerVisible, already, wholeVisible, onBeforeEnter, onAfterLeave, callVisibleHook, onVisibleHook, loading, readonlyLoading, asyncSet, perhapsClose, onOverlayClick, onCloseClick, onConfirm, onCancel, mergedConfirmText, mergedCancelText, popoutClass, popoutStyle, get classNames() {
      return classNames;
    }, SarPopup, SarButton, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>