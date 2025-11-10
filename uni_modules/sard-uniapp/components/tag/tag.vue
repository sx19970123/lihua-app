<template>
  <view :class="tagClass" :style="tagStyle" @click="$emit('click', $event)">
    <slot></slot>
    <view
      v-if="closable"
      :class="iconClass"
      @click.stop="$emit('close', $event)"
    >
      <sar-icon family="sari" name="close" />
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import SarIcon from "../icon/icon.vue";
import {
  defaultTagProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'} theme 主题色，默认值：'primary'。
 * @property {boolean} round 圆角按标签，默认值：false。
 * @property {boolean} plain 镂空标签，默认值：false。
 * @property {boolean | 'left' | 'right'} mark 标记标签，默认值：false。
 * @property {'small' | 'medium' | 'large'} size 标签尺寸，默认值：'medium'。
 * @property {string} color 标签颜色，默认值：-。
 * @property {string} textColor 文本颜色，默认值：-。
 * @property {boolean} closable 是否可关闭，默认值：false。
 * @event {(event: any) => void} click 点击标签时触发
 * @event {(event: any) => void} close 点击关闭按钮时触发
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
  __name: "tag",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    theme: { type: String, required: false },
    plain: { type: Boolean, required: false },
    round: { type: Boolean, required: false },
    mark: { type: [Boolean, String], required: false },
    size: { type: String, required: false },
    color: { type: String, required: false },
    textColor: { type: String, required: false },
    closable: { type: Boolean, required: false }
  }, defaultTagProps),
  emits: ["click", "close"],
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("tag");
    const tagClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m(props.theme),
        bem.m("plain", props.plain),
        bem.m(`${props.theme}-plain`, props.plain),
        bem.m(props.size),
        bem.m("round", props.round),
        bem.m(props.mark === true ? "mark" : `mark-${props.mark}`, !!props.mark),
        props.rootClass
      );
    });
    const tagStyle = computed(() => {
      return stringifyStyle(
        {
          color: props.plain ? props.color : props.textColor,
          borderColor: props.plain ? props.color : null,
          background: !props.plain ? props.color : null
        },
        props.rootStyle
      );
    });
    const iconClass = computed(() => {
      return classNames(bem.e("close"));
    });
    const __returned__ = { props, bem, tagClass, tagStyle, iconClass, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>