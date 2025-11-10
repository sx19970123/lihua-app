<template>
  <view :class="popoutInputClass" :style="popoutInputStyle">
    <sar-input
      inlaid
      :model-value="innerValue"
      :placeholder="placeholder"
      :readonly="isReadonly"
      :disabled="isDisabled"
      :clearable="clearable"
      :validate-event="false"
      :type="multiline ? 'textarea' : undefined"
      :auto-height="multiline"
      :input-min-height="multiline"
      :internal-prepend="$slots.prepend ? 1 : 0"
      v-bind="inputProps"
      @clear="onClear"
      @change="onChange"
    >
      <template #prepend>
        <slot name="prepend"></slot>
      </template>
      <template #append>
        <slot name="append"></slot>
        <view :class="bem.e('append')">
          <view v-if="loading" :class="bem.e('loading')">
            <sar-loading />
          </view>
          <view v-if="!isReadonly" :class="arrowClass">
            <slot
              v-if="internalArrow !== 0 && $slots.arrow"
              name="arrow"
            ></slot>
            <sar-icon v-else :family="arrowFamily" :name="arrow" />
          </view>
        </view>
      </template>
      <template #addon>
        <view
          :class="bem.e('seal')"
          @mousedown="onSealMouseDown"
          @touchstart="onSealTouchStart"
          @touchend="onSealTouchEnd"
          @touchcancel="onSealTouchEnd"
          @click="onSealClick"
        />
      </template>
    </sar-input>

    <slot></slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref, watch } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import SarInput from "../input/input.vue";
import SarIcon from "../icon/icon.vue";
import { useFormContext } from "../form/common";
import {
  defaultPopoutInputProps
} from "./common";
import SarLoading from "../loading/loading.vue";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} modelValue 输入框值，默认值：-。
 * @property {string} placeholder 输入框占位符内容，默认值：-。
 * @property {boolean} disabled 禁用状态，默认值：false。
 * @property {boolean} readonly 只读状态，默认值：false。
 * @property {boolean} loading 加载状态，默认值：false。
 * @property {boolean} clearable 是否显示清空按钮，默认值：false。
 * @property {boolean} multiline 是否多行输入框，默认值：false。
 * @property {string} arrow 自定义箭头图标名，默认值：'caret-right'。
 * @property {string} arrowFamily 自定义箭头图标字体，默认值：'sari'。
 * @property {InputProps} inputProps 自定义输入框组件属性，默认值：-。
 * @event {() => void} click 点击输入框时触发，只读和禁用不触发
 * @event {(value: string) => void} update 输入框值改变时触发
 * @event {(value: string) => void} change 输入框值改变时触发
 * @event {() => void} clear 点击清除按钮时触发
 */
export default  _defineComponent({
  components: {
    SarInput,
    SarIcon,
    SarLoading,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "popout-input",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    modelValue: { type: null, required: false },
    placeholder: { type: String, required: false },
    readonly: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    clearable: { type: Boolean, required: false },
    loading: { type: Boolean, required: false },
    multiline: { type: Boolean, required: false },
    arrow: { type: String, required: false },
    arrowFamily: { type: String, required: false },
    internalArrow: { type: Number, required: false },
    inputProps: { type: Object, required: false }
  }, defaultPopoutInputProps),
  emits: ["click", "update:model-value", "change", "clear"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("popout-input");
    const formContext = useFormContext();
    const isDisabled = computed(() => {
      return formContext?.disabled || props.disabled;
    });
    const isReadonly = computed(() => {
      return formContext?.readonly || props.readonly;
    });
    const innerValue = ref(props.modelValue);
    const setInnerValue = (value) => {
      innerValue.value = value;
      emit("update:model-value", value);
      emit("change", value);
    };
    watch(
      () => props.modelValue,
      () => {
        innerValue.value = props.modelValue;
      }
    );
    const onChange = (value) => {
      setInnerValue(value);
    };
    const onClear = () => {
      setInnerValue("");
      emit("clear");
    };
    const clearVisible = computed(() => {
      return props.clearable && innerValue.value && !isDisabled.value && !isReadonly.value;
    });
    const isSealDown = ref(false);
    const interoperable = computed(() => {
      return !isDisabled.value && !isReadonly.value && !props.loading;
    });
    const onSealTouchStart = () => {
      if (interoperable.value) {
        isSealDown.value = true;
      }
    };
    const onSealTouchEnd = () => {
      if (interoperable.value) {
        isSealDown.value = false;
      }
    };
    const onSealMouseDown = () => {
      // #ifdef WEB
      onSealTouchStart();
      const upHandler = () => {
        onSealTouchEnd();
        document.removeEventListener("mouseup", upHandler);
      };
      document.addEventListener("mouseup", upHandler);
      // #endif
    };
    const onSealClick = (event) => {
      if (interoperable.value) {
        emit("click", event);
      }
    };
    const popoutInputClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("down", isSealDown.value),
        bem.m("loading", props.loading),
        bem.m("readonly", isReadonly.value),
        bem.m("disabled", isDisabled.value),
        props.rootClass
      );
    });
    const popoutInputStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const arrowClass = computed(() => {
      return classNames(
        bem.e("arrow"),
        bem.em("arrow", "show-clear", clearVisible.value)
      );
    });
    const __returned__ = { props, emit, bem, formContext, isDisabled, isReadonly, innerValue, setInnerValue, onChange, onClear, clearVisible, isSealDown, interoperable, onSealTouchStart, onSealTouchEnd, onSealMouseDown, onSealClick, popoutInputClass, popoutInputStyle, arrowClass, SarInput, SarIcon, SarLoading };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>