<template>
  <view :class="avatarClass" :style="avatarStyle" @click="onClick">
    <slot>
      <image
        v-if="src"
        :src="src"
        mode="aspectFill"
        :class="classNames(bem.e('image'), bem.m(shape))"
      />

      <sar-icon
        v-else
        family="sari"
        name="person"
        :root-class="bem.e('icon')"
      />
    </slot>
    <slot name="extra"></slot>

    <view
      v-if="
        context && context.showRemain && context.total > context.max && isLast
      "
      :class="remainClass"
      @click="context.onRemainClick"
    >
      {{ context.remainText }}
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, inject } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import SarIcon from "../icon/icon.vue";
import {
  defaultAvatarProps
} from "./common";
import {
  avatarGroupContextSymbol
} from "../avatar-group/common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {'circle' | 'square'} shape 头像形状，默认值：'circle'。
 * @property {string} size 头像尺寸，默认值：-。
 * @property {string} iconSize 图标尺寸，默认值：-。
 * @property {string} src 图片类型头像的图片地址，默认值：-。
 * @property {number} index 位于头像组中时必传，当前头像在头像组中的下标，默认值：-。
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
  __name: "avatar",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    shape: { type: String, required: false },
    size: { type: String, required: false },
    iconSize: { type: String, required: false },
    background: { type: String, required: false },
    color: { type: String, required: false },
    src: { type: String, required: false },
    index: { type: Number, required: false }
  }, defaultAvatarProps),
  emits: ["click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("avatar");
    const context = inject(
      avatarGroupContextSymbol,
      null
    );
    const isLast = computed(() => context && context.max - 1 === props.index);
    const onClick = (event) => {
      emit("click", event);
    };
    const avatarClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m(props.shape),
        bem.m("in-group", !!context),
        props.rootClass
      );
    });
    const avatarStyle = computed(() => {
      return stringifyStyle(
        {
          width: props.size,
          height: props.size,
          color: props.color,
          fontSize: props.iconSize,
          background: props.background,
          marginLeft: context && props.index !== 0 ? `calc(${props.size ? props.size : `var(--sar-avatar-width)`} * ${-context.coverage})` : void 0
        },
        props.rootStyle
      );
    });
    const remainClass = computed(() => {
      return classNames(bem.e("remain"));
    });
    const __returned__ = { props, emit, bem, context, isLast, onClick, avatarClass, avatarStyle, remainClass, get classNames() {
      return classNames;
    }, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>