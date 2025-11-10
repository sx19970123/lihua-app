<template>
  <view :class="resultClass" :style="resultStyle">
    <slot name="icon">
      <view :class="iconClass">
        <sar-icon
          :name="icon || mapStatusIcon[status]"
          :family="iconFamily"
          :color="iconColor"
        />
      </view>
    </slot>

    <view v-if="title" :class="bem.e('title')">
      <slot name="title">{{ title }}</slot>
    </view>

    <view v-if="title" :class="bem.e('description')">
      <slot name="description">{{ description }}</slot>
    </view>

    <view v-if="$slots.default" :class="bem.e('extra')"><slot></slot></view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import SarIcon from "../icon/icon.vue";
import {
  mapStatusIcon,
  defaultResultProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {'success' | 'info' | 'warning' | 'error' | 'question'} status 结果的状态，默认值：'info'。
 * @property {string} icon 图标名称，默认值：-。
 * @property {string} iconFamily 图标字体，默认值：-。
 * @property {string} iconColor 图标颜色，默认值：-。
 * @property {string} title 标题，默认值：-。
 * @property {string} description 描述，默认值：-。
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
  __name: "result",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    status: { type: String, required: false },
    icon: { type: String, required: false },
    iconFamily: { type: String, required: false },
    iconColor: { type: String, required: false },
    title: { type: String, required: false },
    description: { type: String, required: false }
  }, defaultResultProps),
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("result");
    const resultClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const resultStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const iconClass = computed(() => {
      return classNames(bem.e("icon"), bem.em("icon", props.status));
    });
    const __returned__ = { props, bem, resultClass, resultStyle, iconClass, SarIcon, get mapStatusIcon() {
      return mapStatusIcon;
    } };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>