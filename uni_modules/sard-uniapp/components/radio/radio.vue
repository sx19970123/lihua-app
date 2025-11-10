<template>
  <view :class="radioClass" :style="stringifyStyle(rootStyle)" @click="onClick">
    <view :class="iconClass" :style="iconStyle">
      <slot name="icon" :checked="innerChecked">
        <sar-check-icon
          shape="circle"
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
import { defineComponent as _defineComponent } from "vue";
import { computed, provide, inject, watch, ref } from "vue";
import { classNames, createBem, stringifyStyle } from "../../utils";
import {
  radioContextSymbol
} from "./common";
import SarCheckIcon from "../check-icon/check-icon.vue";
import { useFormContext } from "../form/common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {boolean} checked 是否选中，默认值：false。
 * @property {any} value 单选按钮的值，配合单选按钮组一起使用，默认值：-。
 * @property {string} label 单选按钮标签，默认值：-。
 * @property {boolean} disabled 禁用状态，默认值：-。
 * @property {boolean} readonly 只读状态，默认值：-。
 * @property {string} size 图标的尺寸，默认值：-。
 * @property {'circle' | 'record'} type 图标类型，默认值：'circle'。
 * @property {string} checkedColor 选中时图标的颜色，默认值：-。
 * @event {(event: any) => void} click 点击时触发
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
  __name: "radio",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    checked: { type: Boolean, required: false },
    value: { type: null, required: false },
    label: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false },
    size: { type: String, required: false },
    type: { type: String, required: false },
    checkedColor: { type: String, required: false }
  },
  emits: ["click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("radio");
    const groupContext = inject(radioContextSymbol, null);
    const formContext = useFormContext();
    const innerChecked = ref(
      groupContext ? groupContext.value === props.value : props.checked
    );
    const isDisabled = computed(() => {
      return formContext?.disabled || groupContext?.disabled || props.disabled;
    });
    const isReadonly = computed(() => {
      return formContext?.readonly || groupContext?.readonly || props.readonly;
    });
    if (groupContext) {
      watch(
        () => groupContext.value,
        () => {
          innerChecked.value = groupContext.value === props.value;
        }
      );
    } else {
      watch(
        () => props.checked,
        () => {
          innerChecked.value = props.checked;
        }
      );
    }
    const onClick = (event) => {
      if (!isDisabled.value && !isReadonly.value) {
        if (groupContext) {
          groupContext.toggle(props.value);
        } else {
          innerChecked.value = true;
        }
      }
      emit("click", event);
    };
    provide(radioContextSymbol, null);
    const radioClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("checked", innerChecked.value),
        bem.m("disabled", isDisabled.value),
        bem.m("readonly", isReadonly.value),
        props.rootClass
      );
    });
    const checkIconType = computed(() => {
      const type = props.type ?? groupContext?.type ?? "circle";
      return innerChecked.value ? type === "circle" ? "check" : "dot" : "empty";
    });
    const iconColor = computed(() => {
      return innerChecked.value && !isDisabled.value ? props.checkedColor ?? groupContext?.checkedColor : void 0;
    });
    const iconClass = computed(() => {
      return classNames(
        bem.e("icon"),
        bem.em("icon", "checked", innerChecked.value)
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
    const __returned__ = { props, emit, bem, groupContext, formContext, innerChecked, isDisabled, isReadonly, onClick, radioClass, checkIconType, iconColor, iconClass, iconStyle, labelClass, get stringifyStyle() {
      return stringifyStyle;
    }, SarCheckIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>