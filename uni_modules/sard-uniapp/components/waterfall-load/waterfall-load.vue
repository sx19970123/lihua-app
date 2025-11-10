<template>
  <view :class="waterfallLoadClass" :style="waterfallLoadStyle">
    <view :class="bem.e('content')">
      <slot :on-load="onLoad" :overtime="overtime"></slot>
    </view>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed, onMounted, ref } from "vue";
import { classNames, createBem, stringifyStyle } from "../../utils";
import { useTimeout } from "../../use";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number} maxWait 最大等待时间，单位ms，默认值：0。
 * @property {number} width 自定义宽度，默认值：320。
 * @property {number} height 自定义高度，默认值：240。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "waterfall-load",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    maxWait: { type: Number, required: false },
    width: { type: Number, required: false },
    height: { type: Number, required: false }
  },
  emits: ["load"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("waterfall-load");
    let loaded = false;
    const overtime = ref(false);
    const currWidth = ref(props.width || 320);
    const currHeight = ref(props.height || 240);
    const paddingTop = computed(
      () => currHeight.value / currWidth.value * 100 + "%"
    );
    const { start } = useTimeout(
      () => {
        if (!loaded) {
          overtime.value = true;
          emit("load");
        }
      },
      () => props.maxWait || 0
    );
    const onLoad = ({ detail }) => {
      loaded = true;
      if (!overtime.value) {
        if (detail.width) {
          currWidth.value = detail.width;
          currHeight.value = detail.height;
        }
        emit("load");
      }
    };
    onMounted(() => {
      start();
    });
    __expose({});
    const waterfallLoadClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const waterfallLoadStyle = computed(() => {
      return stringifyStyle(
        {
          paddingTop: paddingTop.value
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, emit, bem, get loaded() {
      return loaded;
    }, set loaded(v) {
      loaded = v;
    }, overtime, currWidth, currHeight, paddingTop, start, onLoad, waterfallLoadClass, waterfallLoadStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>