<template>
  <view :class="sidebarItemClass" :style="sidebarItemStyle" @click="onClick">
    <view v-if="isCurrent && context.round" :class="bem.e('round-top')"></view>
    <view v-if="isCurrent && context.line" :class="bem.e('line')"></view>
    <slot>
      <view :class="bem.e('title')">
        {{ title }}
      </view>
    </slot>
    <view
      v-if="isCurrent && context.round"
      :class="bem.e('round-bottom')"
    ></view>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import {
  computed,
  getCurrentInstance,
  inject,
  nextTick,
  onMounted,
  onUnmounted
} from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid,
  getBoundingClientRect
} from "../../utils";
import { sidebarContextSymbol } from "../sidebar/common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} title 导航项显示的标题内容，默认值：-。
 * @property {string | number} name 导航项唯一名称，必需，默认值：-。
 * @property {boolean} disabled 是否禁用表单项，默认值：false。
 * @event {(event: any) => void} click 点击导航项时触发
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "sidebar-item",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    title: { type: String, required: false },
    name: { type: [String, Number], required: true },
    disabled: { type: Boolean, required: false }
  },
  emits: ["click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("sidebar-item");
    const context = inject(sidebarContextSymbol);
    if (!context) {
      throw new Error("SidebarItem must be included in Sidebar.");
    }
    const instance = getCurrentInstance();
    const isCurrent = computed(() => {
      return context.current === props.name;
    });
    const itemId = uniqid();
    const getRect = () => {
      return getBoundingClientRect(`.${itemId}`, instance);
    };
    const select = () => {
      context.select(props.name);
    };
    const onClick = (event) => {
      emit("click", event);
      if (!props.disabled) {
        select();
      }
    };
    onMounted(() => {
      context.register(props.name, getRect);
      if (isCurrent.value) {
        nextTick(() => {
          select();
        });
      }
    });
    onUnmounted(() => {
      context.unregister(props.name);
    });
    const sidebarItemClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("current", isCurrent.value),
        bem.m("disabled", props.disabled),
        props.rootClass,
        itemId
      );
    });
    const sidebarItemStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    __expose({
      reset: () => {
      }
    });
    const __returned__ = { props, emit, bem, context, instance, isCurrent, itemId, getRect, select, onClick, sidebarItemClass, sidebarItemStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>