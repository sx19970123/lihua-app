<template>
  <view :class="itemClass" :style="itemStyle">
    <view :class="bem.e('header')">
      <view :class="classNames(bem.e('line'), bem.em('line', 'before'))"></view>
      <view :class="bem.e('icon-wrapper')">
        <view v-if="icon || $slots.icon" :class="bem.e('icon')">
          <slot name="icon">
            <sar-icon :name="icon" :family="iconFamily" :color="iconColor" />
          </slot>
        </view>
        <view v-else :class="bem.e('dot')"></view>
      </view>
      <view :class="classNames(bem.e('line'), bem.em('line', 'after'))"></view>
    </view>
    <view :class="bem.e('body')">
      <view v-if="title || $slots.title" :class="bem.e('title')">
        <slot name="title">{{ title }}</slot>
      </view>
      <view v-if="$slots.default" :class="bem.e('description')">
        <slot></slot>
      </view>
      <view :class="bem.e('time')">
        <slot name="time">{{ time }}</slot>
      </view>
    </view>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import SarIcon from "../icon/icon.vue";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} title 标题内容，默认值：-。
 * @property {string} time 时间内容，默认值：-。
 * @property {string} icon 自定义图标，默认值：-。
 * @property {string} iconFamily 图标字体，默认值：-。
 * @property {string} iconColor 图标颜色，默认值：-。
 */
export default  _defineComponent({
  components: {
    SarIcon,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "timeline-item",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    title: { type: String, required: false },
    time: { type: String, required: false },
    icon: { type: String, required: false },
    iconFamily: { type: String, required: false },
    iconColor: { type: String, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("timeline-item");
    const itemClass = computed(() => {
      return classNames(bem.b(), bem.m("dotted", !props.icon), props.rootClass);
    });
    const itemStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, bem, itemClass, itemStyle, get classNames() {
      return classNames;
    }, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>