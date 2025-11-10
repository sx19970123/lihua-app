<template>
  <view :class="waterfallClass" :style="waterfallStyle">
    <slot></slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  provide,
  reactive,
  ref,
  watch
} from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  getBoundingClientRect,
  uniqid,
  throttle
} from "../../utils";
import {
  defaultWaterfallProps,
  waterfallContextKey
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number} columns 自定义列数，默认值：2。
 * @property {number} columnGap 列间距，单位px，默认值：16。
 * @property {number} rowGap 行间距，单位px，默认值：16。
 * @event {() => void} load 加载完时触发，无论是正常加载完，还是超时
 * @event {() => void} loadstart 瀑布流项项开始加载时触发
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "waterfall",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    columns: { type: Number, required: false },
    columnGap: { type: Number, required: false },
    rowGap: { type: Number, required: false }
  }, defaultWaterfallProps),
  emits: ["load", "loadstart"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("waterfall");
    const containerId = uniqid();
    const instance = getCurrentInstance();
    const containerWidth = ref(0);
    const containerHeight = ref(0);
    const columnWidth = computed(() => {
      return (containerWidth.value - (props.columns - 1) * props.columnGap) / props.columns;
    });
    onMounted(async () => {
      containerWidth.value = (await getBoundingClientRect(`.${containerId}`, instance)).width;
    });
    let loadStatus = "idle";
    let loadedHandlers = [];
    const onLoad = (handler) => {
      nextTick(() => {
        if (loadStatus === "idle") {
          handler();
        } else {
          if (!loadedHandlers.includes(handler)) {
            loadedHandlers.push(handler);
          }
        }
      });
    };
    const updateLoadStatus = () => {
      const includeLoading = items.some((item) => !item.loaded);
      if (includeLoading) {
        if (loadStatus === "idle") {
          loadStatus = "busy";
          emit("loadstart");
        }
      } else {
        if (loadStatus === "busy") {
          loadedHandlers.forEach((handler) => handler());
          loadedHandlers = [];
          loadStatus = "idle";
          emit("load");
        }
      }
    };
    const items = [];
    const addItem = (item) => {
      if (!items.includes(item)) {
        items.push(item);
        reflow();
        updateLoadStatus();
      }
    };
    const removeItem = (item) => {
      if (items.includes(item)) {
        items.splice(items.indexOf(item), 1);
        reflow();
        updateLoadStatus();
      }
    };
    const reflow = throttle(async () => {
      const columns = Array(props.columns).fill(0).map((_, index) => {
        return { colIndex: index, height: 0 };
      });
      for (const item of items) {
        if (!item.loaded) {
          break;
        }
        columns.sort((a, b) => a.height - b.height);
        const minColumn = columns[0];
        if (!minColumn) break;
        await item.beforeReflow();
        item.top = minColumn.height === 0 ? 0 : minColumn.height + props.rowGap;
        item.left = (props.columnGap + columnWidth.value) * minColumn.colIndex;
        item.visible = true;
        minColumn.height = item.top + item.height;
      }
      containerHeight.value = columns.sort((a, b) => b.height - a.height)[0].height;
    }, 50);
    const onItemLoad = () => {
      reflow();
      updateLoadStatus();
    };
    watch([() => props.columns, () => props.columnGap, () => props.rowGap], () => {
      setTimeout(() => {
        reflow();
      }, 50);
    });
    provide(
      waterfallContextKey,
      reactive({
        addItem,
        removeItem,
        onItemLoad,
        columnWidth
      })
    );
    __expose({
      reflow,
      onLoad
    });
    const waterfallClass = computed(() => {
      return classNames(bem.b(), containerId, props.rootClass);
    });
    const waterfallStyle = computed(() => {
      return stringifyStyle(
        {
          height: containerHeight.value + "px"
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, emit, bem, containerId, instance, containerWidth, containerHeight, columnWidth, get loadStatus() {
      return loadStatus;
    }, set loadStatus(v) {
      loadStatus = v;
    }, get loadedHandlers() {
      return loadedHandlers;
    }, set loadedHandlers(v) {
      loadedHandlers = v;
    }, onLoad, updateLoadStatus, items, addItem, removeItem, reflow, onItemLoad, waterfallClass, waterfallStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>