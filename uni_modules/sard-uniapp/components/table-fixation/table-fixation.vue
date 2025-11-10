<template>
  <scroll-view
    :class="fixationClass"
    :style="fixationStyle"
    :scroll-y="scrollY"
    scroll-x
    :upper-threshold="0"
    :lower-threshold="0"
    :throttle="false"
    @scroll="onScroll"
    @scrolltoupper="onScrolltoupper"
    @scrolltolower="onScrolltolower"
  >
    <slot></slot>
  </scroll-view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import {
  computed,
  getCurrentInstance,
  onMounted,
  ref,
  watch,
  nextTick
} from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  getBoundingClientRect,
  uniqid
} from "../../utils";
import { useWindowResize } from "../../use";
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "table-fixation",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    tableWidth: { type: Number, required: false },
    scrollY: { type: Boolean, required: false },
    height: { type: String, required: false },
    bordered: { type: Boolean, required: false },
    underline: { type: Boolean, required: false }
  },
  emits: ["scroll-side"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("table");
    const scrollSide = ref(null);
    const onScroll = (event) => {
      const { scrollLeft, scrollWidth } = event.detail;
      const fixationWidth = fixationRect.value.width;
      if (scrollWidth > fixationWidth) {
        scrollSide.value = scrollLeft < 1 ? "left" : scrollWidth - scrollLeft - fixationWidth < 1 ? "right" : "middle";
      }
    };
    const onScrolltoupper = (event) => {
      if (event.detail.direction === "left") {
        scrollSide.value = "left";
      }
    };
    const onScrolltolower = (event) => {
      if (event.detail.direction === "right") {
        scrollSide.value = "right";
      }
    };
    const fixationId = uniqid();
    const instance = getCurrentInstance();
    const fixationRect = ref(null);
    watch([() => props.tableWidth, fixationRect], () => {
      scrollSide.value = props.tableWidth && fixationRect.value && props.tableWidth > fixationRect.value.width ? "left" : null;
    });
    onMounted(() => {
      nextTick(setFixationRect);
    });
    const setFixationRect = async () => {
      fixationRect.value = await getBoundingClientRect(`.${fixationId}`, instance);
    };
    useWindowResize(setFixationRect);
    watch(
      scrollSide,
      () => {
        emit("scroll-side", scrollSide.value);
      },
      {
        immediate: true
      }
    );
    const fixationClass = computed(() => {
      return classNames(
        bem.e("fixation"),
        bem.em("fixation", "bordered", props.bordered),
        bem.em("fixation", "underline", props.underline),
        props.rootClass,
        fixationId
      );
    });
    const fixationStyle = computed(() => {
      return stringifyStyle(props.rootStyle, {
        height: props.height
      });
    });
    const __returned__ = { props, emit, bem, scrollSide, onScroll, onScrolltoupper, onScrolltolower, fixationId, instance, fixationRect, setFixationRect, fixationClass, fixationStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>