<template>
  <view :class="navbarClass" :style="navbarStyle">
    <view :class="fixationCls" :style="fixationStyle">
      <sar-status-bar v-if="statusBar" />
      <view :class="bem.e('wrapper')">
        <view v-if="$slots.left || showBack" :class="bem.e('left')">
          <sar-navbar-item
            v-if="showBack"
            icon="left"
            :text="backText"
            @click="onBack"
          />
          <slot name="left"></slot>
        </view>
        <view :class="bem.e('content')">
          <slot>
            <view :class="bem.e('title')">
              <slot name="title">
                {{ title }}
              </slot>
            </view>
          </slot>
        </view>
        <view v-if="$slots.right" :class="bem.e('right')">
          <slot name="right"></slot>
        </view>
      </view>
    </view>
    <sar-navbar-pit v-if="fixed" :status-bar="statusBar" />
  </view>
</template>

<script>
import { useSlots as _useSlots, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import SarNavbarItem from "../navbar-item/navbar-item.vue";
import SarStatusBar from "../status-bar/status-bar.vue";
import SarNavbarPit from "../navbar-pit/navbar-pit.vue";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} title 自定义标题，默认值：-。
 * @property {boolean} flow 默认 `left/right` 绝对定位于左右两侧，标题居中；可以使用 `flow` 使其变为流动布局。，默认值：false。
 * @property {boolean} showBack 是否显示返回按钮（仅显示，返回逻辑需自行编写），默认值：false。
 * @property {string} backText 返回按钮的文本，默认值：-。
 * @property {boolean} fixed 是否固定到页面顶部，默认值：false。
 * @property {boolean} statusBar 是否包含状态栏，默认值：false。
 * @property {string} fixationClass 固定栏元素类名，默认值：-。
 * @property {StyleValue} fixationStyle 固定栏元素样式，默认值：-。
 * @event {(event: any) => void} back 点击返回按钮项时触发
 */
export default  _defineComponent({
  components: {
    SarNavbarItem,
    SarStatusBar,
    SarNavbarPit,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "navbar",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    title: { type: String, required: false },
    flow: { type: Boolean, required: false },
    showBack: { type: Boolean, required: false },
    backText: { type: String, required: false },
    fixed: { type: Boolean, required: false },
    statusBar: { type: Boolean, required: false },
    fixationStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    fixationClass: { type: String, required: false }
  },
  emits: ["back"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const slots = _useSlots();
    const emit = __emit;
    const bem = createBem("navbar");
    const onBack = (event) => {
      emit("back", event);
    };
    const navbarClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("flow", props.flow),
        bem.m("custom", !!slots.default),
        bem.m("fixed", props.fixed),
        props.rootClass
      );
    });
    const navbarStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const fixationCls = computed(() => {
      return classNames(bem.e("fixation"), props.fixationClass);
    });
    const __returned__ = { props, slots, emit, bem, onBack, navbarClass, navbarStyle, fixationCls, SarNavbarItem, SarStatusBar, SarNavbarPit };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>