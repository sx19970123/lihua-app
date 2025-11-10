<template>
  <view :class="cardClass" :style="cardStyle" @click="onClick">
    <view v-if="!headless" :class="bem.e('header')">
      <view :class="bem.e('title')">
        <slot name="title">{{ title }}</slot>
      </view>
      <view :class="bem.e('extra')">
        <slot name="extra">{{ extra }}</slot>
      </view>
    </view>
    <sar-collapse :visible="!collapsed">
      <view :class="bem.e('body')">
        <slot></slot>
      </view>
      <view v-if="!footless" :class="bem.e('footer')">
        <slot name="footer">{{ footer }}</slot>
      </view>
    </sar-collapse>
  </view>
</template>

<script>
import { useSlots as _useSlots, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  isVisibleEmpty
} from "../../utils";
import SarCollapse from "../collapse/collapse.vue";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} title 头部左边内容，默认值：-。
 * @property {string} extra 头部右边内容，默认值：-。
 * @property {string} footer 底部内容，默认值：-。
 * @property {boolean} hover 是否开启点击反馈，默认值：false。
 * @property {boolean} hideHeaderBorder 是否隐藏头部边框，默认值：false。
 * @property {boolean} hideFooterBorder 是否隐藏底部边框，默认值：false。
 * @property {boolean} collapsed 是否折叠，默认值：false。
 * @event {(event: any) => void} click 点击卡片时触发
 */
export default  _defineComponent({
  components: {
    SarCollapse,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "card",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    title: { type: String, required: false },
    extra: { type: String, required: false },
    footer: { type: String, required: false },
    hover: { type: Boolean, required: false },
    hideHeaderBorder: { type: Boolean, required: false },
    hideFooterBorder: { type: Boolean, required: false },
    collapsed: { type: Boolean, required: false }
  },
  emits: ["click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const slots = _useSlots();
    const emit = __emit;
    const bem = createBem("card");
    const headless = computed(() => {
      return isVisibleEmpty(props.title) && !slots.title && isVisibleEmpty(props.extra) && !slots.extra;
    });
    const footless = computed(() => {
      return isVisibleEmpty(props.footer) && !slots.footer;
    });
    const onClick = (event) => {
      emit("click", event);
    };
    const cardClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("hover", props.hover),
        bem.m("headless", headless.value),
        bem.m("footless", footless.value),
        bem.m("head-borderless", props.hideHeaderBorder),
        bem.m("foot-borderless", props.hideFooterBorder),
        bem.m("collapsed", props.collapsed),
        props.rootClass
      );
    });
    const cardStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, slots, emit, bem, headless, footless, onClick, cardClass, cardStyle, SarCollapse };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>