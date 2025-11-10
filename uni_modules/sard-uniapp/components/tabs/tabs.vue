<template>
  <view :class="tabsClass" :style="tabsStyle">
    <scroll-view
      :id="scrollId"
      :class="bem.e('scroll')"
      :scroll-x="scrollable"
      :scroll-left="scrollLeft"
      :scroll-with-animation="scrollInitialized"
    >
      <view :class="bem.e('container')">
        <view :id="wrapperId" :class="bem.e('wrapper')">
          <slot>
            <sar-tab
              v-for="(item, index) in list"
              :key="index"
              :title="item.title"
              :name="item.name ?? index"
              :disabled="item.disabled"
              :root-style="item.rootStyle"
              :root-class="item.rootClass"
            />
          </slot>
          <view
            v-if="type === 'line'"
            :class="bem.e('line')"
            :style="lineStyle"
          >
            <slot name="line"></slot>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import {
  computed,
  ref,
  provide,
  watch,
  getCurrentInstance,
  reactive
} from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid,
  getBoundingClientRect
} from "../../utils";
import {
  tabContextSymbol,
  defaultTabsProps
} from "./common";
import SarTab from "../tab/tab.vue";
import { usePopupEnter } from "../popup/common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number | string} current 当前选中的标签的 `name`，默认为标签的下标，默认值：-。
 * @property {TabProps[]} list 标签数组，会被默认插槽覆盖，默认值：-。
 * @property {'line' | 'pill' | 'card'} type 标签类型，默认值：'line'。
 * @property {boolean} scrollable 是否可滚动，默认值：false。
 * @event {(name: string | number | boolean) => void} update 当前激活的标签改变时触发
 * @event {(name: string | number| boolean) => void} change 当前激活的标签改变时触发
 */
export default  _defineComponent({
  components: {
    SarTab,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "tabs",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    current: { type: [String, Number, Boolean], required: false },
    list: { type: Array, required: false },
    type: { type: String, required: false },
    scrollable: { type: Boolean, required: false }
  }, defaultTabsProps),
  emits: ["update:current", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("tabs");
    const scrollToTab = async (name) => {
      if (!needScrollToTab.value || !tabMap.has(name)) {
        return;
      }
      const [scrollRect, wrapperRect, tabRect] = await Promise.all([
        getBoundingClientRect(`#${scrollId}`, instance),
        getBoundingClientRect(`#${wrapperId}`, instance),
        tabMap.get(name).getRect()
      ]);
      scrollLeft.value = tabRect.left - wrapperRect.left - (scrollRect.width - tabRect.width) / 2;
      if (props.type === "line") {
        lineLeft.value = tabRect.left - wrapperRect.left + tabRect.width / 2;
      }
      if (!scrollInitialized.value) {
        setTimeout(() => {
          scrollInitialized.value = true;
        }, 30);
      }
    };
    const scrollToTabQueue = ref();
    watch(scrollToTabQueue, () => {
      setTimeout(() => {
        if (scrollToTabQueue.value !== void 0) {
          scrollToTab(scrollToTabQueue.value);
          scrollToTabQueue.value = void 0;
        }
      }, 30);
    });
    const innerCurrent = ref(props.current);
    const instance = getCurrentInstance();
    const scrollId = uniqid();
    const wrapperId = uniqid();
    const lineLeft = ref(0);
    const scrollLeft = ref(0);
    const scrollInitialized = ref(false);
    const tabMap =  new Map();
    const needScrollToTab = computed(() => {
      return props.type === "line" || props.type === "pill" && props.scrollable;
    });
    watch(
      () => props.current,
      () => {
        if (props.current !== innerCurrent.value) {
          innerCurrent.value = props.current;
          scrollToTabQueue.value = innerCurrent.value;
        }
      }
    );
    watch(
      () => props.list,
      () => {
        scrollToTabQueue.value = innerCurrent.value;
      }
    );
    usePopupEnter(() => {
      scrollToTabQueue.value = innerCurrent.value;
    });
    provide(
      tabContextSymbol,
      reactive({
        current: innerCurrent,
        register(name, expose) {
          tabMap.set(name, expose);
        },
        unregister(name) {
          tabMap.delete(name);
        },
        select(name, initial) {
          innerCurrent.value = name;
          scrollToTabQueue.value = name;
          if (!initial) {
            emit("update:current", name);
            emit("change", name);
          }
        }
      })
    );
    const tabsClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m(props.type),
        bem.m("scrollable", props.scrollable),
        props.rootClass
      );
    });
    const tabsStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const lineStyle = computed(() => {
      return stringifyStyle({
        left: lineLeft.value + "px",
        transitionDuration: scrollInitialized.value ? null : "0s",
        opacity: scrollInitialized.value ? null : 0
      });
    });
    const __returned__ = { props, emit, bem, scrollToTab, scrollToTabQueue, innerCurrent, instance, scrollId, wrapperId, lineLeft, scrollLeft, scrollInitialized, tabMap, needScrollToTab, tabsClass, tabsStyle, lineStyle, SarTab };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>