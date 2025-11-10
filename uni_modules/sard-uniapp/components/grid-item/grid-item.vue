<template>
  <view :class="itemClass" :style="itemStyle">
    <view :class="bem.e('wrapper')">
      <view
        :class="classNames(bem.e('content'), contentClass)"
        :style="stringifyStyle(contentStyle)"
        @click="onClick"
      >
        <view :class="bem.e('main')">
          <slot>
            <view :class="bem.e('icon')">
              <slot name="icon">
                <sar-icon
                  :name="icon"
                  :color="iconColor"
                  :size="iconSize"
                  :family="iconFamily"
                />
              </slot>
            </view>
            <view :class="bem.e('text')">
              <slot name="text">{{ text }}</slot>
            </view>
          </slot>
          <sar-badge v-bind="mergedBadgeProps" fixed />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed, inject } from "vue";
import { stringifyStyle, createBem, classNames } from "../../utils";
import {
  gridSymbol
} from "../grid/common";
import SarIcon from "../icon/icon.vue";
import SarBadge from "../badge/badge.vue";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} contentClass 内容元素类名，默认值：-。
 * @property {StyleValue} contentStyle 内容元素样式，默认值：-。
 * @property {string} text 自定义文字内容，默认值：-。
 * @property {string} icon 图标名称，可以为图片路径，默认值：-。
 * @property {string} iconSize 图标尺寸，默认值：-。
 * @property {string} iconColor 图标颜色，默认值：-。
 * @property {string} iconFamily 图标字体名称，默认值：-。
 * @property {boolean} dot 是否显示宫格项右上角小红点，默认值：false。
 * @property {number | string} badge 宫格项右上角徽标的内容，默认值：-。
 * @property {[BadgeProps](./badge#BadgeProps)} badgeProps 自定义徽标属性，默认值：-。
 * @event {(event: any) => void} click 点击格子时触发
 */
export default  _defineComponent({
  components: {
    SarIcon,
    SarBadge,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "grid-item",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    contentStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    contentClass: { type: String, required: false },
    text: { type: String, required: false },
    icon: { type: String, required: false },
    iconSize: { type: String, required: false },
    iconColor: { type: String, required: false },
    iconFamily: { type: String, required: false },
    dot: { type: Boolean, required: false },
    badge: { type: [Number, String], required: false },
    badgeProps: { type: Object, required: false }
  },
  emits: ["click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("grid");
    const context = inject(gridSymbol);
    if (!context) {
      throw new Error("GridItem must be included in Grid.");
    }
    const onClick = (event) => {
      emit("click", event);
    };
    const mergedBadgeProps = computed(() => {
      return {
        dot: props.dot,
        value: props.badge,
        ...props.badgeProps
      };
    });
    const itemClass = computed(() => {
      return classNames(bem.e("item"), props.rootClass);
    });
    const itemStyle = computed(() => {
      const width = 1 / context.columns * 100 + "%";
      const gutter = context.gutter;
      return stringifyStyle(
        context.gap ? {
          paddingLeft: gutter[0] + gutter[1],
          paddingRight: gutter[0] + gutter[1]
        } : null,
        {
          width,
          flexBasis: width
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, emit, bem, context, onClick, mergedBadgeProps, itemClass, itemStyle, get stringifyStyle() {
      return stringifyStyle;
    }, get classNames() {
      return classNames;
    }, SarIcon, SarBadge };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>