<template>
  <view :class="switchClass" :style="switchStyle" @click="onClick">
    <view :class="bem.e('thumb')">
      <sar-loading v-if="innerLoading" size="0.5em" />
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref, watch } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import SarLoading from "../loading/loading.vue";
import { useFormContext, useFormItemContext } from "../form/common";
import {
  defaultSwitchProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {any} modelValue 开关选中状态，默认值：-。
 * @property {boolean} disabled 禁用状态，默认值：false。
 * @property {boolean} readonly 只读状态，默认值：false。
 * @property {boolean} loading 加载状态，默认值：-。
 * @property {string} size 开关大小，默认值：-。
 * @property {string} checkedColor 开启时的颜色，默认值：-。
 * @property {string} uncheckedColor 关闭时的颜色，默认值：-。
 * @property {any} checkedValue 开启时的值，默认值：true。
 * @property {any} uncheckedValue 关闭时的值，默认值：false。
 * @property {(value: any) => Promise\<any>} beforeUpdate 用于异步切换，默认值：-。
 * @property {boolean} validateEvent 是否触发表单验证，默认值：true。
 * @event {(event: any) => void} click 点击按钮时触发，加载和禁用状态不会触发
 * @event {(loading: boolean) => void} update 加载状态切换时触发
 * @event {(value: any) => void} change 开关状态切换时触发
 */
export default  _defineComponent({
  components: {
    SarLoading,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "switch",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    modelValue: { type: null, required: false },
    disabled: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false },
    loading: { type: Boolean, required: false },
    size: { type: String, required: false },
    checkedColor: { type: String, required: false },
    uncheckedColor: { type: String, required: false },
    checkedValue: { type: null, required: false },
    uncheckedValue: { type: null, required: false },
    beforeUpdate: { type: Function, required: false },
    validateEvent: { type: Boolean, required: false }
  }, defaultSwitchProps),
  emits: ["click", "update:model-value", "change", "update:loading"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("switch");
    const formContext = useFormContext();
    const formItemContext = useFormItemContext();
    const isDisabled = computed(() => {
      return formContext?.disabled || props.disabled;
    });
    const isReadonly = computed(() => {
      return formContext?.readonly || props.readonly;
    });
    const innerValue = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => {
        innerValue.value = props.modelValue;
        if (props.validateEvent) {
          formItemContext?.onChange();
        }
      }
    );
    const innerLoading = ref(props.loading);
    watch(
      () => props.loading,
      () => {
        innerLoading.value = props.loading;
      }
    );
    const isChecked = computed(() => {
      return innerValue.value === props.checkedValue;
    });
    const onClick = async (event) => {
      emit("click", event);
      if (isDisabled.value || isReadonly.value || innerLoading.value) {
        return;
      }
      const nextValue = innerValue.value === props.checkedValue ? props.uncheckedValue : props.checkedValue;
      if (props.beforeUpdate) {
        try {
          innerLoading.value = true;
          await props.beforeUpdate(nextValue);
        } catch {
          return;
        } finally {
          innerLoading.value = false;
        }
      }
      innerValue.value = nextValue;
      emit("update:model-value", nextValue);
      emit("change", nextValue);
    };
    const switchClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("checked", isChecked.value),
        bem.m("readonly", isReadonly.value),
        bem.m("disabled", isDisabled.value),
        bem.m("loading", innerLoading.value),
        props.rootClass
      );
    });
    const switchStyle = computed(() => {
      return stringifyStyle(
        {
          fontSize: props.size,
          backgroundColor: isChecked.value ? props.checkedColor : props.uncheckedColor
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, emit, bem, formContext, formItemContext, isDisabled, isReadonly, innerValue, innerLoading, isChecked, onClick, switchClass, switchStyle, SarLoading };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>