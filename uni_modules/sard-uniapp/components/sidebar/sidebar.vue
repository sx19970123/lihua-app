<template>
  <scroll-view
    scroll-y
    :scroll-top="scrollTop"
    :class="sidebarClass"
    :style="sidebarStyle"
    @scroll="onScroll"
  >
    <view :class="bem.e('content')">
      <slot></slot>
    </view>
  </scroll-view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import {
  computed,
  getCurrentInstance,
  provide,
  reactive,
  ref,
  toRef,
  watch
} from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  getScrollIntoViewValue,
  uniqid,
  getBoundingClientRect,
  isNullish
} from "../../utils";
import {
  sidebarContextSymbol
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string | number} current 当前绑定导航项的名称，默认值：-。
 * @property {boolean} round 当前导航项是否显示为圆角，默认值：false。
 * @property {boolean} line 当前导航项是否添加左边线条，默认值：false。
 * @property {[ScrollIntoViewOptions](../utilities/geometry#ScrollIntoViewOptions)} scrollIntoViewOptions 自定义滚动配置选项，默认值：{position: 'nearest', startOffset: 0, endOffset: 0}。
 * @event {(name: string | number) => void} update 当前导航项改变时触发
 * @event {(name: string | number) => void} change 当前导航项改变时触发
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "sidebar",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    current: { type: [String, Number], required: false },
    round: { type: Boolean, required: false },
    line: { type: Boolean, required: false },
    scrollIntoViewOptions: { type: Object, required: false }
  },
  emits: ["update:current", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("sidebar");
    const innerCurrent = ref(props.current);
    const sidebarItemMap =  new Map();
    const scrollViewId = uniqid();
    const scrollTop = ref(0);
    const instance = getCurrentInstance();
    let memoScrollTop = 0;
    const onScroll = (event) => {
      memoScrollTop = event.detail.scrollTop;
    };
    const scrollIntoView = async (name) => {
      const getRect = sidebarItemMap.get(name);
      if (!getRect) {
        return;
      }
      const itemRect = await getRect();
      const scrollViewRect = await getBoundingClientRect(
        `.${scrollViewId}`,
        instance
      );
      const value = getScrollIntoViewValue(
        scrollViewRect.height,
        memoScrollTop,
        itemRect.height,
        itemRect.top - scrollViewRect.top + memoScrollTop,
        props.scrollIntoViewOptions
      );
      scrollTop.value = value;
    };
    watch(
      () => props.current,
      () => {
        if (!isNullish(props.current) && props.current !== innerCurrent.value) {
          innerCurrent.value = props.current;
          scrollIntoView(props.current);
        }
      }
    );
    provide(
      sidebarContextSymbol,
      reactive({
        current: innerCurrent,
        round: toRef(() => props.round),
        line: toRef(() => props.line),
        register(name, getRect) {
          sidebarItemMap.set(name, getRect);
        },
        unregister(name) {
          sidebarItemMap.delete(name);
        },
        select(name) {
          if (name !== innerCurrent.value) {
            innerCurrent.value = name;
            emit("update:current", name);
            emit("change", name);
          }
        }
      })
    );
    const sidebarClass = computed(() => {
      return classNames(bem.b(), props.rootClass, scrollViewId);
    });
    const sidebarStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    __expose({});
    const __returned__ = { props, emit, bem, innerCurrent, sidebarItemMap, scrollViewId, scrollTop, instance, get memoScrollTop() {
      return memoScrollTop;
    }, set memoScrollTop(v) {
      memoScrollTop = v;
    }, onScroll, scrollIntoView, sidebarClass, sidebarStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>