<template>
  <view :class="searchClass" :style="searchStyle" @click="onClick">
    <view v-if="$slots.prepend" :class="bem.e('prepend')">
      <slot name="prepend"></slot>
    </view>
    <view :class="bem.e('input-wrapper')">
      <sar-input
        :model-value="innerValue"
        clearable
        confirm-type="search"
        showClearOnlyFocus
        :readonly="readonly"
        :disabled="disabled"
        :placeholder="placeholder"
        borderless
        :root-class="inputClass"
        :root-style="inputStyle"
        :focus="focus"
        @update:model-value="onInput"
        @change="onChange"
        @confirm="onConfirm"
        @clear="onClear"
        @focus="onFocus"
        @blur="onBlur"
      >
        <template #prepend>
          <slot name="input-prepend">
            <sar-icon family="sari" name="search" :root-class="bem.e('icon')" />
          </slot>
        </template>
        <template #append>
          <slot name="input-append"></slot>
        </template>
      </sar-input>
    </view>
    <view v-if="cancel || search || $slots.append" :class="bem.e('append')">
      <sar-button
        v-if="cancel"
        type="pale-text"
        root-style="height: auto"
        block
        @click="onCancel"
      >
        {{ cancel }}
      </sar-button>
      <sar-button
        v-if="search"
        type="pale-text"
        root-style="height: auto"
        block
        @click="onConfirm"
      >
        {{ search }}
      </sar-button>
      <slot name="append"></slot>
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref, watch } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import SarInput from "../input/input.vue";
import SarIcon from "../icon/icon.vue";
import SarButton from "../button/button.vue";
import {
  defaultSearchProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} modelValue 输入框值，默认值：-。
 * @property {string} placeholder 输入框占位符内容，默认值：-。
 * @property {'round' | 'square'} shape 输入框形状，默认值：'square'。
 * @property {string} background 搜索框外部的背景色，默认值：-。
 * @property {string} inputBackground 搜索框内部的背景色，默认值：-。
 * @property {string} inputColor 输入框文本颜色，默认值：-。
 * @property {boolean} disabled 禁用状态，默认值：false。
 * @property {boolean} readonly 只读状态，默认值：false。
 * @property {'left' | 'center' | 'right'} align 输入框文字对齐，默认值：'left'。
 * @property {string} cancel 定义取消按钮，默认值：-。
 * @property {string} search 定义搜索按钮，默认值：-。
 * @property {boolean} focus 获取焦点，默认值：false。
 * @event {(value: string) => void} update 输入框值改变时触发
 * @event {(value: string) => void} input 输入框值改变时触发
 * @event {(value: string) => void} change 键盘非聚焦状态且内容改变时触发
 * @event {() => void} cancel 点击取消按钮时触发
 * @event {(value: string) => void} search 点击确定按钮时触发
 * @event {(event: any) => void} click 点击组件时触发
 * @event {() => void} clear 点击清除按钮时触发
 * @event {(event: any) => void} focus 聚焦时触发
 * @event {(event: any) => void} blur 失焦时触发
 */
export default  _defineComponent({
  components: {
    SarInput,
    SarIcon,
    SarButton,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "search",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    modelValue: { type: String, required: false },
    placeholder: { type: String, required: false },
    shape: { type: String, required: false },
    background: { type: String, required: false },
    inputBackground: { type: String, required: false },
    inputColor: { type: String, required: false },
    readonly: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    align: { type: String, required: false },
    cancel: { type: String, required: false },
    search: { type: String, required: false },
    focus: { type: Boolean, required: false }
  }, defaultSearchProps),
  emits: ["update:model-value", "input", "change", "cancel", "search", "click", "clear", "focus", "blur"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("search");
    const innerValue = ref(props.modelValue ?? "");
    watch(
      () => props.modelValue,
      () => {
        innerValue.value = props.modelValue ?? "";
      }
    );
    const onInput = (value) => {
      innerValue.value = value;
      emit("update:model-value", value);
      emit("input", value);
    };
    const onChange = (value) => {
      emit("change", value);
    };
    const onConfirm = () => {
      emit("search", innerValue.value);
    };
    const onCancel = () => {
      innerValue.value = "";
      emit("cancel");
    };
    const onClick = (event) => {
      emit("click", event);
    };
    const onClear = () => {
      emit("clear");
    };
    const onFocus = (event) => {
      emit("focus", event);
    };
    const onBlur = (event) => {
      emit("blur", event);
    };
    const searchClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("show-action", props.cancel || props.search),
        bem.m("disabled", props.disabled),
        props.rootClass
      );
    });
    const searchStyle = computed(() => {
      return stringifyStyle(
        {
          backgroundColor: props.background
        },
        props.rootStyle
      );
    });
    const inputClass = computed(() => {
      return classNames(bem.e("input"), bem.em("input", props.shape));
    });
    const inputStyle = computed(() => {
      return stringifyStyle({
        textAlign: props.align,
        color: props.inputColor,
        backgroundColor: props.inputBackground
      });
    });
    const __returned__ = { props, emit, bem, innerValue, onInput, onChange, onConfirm, onCancel, onClick, onClear, onFocus, onBlur, searchClass, searchStyle, inputClass, inputStyle, SarInput, SarIcon, SarButton };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>