<template>
  <view :class="dividerClass" :style="dividerStyle">
    <slot></slot>
  </view>
</template>

<script>
import { useSlots as _useSlots, mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import {
  defaultDividerProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {'solid' | 'dashed' | 'dotted'} type 分割线类型，默认值：'solid'。
 * @property {boolean} hairline 是否显示半像素分割线，默认值：true。
 * @property {'left' | 'right' | 'center'} position 内容位置，默认值：'center'。
 * @property {boolean} vertical 是否垂直显示分割线，默认值：false。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "divider",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    type: { type: String, required: false },
    hairline: { type: Boolean, required: false },
    position: { type: String, required: false },
    vertical: { type: Boolean, required: false }
  }, defaultDividerProps),
  emits: ["click"],
  setup(__props, { expose: __expose }) {
    const props = __props;
    const slots = _useSlots();
    const bem = createBem("divider");
    __expose({});
    const dividerClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m(props.position),
        bem.m("vertical", props.vertical),
        bem.m("hairline", props.hairline),
        bem.m("only-line", !slots.default),
        props.rootClass
      );
    });
    const dividerStyle = computed(() => {
      return stringifyStyle(
        {
          borderStyle: props.type
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, slots, bem, dividerClass, dividerStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>