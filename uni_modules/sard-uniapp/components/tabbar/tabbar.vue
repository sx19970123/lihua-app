<template>
  <view :class="tabbarClass" :style="tabbarStyle">
    <slot></slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, provide, ref, watch, toRef, reactive } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import {
  tabbarContextSymbol,
  defaultTabbarProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number | string} current 当前选中标签的 `name` 属性，默认值：-。
 * @property {string} color 未选中标签的颜色，默认值：-。
 * @property {string} activeColor 选中标签的颜色，默认值：-。
 * @property {boolean} bordered 是否显示外边框，默认值：true。
 * @property {boolean} fixed 是否固定到页面底部，默认值：false。
 * @property {boolean} safeAreaInsetBottom 是否开启底部安全区适配，默认值：false。
 * @event {(name: number | string) => void} update 切换标签时触发
 * @event {(name: number | string) => void} change 切换标签时触发
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "tabbar",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    current: { type: [Number, String], required: false },
    color: { type: String, required: false },
    activeColor: { type: String, required: false },
    bordered: { type: Boolean, required: false },
    fixed: { type: Boolean, required: false },
    safeAreaInsetBottom: { type: Boolean, required: false }
  }, defaultTabbarProps),
  emits: ["update:current", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("tabbar");
    const innerCurrent = ref(props.current);
    watch(
      () => props.current,
      () => {
        if (props.current !== innerCurrent.value) {
          innerCurrent.value = props.current;
        }
      }
    );
    const select = (name) => {
      innerCurrent.value = name;
      emit("update:current", name);
      emit("change", name);
    };
    provide(
      tabbarContextSymbol,
      reactive({
        color: toRef(() => props.color),
        activeColor: toRef(() => props.activeColor),
        current: innerCurrent,
        select
      })
    );
    const tabbarClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("bordered", props.bordered),
        bem.m("fixed", props.fixed),
        bem.m("safe", props.safeAreaInsetBottom),
        props.rootClass
      );
    });
    const tabbarStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, innerCurrent, select, tabbarClass, tabbarStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>