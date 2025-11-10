<template>
  <view :class="passwordInputClass" :style="passwordInputStyle">
    <view
      v-for="item in items"
      :key="item.index"
      :class="classNames(bem.e('item'), bem.em('item', 'active', item.active))"
    >
      <template v-if="item.index < innerValue.length">
        <view v-if="plainText" :class="bem.e('plaintext')">
          {{ innerValue[item.index] }}
        </view>
        <view v-else :class="bem.e('ciphertext')"></view>
      </template>
      <view
        v-if="innerFocused && item.index === innerValue.length"
        :class="bem.e('cursor')"
      ></view>
    </view>

    <view v-if="!customKeyboard" :class="bem.e('input-wrapper')">
      <input
        type="number"
        :class="bem.e('input')"
        :disabled="isDisabled || isReadonly"
        :value="innerValue"
        :maxlength="length"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      />
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref, watch } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import { useFormContext, useFormItemContext } from "../form/common";
import {
  defaultPasswordInputProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} modelValue 密码输入框值，默认值：-。
 * @property {number} length 密码长度，默认值：6。
 * @property {'border' | 'underline'} type 密码输入框类型，默认值：'border'。
 * @property {number | string} gap 密码输入框项间距，默认值：-。
 * @property {boolean} plainText 是否明文显示，默认值：false。
 * @property {boolean} focused 是否获取焦点，默认值：false。
 * @property {boolean} customKeyboard 是否使用自定义键盘，默认值：false。
 * @property {boolean} disabled 禁用状态，默认值：false。
 * @property {boolean} readonly 只读状态，默认值：false。
 * @property {boolean} validateEvent 是否触发表单验证，默认值：true。
 * @event {(value: string) => void} update 输入框值改变时触发
 * @event {(value: string) => void} change 输入框值改变时触发
 * @event {(focused: boolean) => void} updat 输入框聚焦/失焦时触发
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "password-input",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    modelValue: { type: String, required: false },
    length: { type: Number, required: false },
    type: { type: String, required: false },
    gap: { type: [Number, String], required: false },
    plainText: { type: Boolean, required: false },
    focused: { type: Boolean, required: false },
    customKeyboard: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false },
    validateEvent: { type: Boolean, required: false }
  }, defaultPasswordInputProps),
  emits: ["update:model-value", "change", "updat:focused"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("password-input");
    const formContext = useFormContext();
    const formItemContext = useFormItemContext();
    const isDisabled = computed(() => {
      return formContext?.disabled || props.disabled;
    });
    const isReadonly = computed(() => {
      return formContext?.readonly || props.readonly;
    });
    const innerValue = ref(props.modelValue ?? "");
    watch(
      () => props.modelValue,
      () => {
        innerValue.value = props.modelValue ?? "";
        if (props.validateEvent) {
          formItemContext?.onChange();
        }
      }
    );
    const onInput = (event) => {
      const value = event.detail.value;
      innerValue.value = value;
      emit("update:model-value", value);
      emit("change", value);
      return value;
    };
    const innerFocused = ref(props.focused);
    watch(
      () => props.focused,
      () => {
        innerFocused.value = props.focused;
      }
    );
    const onFocus = () => {
      innerFocused.value = true;
      emit("updat:focused", true);
    };
    const onBlur = () => {
      innerFocused.value = false;
      emit("updat:focused", false);
      if (props.validateEvent) {
        formItemContext?.onBlur();
      }
    };
    const items = computed(() => {
      const valueLength = innerValue.value.length;
      return Array(props.length).fill(0).map((_, i) => {
        return {
          index: i,
          active: innerFocused.value && (i === valueLength || i === valueLength - 1 && i === props.length - 1)
        };
      });
    });
    const isTight = computed(() => {
      return props.gap === 0 || typeof props.gap === "string" && parseInt(props.gap) === 0;
    });
    const passwordInputClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("readonly", isReadonly.value),
        bem.m("disabled", isDisabled.value),
        bem.m(props.type, !isTight.value),
        bem.m(`tight-${props.type}`, isTight.value),
        props.rootClass
      );
    });
    const passwordInputStyle = computed(() => {
      return stringifyStyle(
        {
          gap: props.gap
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, emit, bem, formContext, formItemContext, isDisabled, isReadonly, innerValue, onInput, innerFocused, onFocus, onBlur, items, isTight, passwordInputClass, passwordInputStyle, get classNames() {
      return classNames;
    } };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>