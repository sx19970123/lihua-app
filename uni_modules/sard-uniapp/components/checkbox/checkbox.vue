<template>
  <view :class="checkboxClass" :style="checkboxStyle" @click="onClick">
    <view :class="iconClass" :style="iconStyle">
      <slot name="icon" :checked="innerChecked">
        <sar-check-icon
          :shape="checkIconShape"
          :type="checkIconType"
          :disabled="isDisabled"
        />
      </slot>
    </view>
    <view v-if="$slots.default || label" :class="labelClass">
      <slot>{{ label }}</slot>
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, provide, inject, ref, watch } from "vue";
import { classNames, createBem, stringifyStyle } from "../../utils";
import {
  checkboxContextSymbol,
  defaultCheckboxProps
} from "./common";
import SarCheckIcon from "../check-icon/check-icon.vue";
import { useFormContext, useFormItemContext } from "../form/common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {boolean} checked 是否选中，默认值：false。
 * @property {boolean} indeterminate 是否处于不确定状态，默认值：false。
 * @property {any} value 复选框的值，配合复选框组一起使用，默认值：-。
 * @property {string} label 复选框标签，默认值：-。
 * @property {boolean} disabled 禁用状态，默认值：-。
 * @property {boolean} readonly 只读状态，默认值：-。
 * @property {string} size 图标的尺寸，默认值：-。
 * @property {'square' | 'circle'} type 图标类型，默认值：'square'。
 * @property {string} checkedColor 选中时图标的颜色，默认值：-。
 * @property {boolean} validateEvent 是否触发表单验证，默认值：true。
 * @event {(event: any) => void} click 点击时触发
 * @event {(checked: boolean) => void} update 选中状态改变时触发
 * @event {(checked: boolean) => void} change 选中状态改变时触发
 */
export default  _defineComponent({
  components: {
    SarCheckIcon,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "checkbox",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    checked: { type: Boolean, required: false },
    indeterminate: { type: Boolean, required: false },
    value: { type: null, required: false },
    label: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false },
    size: { type: String, required: false },
    type: { type: String, required: false },
    checkedColor: { type: String, required: false },
    validateEvent: { type: Boolean, required: false }
  }, defaultCheckboxProps),
  emits: ["click", "update:checked", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("checkbox");
    const groupContext = inject(checkboxContextSymbol, null);
    const formContext = useFormContext();
    const formItemContext = useFormItemContext();
    const isDisabled = computed(() => {
      return formContext?.disabled || groupContext?.disabled || props.disabled;
    });
    const isReadonly = computed(() => {
      return formContext?.readonly || groupContext?.readonly || props.readonly;
    });
    const innerChecked = ref(
      groupContext ? groupContext.value.includes(props.value) : props.checked
    );
    if (groupContext) {
      watch(
        () => groupContext.value,
        () => {
          innerChecked.value = groupContext.value.includes(props.value);
        }
      );
    } else {
      watch(
        () => props.checked,
        () => {
          innerChecked.value = props.checked;
        }
      );
      watch(innerChecked, () => {
        if (props.validateEvent) {
          formItemContext?.onChange();
        }
      });
    }
    const onClick = (event) => {
      if (!isDisabled.value && !isReadonly.value) {
        if (groupContext) {
          groupContext.toggle(props.value);
        } else {
          innerChecked.value = !innerChecked.value;
          emit("update:checked", innerChecked.value);
          emit("change", innerChecked.value);
        }
      }
      emit("click", event);
    };
    provide(checkboxContextSymbol, null);
    const checkboxClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("checked", innerChecked.value),
        bem.m("disabled", isDisabled.value),
        bem.m("readonly", isReadonly.value),
        props.rootClass
      );
    });
    const checkboxStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const checkIconShape = computed(() => {
      return props.type ?? groupContext?.type ?? "square";
    });
    const checkIconType = computed(() => {
      return innerChecked.value ? "check" : props.indeterminate ? "dash" : "empty";
    });
    const iconColor = computed(() => {
      return innerChecked.value && !isDisabled.value ? props.checkedColor ?? groupContext?.checkedColor : void 0;
    });
    const iconClass = computed(() => {
      return classNames(
        bem.e("icon"),
        bem.em("icon", "checked", innerChecked.value),
        bem.em("icon", "indeterminate", props.indeterminate)
      );
    });
    const iconStyle = computed(() => {
      return stringifyStyle({
        fontSize: props.size ?? groupContext?.size,
        color: iconColor.value
      });
    });
    const labelClass = computed(() => {
      return classNames(bem.e("label"));
    });
    const __returned__ = { props, emit, bem, groupContext, formContext, formItemContext, isDisabled, isReadonly, innerChecked, onClick, checkboxClass, checkboxStyle, checkIconShape, checkIconType, iconColor, iconClass, iconStyle, labelClass, SarCheckIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>