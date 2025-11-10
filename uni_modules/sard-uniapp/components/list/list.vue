<template>
  <view :class="listClass" :style="stringifyStyle(rootStyle)">
    <view v-if="isRenderVisible($slots.title || title)" :class="bem.e('title')">
      <slot name="title">{{ title }}</slot>
    </view>
    <view :class="bem.e('content')">
      <slot></slot>
    </view>
    <view
      v-if="isRenderVisible($slots.description || description)"
      :class="bem.e('description')"
    >
      <slot name="description">{{ description }}</slot>
    </view>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed, provide, reactive, toRef } from "vue";
import {
  classNames,
  stringifyStyle,
  isRenderVisible,
  createBem
} from "../../utils";
import { listContextKey } from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string | number} title 列表顶部标题，默认值：-。
 * @property {string | number} description 列表底部描述，默认值：-。
 * @property {boolean} card 卡片风格，默认值：false。
 * @property {boolean} inlaid 嵌入式列表，默认值：false。
 * @property {boolean} hideBorder 是否隐藏边框，默认值：false。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "list",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    title: { type: [String, Number], required: false },
    description: { type: [String, Number], required: false },
    inlaid: { type: Boolean, required: false },
    card: { type: Boolean, required: false },
    hideBorder: { type: Boolean, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("list");
    provide(
      listContextKey,
      reactive({
        hideBorder: toRef(() => props.hideBorder)
      })
    );
    const listClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("card", props.card),
        bem.m("not-card", !props.card),
        bem.m("inlaid", props.inlaid),
        bem.m("borderless", props.hideBorder),
        props.rootClass
      );
    });
    const __returned__ = { props, bem, listClass, get stringifyStyle() {
      return stringifyStyle;
    }, get isRenderVisible() {
      return isRenderVisible;
    } };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>