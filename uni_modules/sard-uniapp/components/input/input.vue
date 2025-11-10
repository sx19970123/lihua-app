<template>
  <view :class="inputClass" :style="inputStyle" @click="onClick">
    <view :class="bem.e('content')">
      <view
        v-if="internalPrepend !== 0 && $slots.prepend"
        :class="bem.e('prepend')"
      >
        <slot name="prepend"></slot>
      </view>
      <textarea
        v-if="type === 'textarea'"
        :class="
          classNames(
            bem.e('control'),
            bem.em('control', 'textarea'),
            bem.em('control', 'input-min-height', inputMinHeight),
          )
        "
        :enableNative="enableNative"
        :value="innerValue"
        :placeholder="placeholder"
        :placeholder-style="mergedPlaceholderStyle"
        :placeholder-class="placeholderClass"
        :disabled="isDisabled || isReadonly"
        :focus="focus"
        :cursor-spacing="cursorSpacing"
        :cursor="cursor"
        :confirm-type="confirmType"
        :confirm-hold="confirmHold"
        :selection-start="selectionStart"
        :selection-end="selectionEnd"
        :adjust-position="adjustPosition"
        :hold-keyboard="holdKeyboard"
        :auto-blur="autoBlur"
        :ignore-composition-event="ignoreCompositionEvent"
        :inputmode="inputmode"
        autocomplete="off"
        :fixed="fixed"
        :show-confirm-bar="showConfirmBar"
        :disable-default-padding="disableDefaultPadding"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @linechange="onLinechange"
        @confirm="onConfirm"
        @keyboardheightchange="onKeyboardheightchange"
        :auto-height="autoHeight"
        :style="controlStyle"
        :show-count="false"
      />
      <input
        v-if="type !== 'textarea' && showPassword"
        :class="classNames(bem.e('control'), bem.em('control', 'input'))"
        :enableNative="enableNative"
        :value="innerValue"
        :placeholder="placeholder"
        :placeholder-style="mergedPlaceholderStyle"
        :placeholder-class="placeholderClass"
        :disabled="isDisabled || isReadonly"
        :focus="focus"
        :cursor-spacing="cursorSpacing"
        :cursor="cursor"
        :confirm-type="confirmType"
        :confirm-hold="confirmHold"
        :selection-start="selectionStart"
        :selection-end="selectionEnd"
        :adjust-position="adjustPosition"
        :hold-keyboard="holdKeyboard"
        :auto-blur="autoBlur"
        :ignore-composition-event="ignoreCompositionEvent"
        :inputmode="inputmode"
        autocomplete="off"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @confirm="onConfirm"
        @keyboardheightchange="onKeyboardheightchange"
        :type="mergedType"
        :password="true"
        :always-embed="alwaysEmbed"
        :safe-password-cert-path="safePasswordCertPath"
        :safe-password-length="safePasswordLength"
        :safe-password-time-stamp="safePasswordTimeStamp"
        :safe-password-nonce="safePasswordNonce"
        :safe-password-salt="safePasswordSalt"
        :safe-password-custom-hash="safePasswordCustomHash"
        :random-number="randomNumber"
        :controlled="controlled"
        :always-system="alwaysSystem"
      />
      <input
        v-if="type !== 'textarea' && !showPassword"
        :class="classNames(bem.e('control'), bem.em('control', 'input'))"
        :enableNative="enableNative"
        :value="innerValue"
        :placeholder="placeholder"
        :placeholder-style="mergedPlaceholderStyle"
        :placeholder-class="placeholderClass"
        :disabled="isDisabled || isReadonly"
        :focus="focus"
        :cursor-spacing="cursorSpacing"
        :cursor="cursor"
        :confirm-type="confirmType"
        :confirm-hold="confirmHold"
        :selection-start="selectionStart"
        :selection-end="selectionEnd"
        :adjust-position="adjustPosition"
        :hold-keyboard="holdKeyboard"
        :auto-blur="autoBlur"
        :ignore-composition-event="ignoreCompositionEvent"
        :inputmode="inputmode"
        autocomplete="off"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @confirm="onConfirm"
        @keyboardheightchange="onKeyboardheightchange"
        :type="mergedType"
        :password="false"
        :always-embed="alwaysEmbed"
        :safe-password-cert-path="safePasswordCertPath"
        :safe-password-length="safePasswordLength"
        :safe-password-time-stamp="safePasswordTimeStamp"
        :safe-password-nonce="safePasswordNonce"
        :safe-password-salt="safePasswordSalt"
        :safe-password-custom-hash="safePasswordCustomHash"
        :random-number="randomNumber"
        :controlled="controlled"
        :always-system="alwaysSystem"
      />
      <view :class="bem.e('tools')">
        <view
          v-show="clearVisible"
          :class="bem.e('clear')"
          @click.stop="onClearClick"
          @mousedown="onClearMouseDown"
          @touchstart="onClearTouchStart"
          @touchend="onClearTouchEnd"
          @touchcancel="onClearTouchEnd"
        >
          <sar-icon family="sari" name="x-circle-fill" />
        </view>
        <view
          v-if="mergedShowEye"
          :class="bem.e('eye')"
          @click.stop="onEyeClick"
        >
          <sar-icon family="sari" :name="eyeIcon" />
        </view>
        <view v-if="$slots.append" :class="bem.e('append')">
          <slot name="append"></slot>
        </view>
      </view>
      <slot name="addon"></slot>
    </view>
    <view v-if="showCount" :class="bem.e('count')">
      {{ innerValue.length }} / {{ maxlength }}
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref, watch } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import SarIcon from "../icon/icon.vue";
import { useFormContext, useFormItemContext } from "../form/common";
import {
  defaultInputProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string | number} modelValue 输入框值，默认值：-。
 * @property {boolean} clearable 是否显示清空按钮，默认值：false。
 * @property {boolean} showClearOnlyFocus 是否只在聚焦时显示清空按钮，默认值：false。
 * @property {boolean} showCount 是否展示字数，默认值：false。
 * @property {boolean} inlaid 嵌入式状态，默认值：false。
 * @property {boolean} borderless 是否隐藏边框，默认值：false。
 * @property {boolean} readonly 只读状态，默认值：false。
 * @property {boolean} focused 是否显示获焦样式，用于结合自定义键盘使用时显示高亮效果，默认值：false。
 * @property {string} minHeight 输入框最小高度，默认值：-。
 * @property {string} placeholder 输入框占位符内容，默认值：-。
 * @property {string} placeholderStyle 输入框占位符样式，默认值：-。
 * @property {string} placeholderClass 输入框占位符类名，默认值：-。
 * @property {boolean} disabled 禁用状态，默认值：false。
 * @property {number} maxlength 最大输入长度，设置为 -1 的时候不限制最大长度，默认值：140。
 * @property {boolean} focus 获取焦点，默认值：-。
 * @property {number} cursorSpacing 指定光标与键盘的距离，默认值：30。
 * @property {number} cursor 指定 focus 时的光标位置，默认值：-1。
 * @property {"send" | "search" | "next" | "go" | "done"} confirmType 设置键盘右下角按钮的文字，默认值：'done'。
 * @property {boolean} confirmHold 点击键盘右下角按钮时是否保持键盘不收起，默认值：false。
 * @property {number} selectionStart 光标起始位置，默认值：-1。
 * @property {number} selectionEnd 光标结束位置，默认值：-1。
 * @property {boolean} adjustPosition 键盘弹起时，是否自动上推页面，默认值：true。
 * @property {boolean} holdKeyboard focus 时，点击页面的时候不收起键盘，默认值：false。
 * @property {boolean} autoBlur 键盘收起时，是否自动失去焦点，默认值：false。
 * @property {boolean} ignoreCompositionEvent 是否忽略组件内对文本合成系统事件的处理，默认值：true。
 * @property {'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'} inputmode 用户在编辑元素或其内容时可能输入的数据类型的提示，默认值：'text'。
 * @property {boolean} autoHeight 文本域自动高度，默认值：false。
 * @property {boolean} fixed 如果 `textarea` 是在一个 `position:fixed` 的区域，需要显示指定属性 `fixed` 为 `true`，默认值：false。
 * @property {boolean} showConfirmBar 是否显示键盘上方带有”完成“按钮那一栏，默认值：true。
 * @property {boolean} disableDefaultPadding 是否去掉 iOS 下的默认内边距，默认值：false。
 * @property {'text' | 'password' | 'textarea' | 'number' |'idcard' | 'digit' | 'tel' | 'safe-password' | 'nickname'} type 输入框类型，默认值：'text'。
 * @property {boolean} alwaysEmbed 强制 input 处于同层状态，默认值：-。
 * @property {string} safePasswordCertPath 安全键盘加密公钥的路径，只支持包内路径，默认值：-。
 * @property {number} safePasswordLength 安全键盘输入密码长度，默认值：-。
 * @property {number} safePasswordTimeStamp 安全键盘加密时间戳，默认值：-。
 * @property {string} safePasswordNonce 安全键盘加密盐值，默认值：-。
 * @property {string} safePasswordSalt 安全键盘计算 `hash` 盐值，若指定 `custom-hash` 则无效，默认值：-。
 * @property {string} safePasswordCustomHash 安全键盘计算 `hash` 的算法表达式，默认值：-。
 * @property {boolean} randomNumber 当 `type` 为 `number, digit, idcard` 数字键盘是否随机排列，默认值：false。
 * @property {boolean} controlled 是否为受控组件。为 `true` 时，value 内容会完全受 `setData` 控制，默认值：false。
 * @property {boolean} alwaysSystem 是否强制使用系统键盘和 `Web-view `创建的 `input` 元素，默认值：false。
 * @property {boolean} validateEvent 是否触发表单验证，默认值：true。
 * @property {boolean} showEye `type` 为 `password` 时，是否显示眼睛图标按钮，默认值：false。
 * @property {boolean} enableNative (支付宝小程序)是否启用原生input元素，默认值：false。
 * @event {(value: string) => void} update 输入框值改变时触发
 * @event {(value: string) => void} input 输入框值改变时触发
 * @event {(value: string) => void} change 键盘非聚焦状态且内容改变时触发
 * @event {() => void} clear 点击清除按钮时触发
 * @event {(event: any) => void} focus 聚焦时触发
 * @event {(event: any) => void} blur 失焦时触发
 * @event {(event: any) => void} linechange 输入框行数变化时触发
 * @event {(event: any) => void} confirm 点击完成时触发
 * @event {(event: any) => void} keyboardheightchange 键盘高度发生变化的时候触发
 */
