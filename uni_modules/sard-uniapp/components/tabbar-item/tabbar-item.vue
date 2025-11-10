<template>
  <view :class="tabbarItemClass" :style="tabbarItemStyle" @click="onClick">
    <slot>
      <view :class="bem.e('icon')">
        <slot name="icon" :active="isCurrent">
          <sar-icon :name="icon" :family="iconFamily" :size="iconSize" />
        </slot>
        <sar-badge v-if="badge || dot" :value="badge" :dot="dot" fixed />
      </view>
      <view :class="bem.e('text')">
        {{ text }}
      </view>
    </slot>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed, inject } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import {
  tabbarContextSymbol
} from "../tabbar/common";
import SarIcon from "../icon/icon.vue";
import SarBadge from "../badge/badge.vue";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string | number} name 标签唯一标识符，默认值：-。
 * @property {string} text 要显示的标签文本，默认值：-。
 * @property {string} icon 图标名称，默认值：-。
 * @property {string} iconFamily 图标字体，默认值：-。
 * @property {string} iconSize 图标大小，默认值：-。
 * @property {number | string} badge 显示的徽标值，默认值：-。
 * @property {boolean} dot 是否显示小红点，默认值：-。
 * @event {(event: any) => void} click 点击标签时触发
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
  __name: "tabbar-item",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    name: { type: [String, Number], required: false },
    icon: { type: String, required: false },
    iconFamily: { type: String, required: false },
    iconSize: { type: String, required: false },
    badge: { type: [Number, String], required: false },
    dot: { type: Boolean, required: false },
    text: { type: String, required: false }
  },
  emits: ["click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("tabbar");
    const context = inject(tabbarContextSymbol);
    if (!context) {
      throw new Error("TabbarItem must be included in Tabbar.");
    }
    const isCurrent = computed(() => {
      return context.current === props.name;
    });
    const onClick = (event) => {
      if (props.name !== void 0) {
        context.select(props.name);
      }
      emit("click", event);
    };
    const tabbarItemClass = computed(() => {
      return classNames(
        bem.e("item"),
        bem.em("item", "current", isCurrent.value),
        props.rootClass
      );
    });
    const tabbarItemStyle = computed(() => {
      return stringifyStyle(
        {
          color: isCurrent.value ? context.activeColor : context.color
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, emit, bem, context, isCurrent, onClick, tabbarItemClass, tabbarItemStyle, SarIcon, SarBadge };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>