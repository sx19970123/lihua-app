<template>
  <view
    v-if="realVisible"
    :class="overlayClass"
    :style="overlayStyle"
    @click="onClick"
    @transitionend="onTransitionEnd"
    @touchmove.stop.prevent
  >
    <slot></slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, reactive, toRef } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import { useTransition } from "../../use";
import {
  defaultOverlayProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {boolean} visible 控制显隐，默认值：-。
 * @property {number | string} zIndex 设置层级，默认值：-。
 * @property {number} duration 透明度过渡持续时间，默认值：300。
 * @property {string} background 自定义遮罩层的背景色，默认值：-。
 * @property {boolean} transparent 透明遮罩，默认值：false。
 * @event {(event: any) => void} click 点击遮罩时触发
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "overlay",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    visible: { type: Boolean, required: false },
    zIndex: { type: Number, required: false },
    duration: { type: Number, required: false },
    background: { type: String, required: false },
    transparent: { type: Boolean, required: false }
  }, defaultOverlayProps),
  emits: ["click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("overlay");
    const onClick = (event) => {
      emit("click", event);
    };
    const { realVisible, transitionClass, onTransitionEnd } = useTransition(
      reactive({
        visible: toRef(() => props.visible),
        duration: toRef(() => props.duration),
        prefix: bem.m("")
      })
    );
    const overlayClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("transparent", props.transparent),
        transitionClass.value,
        props.rootClass
      );
    });
    const overlayStyle = computed(() => {
      return stringifyStyle(
        {
          zIndex: props.zIndex,
          backgroundColor: props.background,
          transitionDuration: props.duration + "ms"
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, emit, bem, onClick, realVisible, transitionClass, onTransitionEnd, overlayClass, overlayStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>