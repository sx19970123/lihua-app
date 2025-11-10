<template>
  <view
    :class="listItemClass"
    :style="stringifyStyle(rootStyle)"
    @click="onClick"
  >
    <slot>
      <view v-if="isRenderVisible($slots.icon || icon)" :class="bem.e('icon')">
        <slot name="icon">
          <sar-icon
            :name="icon"
            :color="iconColor"
            :size="iconSize"
            :family="iconFamily"
          />
        </slot>
      </view>
      <view :class="bem.e('title')">
        <slot name="title">{{ title }}</slot>
        <view
          v-if="isRenderVisible($slots.description || description)"
          :class="bem.e('description')"
        >
          <slot name="description">{{ description }}</slot>
        </view>
      </view>

      <view
        v-if="isRenderVisible($slots.value || value)"
        :class="bem.e('value')"
      >
        <slot name="value">{{ value }}</slot>
      </view>
      <slot name="arrow">
        <view v-if="arrow" :class="bem.e('arrow')">
          <sar-icon family="sari" :name="arrowDirection" />
        </view>
      </slot>
    </slot>
  </view>
</template>

<script>
import { useSlots as _useSlots, mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, inject } from "vue";
import {
  classNames,
  stringifyStyle,
  isRenderVisible,
  createBem
} from "../../utils";
import SarIcon from "../icon/icon.vue";
import {
  defaultListItemProps,
  listContextKey
} from "../list/common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string | number} title 左侧标题，默认值：-。
 * @property {string | number} description 标题下方的描述，默认值：-。
 * @property {string | number} value 右侧值，默认值：-。
 * @property {boolean} hover 是否开启点击反馈，默认值：false。
 * @property {boolean} arrow 是否展示右侧箭头，默认值：false。
 * @property {'up' | 'right' | 'down'} arrowDirection 箭头方向，默认值：'right'。
 * @property {string} icon 左侧图标名称，可以为图片路径，默认值：-。
 * @property {string} iconSize 图标尺寸，默认值：-。
 * @property {string} iconColor 图标颜色，默认值：-。
 * @property {string} iconFamily 图标字体名称，默认值：-。
 * @event {(event: any) => void} click 点击列表项时触发
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
  __name: "list-item",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    title: { type: [String, Number], required: false },
    description: { type: [String, Number], required: false },
    value: { type: [String, Number], required: false },
    hover: { type: Boolean, required: false },
    arrow: { type: Boolean, required: false },
    arrowDirection: { type: String, required: false },
    icon: { type: String, required: false },
    iconSize: { type: String, required: false },
    iconColor: { type: String, required: false },
    iconFamily: { type: String, required: false }
  }, defaultListItemProps),
  emits: ["click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const slots = _useSlots();
    const emit = __emit;
    const bem = createBem("list-item");
    const context = inject(listContextKey, null);
    const onClick = (event) => {
      emit("click", event);
    };
    const listItemClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("hover", props.hover),
        bem.m("custom", !!slots.default),
        bem.m("borderless", context?.hideBorder),
        props.rootClass
      );
    });
    const __returned__ = { props, slots, emit, bem, context, onClick, listItemClass, get stringifyStyle() {
      return stringifyStyle;
    }, get isRenderVisible() {
      return isRenderVisible;
    }, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>