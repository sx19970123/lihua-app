<template>
  <view :class="formClass" :style="formStyle">
    <slot></slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import {
  defaultFormProps
} from "./common";
import { useForm } from "./useForm";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {Record\<string, any>} model 表单数据对象，默认值：-。
 * @property {FormRules} rules 表单验证规则，默认值：-。
 * @property {TriggerType} validateTrigger 设置字段校验的时机，默认值：change。
 * @property {boolean} validateOnRuleChange 是否在 `rules` 属性改变后立即触发一次验证，默认值：true。
 * @property {'horizontal' | 'vertical'} direction 表单排列方向，默认值：'horizontal'。
 * @property {string} labelWidth 标签宽度，默认值：-。
 * @property {'start' | 'center' | 'end'} labelAlign 标签水平对齐方式，默认值：'start'。
 * @property {'start' | 'center' | 'end'} labelValign 标签垂直对齐方式，默认值：'start'。
 * @property {'left' | 'right'} starPosition 必填星号在标签的左边或右边，默认值：'left'。
 * @property {boolean} hideStar 是否隐藏必填时的星号，默认值：false。
 * @property {'left' | 'right'} contentPosition 内容位置，默认值：'left'。
 * @property {boolean} showError 是否显示校验错误信息，默认值：true。
 * @property {boolean} scrollToFirstError 当校验失败时，滚动到第一个错误表单项，默认值：false。
 * @property {[ScrollIntoViewOptions](../utilities/geometry#ScrollIntoViewOptions)} scrollIntoViewOptions 自定义滚动配置选项，默认值：{position: 'nearest', startOffset: 0, endOffset: 0}。
 * @property {boolean} disabled 是否禁用该表单内的所有组件。 如果设置为 `true`, 它将覆盖内部组件的 `disabled` 属性，默认值：false。
 * @property {boolean} readonly 是否只读该表单内的所有组件。 如果设置为 `true`, 它将覆盖内部组件的 `readonly` 属性，默认值：false。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "form",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    model: { type: Object, required: false },
    rules: { type: Object, required: false },
    validateTrigger: { type: [String, Array], required: false },
    validateOnRuleChange: { type: Boolean, required: false },
    direction: { type: String, required: false },
    labelWidth: { type: String, required: false },
    labelAlign: { type: String, required: false },
    labelValign: { type: String, required: false },
    starPosition: { type: String, required: false },
    contentPosition: { type: String, required: false },
    hideStar: { type: Boolean, required: false },
    showError: { type: Boolean, required: false },
    scrollToFirstError: { type: Boolean, required: false },
    scrollIntoViewOptions: { type: Object, required: false },
    scrollDuration: { type: Number, required: false },
    disabled: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false },
    card: { type: Boolean, required: false }
  }, defaultFormProps),
  setup(__props, { expose: __expose }) {
    const props = __props;
    const bem = createBem("form");
    const { expose } = useForm(props);
    __expose(expose);
    const formClass = computed(() => {
      return classNames(bem.b(), bem.m("card", props.card), props.rootClass);
    });
    const formStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, bem, expose, formClass, formStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>