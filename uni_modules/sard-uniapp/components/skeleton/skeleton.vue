<template>
  <view v-if="loading" :class="skeletonClass" :style="skeletonStyle">
    <sar-skeleton-avatar
      v-if="avatar"
      :animated="animated"
      :size="avatarSize"
      :round="avatarRound"
    />

    <view :class="bem.e('content')">
      <sar-skeleton-title v-if="title" :animated="animated" :round="round" />
      <sar-skeleton-paragraph
        :rows="rows"
        :animated="animated"
        :round="round"
      />
    </view>
  </view>
  <slot v-else></slot>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import SarSkeletonAvatar from "../skeleton-avatar/skeleton-avatar.vue";
import SarSkeletonTitle from "../skeleton-title/skeleton-title.vue";
import SarSkeletonParagraph from "../skeleton-paragraph/skeleton-paragraph.vue";
import {
  defaultSkeletonProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number} rows 段落行数，默认值：3。
 * @property {boolean} title 是否显示标题，默认值：false。
 * @property {boolean} avatar 是否显示头像，默认值：false。
 * @property {number | string} avatarSize 头像尺寸，默认值：-。
 * @property {boolean} avatarRound 是否显示圆形头像，默认值：true。
 * @property {boolean} round 是否将标题和段落显示为圆角风格，默认值：false。
 * @property {boolean} loading 是否显示骨架屏，传 `false` 时会展示子组件内容，默认值：true。
 * @property {boolean} animated 是否开启动画，默认值：false。
 */
export default  _defineComponent({
  components: {
    SarSkeletonAvatar,
    SarSkeletonTitle,
    SarSkeletonParagraph,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "skeleton",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    rows: { type: Number, required: false },
    title: { type: Boolean, required: false },
    avatar: { type: Boolean, required: false },
    avatarSize: { type: String, required: false },
    avatarRound: { type: Boolean, required: false },
    round: { type: Boolean, required: false },
    loading: { type: Boolean, required: false },
    animated: { type: Boolean, required: false }
  }, defaultSkeletonProps),
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("skeleton");
    const skeletonClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const skeletonStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, bem, skeletonClass, skeletonStyle, SarSkeletonAvatar, SarSkeletonTitle, SarSkeletonParagraph };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>