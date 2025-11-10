<template>
  <view v-if="$slots.default" :class="bem.e('wrapper')">
    <slot></slot>
    <view :class="badgeClass" :style="badgeStyle">
      <slot name="value">
        {{ innerValue }}
      </slot>
    </view>
  </view>
  <view v-else :class="badgeClass" :style="badgeStyle">
    <slot name="value">
      {{ innerValue }}
    </slot>
  </view>
</template>

<script>
import { useSlots as _useSlots, mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import { defaultBadgeProps } from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number | string} value 展示的数字，默认值：0。
 * @property {number} max 默认超过 99 的值会显示 99+，可以通过 max 设置最大显示数值，默认值：99。
 * @property {boolean} showZero 值为 0 时，会隐藏，可通过 `show-zero` 让其值为 0 时依然显示，默认值：false。
 * @property {string} color 自定义背景颜色，默认值：-。
 * @property {string} textColor 自定义文本颜色，默认值：-。
 * @property {boolean} dot 显示圆点，默认值：false。
 * @property {boolean} fixed 是否定位到右上角，默认值：false。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "badge",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    value: { type: [Number, String], required: false },
    max: { type: Number, required: false },
    showZero: { type: Boolean, required: false },
    color: { type: String, required: false },
    textColor: { type: String, required: false },
    dot: { type: Boolean, required: false },
    fixed: { type: Boolean, required: false }
  }, defaultBadgeProps),
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const slots = _useSlots();
    const bem = createBem("badge");
    const zeroHide = computed(() => {
      return !props.dot && props.value === 0 && !props.showZero && !slots.value;
    });
    const innerValue = computed(() => {
      return props.dot ? "" : typeof props.value === "number" && props.value > props.max ? `${props.max}+` : props.value === 0 && !props.showZero ? "" : props.value;
    });
    const badgeClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("fixed", props.fixed || !!slots.default),
        bem.m("zero-hide", zeroHide.value),
        bem.m("dot", props.dot),
        props.rootClass
      );
    });
    const badgeStyle = computed(() => {
      return stringifyStyle(
        {
          background: props.color,
          color: props.textColor
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, slots, bem, zeroHide, innerValue, badgeClass, badgeStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>