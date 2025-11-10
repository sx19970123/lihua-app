<template>
  <view :class="avatarGroupClass" :style="avatarGroupStyle">
    <slot></slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, provide, reactive, toRef } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import {
  defaultAvatarGroupProps,
  avatarGroupContextSymbol
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number} max 最大头像展示数量，必填，默认值：-。
 * @property {number} total 总的头像个数，必填，默认值：-。
 * @property {number} coverage 头像间的覆盖面，默认值：0.5。
 * @property {boolean} showRemain 是否显示剩余头像数量，默认值：true。
 * @property {string | boolean} remainText 自定义剩余头像数量的内容，默认值：-。
 * @event {(event: any) => void} remain-click 点击剩余数量时触发
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "avatar-group",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    max: { type: Number, required: true },
    total: { type: Number, required: true },
    coverage: { type: Number, required: false },
    showRemain: { type: Boolean, required: false },
    remainText: { type: [String, Number], required: false }
  }, defaultAvatarGroupProps),
  emits: ["remain-click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("avatar-group");
    provide(
      avatarGroupContextSymbol,
      reactive({
        total: toRef(() => props.total),
        max: toRef(() => props.max),
        showRemain: toRef(() => props.showRemain),
        coverage: toRef(() => props.coverage),
        remainText: toRef(() => props.remainText ?? `+${props.total - props.max}`),
        onRemainClick: (event) => {
          emit("remain-click", event);
        }
      })
    );
    __expose({});
    const avatarGroupClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const avatarGroupStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, avatarGroupClass, avatarGroupStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>