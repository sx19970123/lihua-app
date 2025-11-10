<template>
  <view :class="backTopClass" :style="backTopStyle" @click="onClick">
    <slot>
      <sar-icon family="sari" name="backtop" />
    </slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import {
  defaultBackTopProps
} from "./common";
import SarIcon from "../icon/icon.vue";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number} scrollTop 当前页面或 scroll-view 滚动的高度，默认值：0。
 * @property {number} visibleHeight 回到顶部按钮显示时的页面或 scroll-view 滚动的最小高度，默认值：200。
 * @property {string} right 回到顶部按钮距离右边的距离，默认值：-。
 * @property {string} bottom 回到顶部按钮距离底部的距离，默认值：-。
 * @event {(event: any) => void} click 点击时触发
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
  __name: "back-top",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    scrollTop: { type: Number, required: false },
    visibleHeight: { type: Number, required: false },
    right: { type: String, required: false },
    bottom: { type: String, required: false }
  }, defaultBackTopProps()),
  emits: ["click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("back-top");
    const visible = computed(() => {
      return props.scrollTop >= props.visibleHeight;
    });
    const onClick = (event) => {
      emit("click", event);
    };
    const backTopClass = computed(() => {
      return classNames(bem.b(), bem.m("visible", visible.value), props.rootClass);
    });
    const backTopStyle = computed(() => {
      return stringifyStyle(props.rootStyle, {
        right: props.right,
        bottom: props.bottom
      });
    });
    const __returned__ = { props, emit, bem, visible, onClick, backTopClass, backTopStyle, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>