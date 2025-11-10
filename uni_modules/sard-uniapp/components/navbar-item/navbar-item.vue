<template>
  <view
    :class="navbarClass"
    :style="navbarStyle"
    @click="$emit('click', $event)"
  >
    <slot>
      <sar-icon
        v-if="icon"
        :class="bem.e('item-icon')"
        :name="icon"
        :family="iconFamily"
        :size="iconSize"
      />

      <text v-if="text" :class="bem.e('item-text')">{{ text }}</text>
    </slot>
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
 * @property {string} text 导航项文本，默认值：-。
 * @property {string} icon 导航项图标，默认值：-。
 * @property {string} iconFamily 导航项图标字体名称，默认值：-。
 * @property {string} iconSize 导航项图标大小，默认值：-。
 * @property {string} reverse 默认图标在文本前面，可以互换位置，默认值：false。
 * @event {(event: any) => void} click 点击导航项时触发
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
  __name: "navbar-item",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    text: { type: String, required: false },
    icon: { type: String, required: false },
    iconFamily: { type: String, required: false },
    iconSize: { type: String, required: false },
    reverse: { type: Boolean, required: false }
  },
  emits: ["click"],
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("navbar");
    const navbarClass = computed(() => {
      return classNames(
        bem.e("item"),
        bem.m("reverse", props.reverse),
        props.rootClass
      );
    });
    const navbarStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, bem, navbarClass, navbarStyle, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>