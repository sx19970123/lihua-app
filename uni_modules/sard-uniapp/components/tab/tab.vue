<template>
  <view :class="tabClass" :style="tabStyle" @click="onClick">
    <slot>
      {{ title }}
    </slot>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  getCurrentInstance,
  nextTick
} from "vue";
import { classNames, stringifyStyle, createBem, uniqid } from "../../utils";
import {
  tabContextSymbol
} from "../tabs/common";
import { getBoundingClientRect } from "../../utils";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} title 标签显示的标题，默认值：-。
 * @property {string | number| boolean} name 标签的唯一标识，默认为对应的下标，使用标签组件时要手动指定，默认值：-。
 * @property {boolean} disabled 是否禁用标签，默认值：false。
 * @event {(event: any) => void} click 点击标签时触发，不论是否禁用
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "tab",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    title: { type: String, required: false },
    name: { type: [String, Number, Boolean], required: true },
    disabled: { type: Boolean, required: false }
  },
  emits: ["click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("tabs");
    const context = inject(tabContextSymbol);
    if (!context) {
      throw new Error("Tab must be included in Tabs.");
    }
    const instance = getCurrentInstance();
    const isCurrent = computed(() => {
      return context.current === props.name;
    });
    const tabId = uniqid();
    const getRect = () => {
      return getBoundingClientRect(`.${tabId}`, instance);
    };
    const select = (initial) => {
      context.select(props.name, initial);
    };
    const onClick = (event) => {
      emit("click", event);
      if (!props.disabled) {
        select();
      }
    };
    onMounted(() => {
      context.register(props.name, {
        getRect
      });
      if (isCurrent.value) {
        nextTick(() => {
          select(true);
        });
      }
    });
    onUnmounted(() => {
      context.unregister(props.name);
    });
    const tabClass = computed(() => {
      return classNames(
        bem.e("tab"),
        bem.em("tab", "current", isCurrent.value),
        bem.em("tab", "disabled", props.disabled),
        props.rootClass,
        tabId
      );
    });
    const tabStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, context, instance, isCurrent, tabId, getRect, select, onClick, tabClass, tabStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>