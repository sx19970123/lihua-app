<template>
  <view :class="indexesClass" :style="indexesStyle">
    <scroll-view
      :class="bem.e('scroll-view')"
      :id="scrollViewId"
      scroll-y
      :scroll-top="scrollTop"
      @scroll="onScroll"
    >
      <view>
        <slot></slot>
      </view>
    </scroll-view>
    <sar-indexes-nav
      :anchors="anchorNames"
      :current="innerCurrent"
      @select="onNavSelect"
    />
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  provide,
  watch
} from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  isNullish,
  uniqid,
  getBoundingClientRect
} from "../../utils";
import {
  indexesContextSymbol
} from "./common";
import { useScrollSpy } from "../../use";
import SarIndexesNav from "../indexes-nav/indexes-nav.vue";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number | string} current 设置当前活动的锚点，默认值：-。
 * @event {(name: number | string) => void} update 索引发生变更时触发
 * @event {(name: number | string) => void} change 索引发生变更时触发
 */
export default  _defineComponent({
  components: {
    SarIndexesNav,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "indexes",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    current: { type: [Number, String], required: false },
    hintDuration: { type: Number, required: false }
  },
  emits: ["update:current", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("indexes");
    const scrollViewId = uniqid();
    const instance = getCurrentInstance();
    const {
      scrollTop,
      innerCurrent,
      anchorRectList,
      register,
      unregister,
      onScroll,
      scrollTo,
      update,
      initialize
    } = useScrollSpy({
      defaultCurrent: props.current,
      getSpiedRect() {
        return getBoundingClientRect(`#${scrollViewId}`, instance);
      },
      onChange(name) {
        emit("change", name);
      }
    });
    provide(indexesContextSymbol, {
      register,
      unregister
    });
    onMounted(() => {
      nextTick(() => {
        initialize();
      });
    });
    watch(
      () => props.current,
      () => {
        if (!isNullish(props.current) && anchorNames.value.includes(props.current) && props.current !== innerCurrent.value) {
          innerCurrent.value = props.current;
          scrollTo(props.current);
        }
      }
    );
    const anchorNames = computed(() => {
      return anchorRectList.value.map((item) => item[0]);
    });
    const onNavSelect = (name) => {
      innerCurrent.value = name;
      scrollTo(name);
      emit("change", name);
    };
    const indexesClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const indexesStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    __expose({
      scrollTo,
      update
    });
    const __returned__ = { props, emit, bem, scrollViewId, instance, scrollTop, innerCurrent, anchorRectList, register, unregister, onScroll, scrollTo, update, initialize, anchorNames, onNavSelect, indexesClass, indexesStyle, SarIndexesNav };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>