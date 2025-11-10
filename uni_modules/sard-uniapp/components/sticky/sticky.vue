<template>
  <view :class="stickyClass" :style="stickyStyle">
    <view :class="observeClass" :style="observeStyle">
      <view :class="fixationClass" :style="fixationStyle">
        <view :class="boundClass" :style="boundStyle">
          <slot></slot>
          <sar-resize-sensor initial :threshold="0" @resize="onResize" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import {
  computed,
  inject,
  onBeforeMount,
  onUnmounted,
  reactive,
  ref,
  toRef
} from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid,
  isNumber
} from "../../utils";
import { useIntersectionObserver } from "../../use";
import SarResizeSensor from "../resize-sensor/resize-sensor.vue";
import { stickyContextSymbol } from "../sticky-box/common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number} offsetTop 吸顶距离，单位px，默认值：-。
 * @property {number} offsetBottom 吸底距离，单位px，默认值：-。
 * @property {number} zIndex 粘性元素的层级，默认值：-。
 */
export default  _defineComponent({
  components: {
    SarResizeSensor,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "sticky",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    offsetTop: { type: Number, required: false },
    offsetBottom: { type: Number, required: false },
    zIndex: { type: [Number, String], required: false }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    const bem = createBem("sticky");
    const observeId = uniqid();
    const positionStyle = reactive({
      position: "relative",
      top: "",
      bottom: ""
    });
    const boundingBox = ref("none");
    const width = ref(null);
    const height = ref(null);
    const context = inject(stickyContextSymbol, null);
    const size = computed(() => {
      return {
        width: width.value !== null ? width.value + "px" : "",
        height: height.value !== null ? height.value + "px" : ""
      };
    });
    const { recreate } = useIntersectionObserver(
      (res) => {
        const { intersectionRatio, relativeRect, boundingClientRect } = res;
        Object.assign(positionStyle, {
          position: "relative",
          top: "",
          bottom: ""
        });
        if (intersectionRatio < 1) {
          if (isNumber(props.offsetTop) && boundingClientRect.top < relativeRect.top) {
            positionStyle.position = "fixed";
            positionStyle.top = props.offsetTop + "px";
          } else if (isNumber(props.offsetBottom) && boundingClientRect.bottom > relativeRect.bottom) {
            positionStyle.position = "fixed";
            positionStyle.bottom = props.offsetBottom + "px";
          }
        }
      },
      {
        selector: `.${observeId}`,
        thresholds: [1],
        offsetTop: toRef(() => props.offsetTop),
        offsetBottom: toRef(() => props.offsetBottom)
      }
    );
    let boxRecreate = null;
    if (context) {
      const { recreate: recreate2 } = useIntersectionObserver(
        (res) => {
          const { relativeRect, boundingClientRect } = res;
          if (boundingClientRect.top > relativeRect.bottom) {
            boundingBox.value = "top";
          } else if (boundingClientRect.bottom < relativeRect.top) {
            boundingBox.value = "bottom";
          } else {
            boundingBox.value = "none";
          }
        },
        {
          selector: `.${context.boxId}`,
          thresholds: [0],
          instance: context.instance,
          offsetTop: toRef(() => (props.offsetTop || 0) + (height.value || 0)),
          offsetBottom: toRef(
            () => (props.offsetBottom || 0) + (height.value || 0)
          )
        }
      );
      boxRecreate = recreate2;
    }
    const onResize = (res) => {
      width.value = res.width;
      height.value = res.height;
      recreate();
    };
    const onBoxResize = () => {
      boxRecreate?.();
    };
    onBeforeMount(() => {
      context?.onResize(onBoxResize);
    });
    onUnmounted(() => {
      context?.offResize(onBoxResize);
    });
    __expose({});
    const stickyClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const stickyStyle = computed(() => {
      return stringifyStyle(size.value, props.rootStyle);
    });
    const observeClass = computed(() => {
      return classNames(bem.e("observe"), observeId);
    });
    const observeStyle = computed(() => {
      return stringifyStyle(size.value);
    });
    const fixationClass = computed(() => {
      return classNames(bem.e("fixation"));
    });
    const fixationStyle = computed(() => {
      return stringifyStyle(
        size.value,
        {
          zIndex: props.zIndex
        },
        boundingBox.value === "none" ? positionStyle : {
          position: "absolute",
          top: boundingBox.value === "top" ? 0 : "",
          bottom: boundingBox.value === "bottom" ? 0 : ""
        }
      );
    });
    const boundClass = computed(() => {
      return classNames(bem.e("bound"));
    });
    const boundStyle = computed(() => {
      return stringifyStyle();
    });
    const __returned__ = { props, bem, observeId, positionStyle, boundingBox, width, height, context, size, recreate, get boxRecreate() {
      return boxRecreate;
    }, set boxRecreate(v) {
      boxRecreate = v;
    }, onResize, onBoxResize, stickyClass, stickyStyle, observeClass, observeStyle, fixationClass, fixationStyle, boundClass, boundStyle, SarResizeSensor };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>