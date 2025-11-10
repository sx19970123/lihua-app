<template>
  <view :class="emptyClass" :style="emptyStyle">
    <view :class="bem.e('icon')" :style="iconStyle">
      <slot name="icon">
        <sar-icon :family="iconFamily" :name="icon" />
      </slot>
    </view>
    <slot name="description">
      <view :class="bem.e('description')">
        {{ description || t('noData') }}
      </view>
    </slot>
    <view v-if="$slots.default" :class="bem.e('extra')">
      <slot></slot>
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import SarIcon from "../icon/icon.vue";
import { useTranslate } from "../locale";
import { defaultEmptyProps } from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} description 描述信息，默认值：'暂无数据'。
 * @property {string} icon 自定义图标，默认值：-。
 * @property {string} iconFamily 图标字体，默认值：-。
 * @property {string} iconSize 图标大小，默认值：-。
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
  __name: "empty",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    description: { type: String, required: false },
    icon: { type: String, required: false },
    iconFamily: { type: String, required: false },
    iconSize: { type: String, required: false }
  }, defaultEmptyProps),
  setup(__props, { expose: __expose }) {
    __expose();
    const { t } = useTranslate("empty");
    const props = __props;
    const bem = createBem("empty");
    const emptyClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const emptyStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const iconStyle = computed(() => {
      return stringifyStyle({
        fontSize: props.iconSize
      });
    });
    const __returned__ = { t, props, bem, emptyClass, emptyStyle, iconStyle, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>