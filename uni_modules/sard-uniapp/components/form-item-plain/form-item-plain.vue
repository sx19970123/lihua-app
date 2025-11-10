<template>
  <view :class="itemClass" :style="rootStyle">
    <slot></slot>
    <slot
      name="custom"
      :validate-state="validateState"
      :should-show-star="shouldShowStar"
      :validate-message="validateMessage"
      :should-show-error="shouldShowError"
      :direction="direction"
      :label-align="labelAlign"
      :label-valign="labelValign"
      :star-position="starPosition"
      :label-width="labelWidth"
    ></slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { useFormItem } from "../form-item/useFormItem";
import { defaultFormItemProps } from "../form/common";
import { classNames } from "../../utils";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {'horizontal' | 'vertical'} direction 表单排列方向，默认值：'horizontal'。
 * @property {string} labelWidth 标签宽度，默认值：-。
 * @property {'start' | 'center' | 'end'} labelAlign 标签水平对齐方式，默认值：'start'。
 * @property {'start' | 'center' | 'end'} labelValign 标签垂直对齐方式，默认值：'start'。
 * @property {'left' | 'right'} starPosition 必填星号在标签的左边或右边，默认值：'left'。
 * @property {'left' | 'right'} contentPosition 内容位置，默认值：'left'。
 * @property {string} label 标签文本，默认值：-。
 * @property {boolean} required 是否为必填项，如不设置，则会根据校验规则确认，默认值：-。
 * @property {FieldName} name 表单域 `model` 字段，在使用 `validate、reset` 方法的情况下，该属性是必填的。，默认值：-。
 * @property {Rule | Rule[]} rules 表单验证规则，默认值：-。
 * @property {TriggerType} validateTrigger 设置字段校验的时机，默认值：change。
 * @property {string} error 表单域验证错误时的提示信息。设置该值会导致表单验证状态变为 `error`，并显示该错误信息。，默认值：-。
 * @property {boolean} showError 是否显示校验错误信息，默认值：true。
 * @property {boolean} inlaid 去掉边框和内边距，用于嵌入到其他组件中，默认值：false。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "form-item-plain",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    direction: { type: String, required: false },
    labelWidth: { type: String, required: false },
    labelAlign: { type: String, required: false },
    labelValign: { type: String, required: false },
    starPosition: { type: String, required: false },
    label: { type: String, required: false },
    hideStar: { type: Boolean, required: false },
    contentPosition: { type: String, required: false },
    required: { type: Boolean, required: false, skipCheck: true },
    name: { type: [String, Number, Array], required: false },
    rules: { type: [Object, Array], required: false },
    validateTrigger: { type: [String, Array], required: false },
    error: { type: String, required: false },
    showError: { type: Boolean, required: false },
    inlaid: { type: Boolean, required: false }
  }, defaultFormItemProps()),
  setup(__props, { expose: __expose }) {
    const props = __props;
    const {
      expose,
      fieldId,
      validateState,
      shouldShowStar,
      validateMessage,
      shouldShowError,
      direction,
      labelAlign,
      labelValign,
      starPosition,
      labelWidth
    } = useFormItem(props);
    const itemClass = computed(() => {
      return classNames(props.rootClass, fieldId);
    });
    __expose(expose);
    const __returned__ = { props, expose, fieldId, validateState, shouldShowStar, validateMessage, shouldShowError, direction, labelAlign, labelValign, starPosition, labelWidth, itemClass };
    return __returned__;
  }
});
</script>