export default  _defineComponent({
  components: {
    SarIcon,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "input",
  props:  _mergeDefaults({
    enableNative: { type: Boolean, required: false },
    placeholder: { type: String, required: false },
    placeholderStyle: { type: String, required: false },
    placeholderClass: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    maxlength: { type: Number, required: false },
    focus: { type: Boolean, required: false },
    cursorSpacing: { type: Number, required: false },
    cursor: { type: Number, required: false },
    confirmType: { type: String, required: false },
    confirmHold: { type: Boolean, required: false },
    selectionStart: { type: Number, required: false },
    selectionEnd: { type: Number, required: false },
    adjustPosition: { type: Boolean, required: false },
    holdKeyboard: { type: Boolean, required: false },
    autoBlur: { type: Boolean, required: false },
    ignoreCompositionEvent: { type: Boolean, required: false },
    inputmode: { type: String, required: false },
    autoHeight: { type: Boolean, required: false },
    fixed: { type: Boolean, required: false },
    showConfirmBar: { type: Boolean, required: false },
    disableDefaultPadding: { type: Boolean, required: false },
    inputMinHeight: { type: Boolean, required: false },
    type: { type: String, required: false },
    alwaysEmbed: { type: Boolean, required: false },
    safePasswordCertPath: { type: String, required: false },
    safePasswordLength: { type: String, required: false },
    safePasswordTimeStamp: { type: String, required: false },
    safePasswordNonce: { type: String, required: false },
    safePasswordSalt: { type: String, required: false },
    safePasswordCustomHash: { type: String, required: false },
    randomNumber: { type: Boolean, required: false },
    controlled: { type: Boolean, required: false },
    alwaysSystem: { type: Boolean, required: false },
    rootClass: { type: String, required: false },
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    modelValue: { type: [String, Number], required: false },
    clearable: { type: Boolean, required: false },
    showClearOnlyFocus: { type: Boolean, required: false },
    showCount: { type: Boolean, required: false },
    inlaid: { type: Boolean, required: false },
    borderless: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false },
    focused: { type: Boolean, required: false },
    minHeight: { type: String, required: false },
    validateEvent: { type: Boolean, required: false },
    showEye: { type: Boolean, required: false },
    internalPrepend: { type: Number, required: false }
  }, defaultInputProps),
  emits: ["update:model-value", "change", "input", "clear", "focus", "blur", "linechange", "confirm", "keyboardheightchange", "click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("input");
    const formContext = useFormContext();
    const formItemContext = useFormItemContext();
    const isDisabled = computed(() => {
      return formContext?.disabled || props.disabled;
    });
    const isReadonly = computed(() => {
      return formContext?.readonly || props.readonly;
    });
    const innerValue = ref(String(props.modelValue ?? ""));
    const setInnerValue = (value) => {
      innerValue.value = value;
      emit("update:model-value", value);
      emit("input", value);
    };
    watch(
      () => props.modelValue,
      () => {
        innerValue.value = String(props.modelValue ?? "");
        if (props.validateEvent) {
          formItemContext?.onChange();
        }
      }
    );
    const onInput = (event) => {
      let value = event.detail.value;
      if (props.maxlength >= 0) {
        value = value.slice(0, props.maxlength);
      }
      setInnerValue(value);
      return value;
    };
    const innerFocused = ref(props.focus || props.focused);
    watch([() => props.focus, () => props.focused], () => {
      innerFocused.value = props.focus || props.focused;
    });
    let oldValue = "";
    const onFocus = (event) => {
      oldValue = innerValue.value;
      innerFocused.value = true;
      emit("focus", event);
    };
    const onBlur = (event) => {
      innerFocused.value = false;
      emit("blur", event);
      if (props.validateEvent) {
        formItemContext?.onBlur();
      }
      if (oldValue !== innerValue.value) {
        emit("change", innerValue.value);
      }
    };
    const clearVisible = computed(() => {
      const visibleBase = props.clearable && innerValue.value && !isDisabled.value && !isReadonly.value;
      return props.showClearOnlyFocus ? holdupClear.value || innerFocused.value && visibleBase : visibleBase;
    });
    const holdupClear = ref(false);
    const onClearTouchStart = () => {
      holdupClear.value = true;
    };
    const onClearTouchEnd = () => {
      holdupClear.value = false;
    };
    const onClearMouseDown = () => {
      // #ifdef WEB
      onClearTouchStart();
      const upHandler = () => {
        onClearTouchEnd();
        document.removeEventListener("mouseup", upHandler);
      };
      document.addEventListener("mouseup", upHandler);
      // #endif
    };
    const onClearClick = () => {
      setInnerValue("");
      emit("clear");
    };
    const onLinechange = (event) => {
      emit("linechange", event);
    };
    const onConfirm = (event) => {
      emit("confirm", event);
    };
    const onKeyboardheightchange = (event) => {
      emit("keyboardheightchange", event);
    };
    const onClick = (event) => {
      emit("click", event);
    };
    const isPlainText = ref(false);
    const eyeIcon = computed(() => isPlainText.value ? "eye" : "eye-slash");
    const onEyeClick = () => {
      isPlainText.value = !isPlainText.value;
    };
    const showPassword = computed(() => {
      return props.type === "password" && isPlainText.value === false;
    });
    const mergedType = computed(() => {
      return showPassword.value ? "password" : props.type === "password" ? "text" : props.type;
    });
    const mergedShowEye = computed(() => props.type === "password" && props.showEye);
    const inputClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("inlaid", props.inlaid),
        bem.m("borderless", props.borderless),
        bem.m("disabled", isDisabled.value),
        bem.m("readonly", isReadonly.value),
        bem.m("focused", innerFocused.value),
        props.rootClass
      );
    });
    const inputStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const controlStyle = computed(() => {
      return stringifyStyle({
        minHeight: props.minHeight,
        height: !props.autoHeight && props.minHeight
      });
    });
    const mergedPlaceholderStyle = computed(() => {
      return stringifyStyle(
        {
          color: "var(--sar-input-placeholder-color)",
          fontSize: "var(--sar-input-control-font-size)",
          lineHeight: "var(--sar-input-control-line-height)"
        },
        props.inputMinHeight ? {
          minHeight: "var(--sar-input-control-input-height)",
          lineHeight: "var(--sar-input-control-input-height)"
        } : null,
        props.placeholderStyle
      );
    });
    const __returned__ = { props, emit, bem, formContext, formItemContext, isDisabled, isReadonly, innerValue, setInnerValue, onInput, innerFocused, get oldValue() {
      return oldValue;
    }, set oldValue(v) {
      oldValue = v;
    }, onFocus, onBlur, clearVisible, holdupClear, onClearTouchStart, onClearTouchEnd, onClearMouseDown, onClearClick, onLinechange, onConfirm, onKeyboardheightchange, onClick, isPlainText, eyeIcon, onEyeClick, showPassword, mergedType, mergedShowEye, inputClass, inputStyle, controlStyle, mergedPlaceholderStyle, get classNames() {
      return classNames;
    }, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>