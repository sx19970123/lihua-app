<template>
  <view :class="waterfallItemClass" :style="waterfallItemStyle">
    <slot :on-load="onLoad" :column-width="context.columnWidth"></slot>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import {
  computed,
  getCurrentInstance,
  inject,
  onMounted,
  onBeforeUnmount,
  reactive,
  ref,
  watch
} from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid,
  getBoundingClientRect
} from "../../utils";
import { waterfallContextKey } from "../waterfall/common";
import { useTimeout } from "../../use";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "waterfall-item",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const bem = createBem("waterfall-item");
    const instance = getCurrentInstance();
    const itemId = uniqid();
    const item = reactive({
      loaded: false,
      visible: false,
      height: 0,
      top: 0,
      left: 0,
      beforeReflow: async () => {
        await updateHeight();
      }
    });
    const updateHeight = async () => {
      try {
        item.height = (await getBoundingClientRect(`.${itemId}`, instance)).height;
      } catch {
      }
    };
    const context = inject(waterfallContextKey);
    const onLoad = () => {
      if (!item.loaded) {
        item.loaded = true;
        context.onItemLoad();
      }
    };
    onMounted(() => {
      context.addItem(item);
    });
    onBeforeUnmount(() => {
      context.removeItem(item);
    });
    __expose({});
    const waterfallItemClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("show", item.visible),
        itemId,
        props.rootClass
      );
    });
    const laterVisible = ref(false);
    const { start } = useTimeout(() => {
      laterVisible.value = true;
    }, 100);
    watch(
      () => item.visible,
      () => {
        if (item.visible) {
          start();
        } else {
          laterVisible.value = false;
        }
      }
    );
    const waterfallItemStyle = computed(() => {
      return stringifyStyle(
        {
          width: context.columnWidth + "px",
          transform: `translate3d(${item.left}px,${item.top}px,0px)`,
          transition: laterVisible.value ? `opacity var(--sar-waterfall-duration),transform var(--sar-waterfall-duration)` : `opacity var(--sar-waterfall-duration)`
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, bem, instance, itemId, item, updateHeight, context, onLoad, waterfallItemClass, laterVisible, start, waterfallItemStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>