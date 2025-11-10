<template>
  <view :class="imageClass" :style="imageStyle" @click="onClick">
    <view
      v-if="props.showLoading && status & STATUS.FIRST_LOADING"
      :class="bem.e('loading')"
    >
      <slot v-if="$slots.loading" name="loading"></slot>
      <sar-icon v-else :family="iconFamily || 'sari'" :name="loadingIcon" />
    </view>
    <view
      v-else-if="props.showError && status & STATUS.ERROR"
      :class="bem.e('error')"
    >
      <slot v-if="$slots.error" name="error"></slot>
      <sar-icon v-else :family="iconFamily || 'sari'" :name="errorIcon" />
    </view>
    <view v-else :class="displayClass" :style="displayStyle"></view>
    <!-- #ifdef WEB -->
    <img
      :src="src"
      :loading="lazyLoad ? 'lazy' : 'eager'"
      :class="interactionClass"
      @load="onLoad"
      @error="onError"
    />
    <!-- #endif -->
    <!-- #ifndef WEB -->
    <image
      :src="src"
      :lazy-load="lazyLoad"
      :webp="webp"
      :show-menu-by-longpress="showMenuByLongpress"
      :class="interactionClass"
      @load="onLoad"
      @error="onError"
    ></image>
    <!-- #endif -->
    <sar-resize-sensor
      v-if="resizeSensorVisible"
      initial
      :threshold="0"
      @resize="onResize"
    />
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref, watch } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  isNullish
} from "../../utils";
import {
  defaultImageProps,
  FIX_MODES,
  IMAGE_MODES
} from "./common";
import SarResizeSensor from "../resize-sensor/resize-sensor.vue";
import SarIcon from "../icon/icon.vue";
var STATUS =  ((STATUS2) => {
  STATUS2[STATUS2["UNSTATED"] = 0] = "UNSTATED";
  STATUS2[STATUS2["FIRST_LOADING"] = 1] = "FIRST_LOADING";
  STATUS2[STATUS2["LATER_LOADING"] = 4] = "LATER_LOADING";
  STATUS2[STATUS2["LOADED"] = 8] = "LOADED";
  STATUS2[STATUS2["ERROR"] = 16] = "ERROR";
  return STATUS2;
})(STATUS || {});
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} src 图片资源地址，默认值：-。
 * @property {'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix' | 'top' | 'bottom' | 'center' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right'} mode 图片资源地址，默认值：'aspectFill'。
 * @property {boolean} lazyLoad 图片懒加载，默认值：false。
 * @property {boolean} fade 是否需要淡入效果，默认值：true。
 * @property {boolean} webp 在系统不支持webp的情况下是否单独启用webp，默认值：false。
 * @property {boolean} showMenuByLongpress 开启长按图片显示识别小程序码菜单，默认值：true。
 * @property {string} width 图片宽度，默认值：'320px'。
 * @property {string} height 图片高度，默认值：'240px'。
 * @property {'circle' | 'square'} shape 图片形状，默认值：'square'。
 * @property {string} radius 图片圆角，默认值：-。
 * @property {string} loadingIcon 加载中的图标，默认值：'image'。
 * @property {string} errorIcon 加载失败的图标，默认值：'image-error'。
 * @property {string} iconFamily 图标族，默认值：'sari'。
 * @property {boolean} showLoading 是否显示加载中的图标或者自定义的插槽，默认值：true。
 * @property {boolean} showError 是否显示加载失败的图标或者自定义的插槽，默认值：true。
 * @property {string} background 图片背景颜色，默认值：-。
 * @event {(event: any) => void} click 点击图片时触发
 * @event {(event: any) => void} load 图片加载成功时触发
 * @event {(event: any) => void} error 图片加载失败时触发
 */
export default  _defineComponent({
  components: {
    SarResizeSensor,
    SarIcon,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "image",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    src: { type: String, required: false },
    mode: { type: String, required: false },
    lazyLoad: { type: Boolean, required: false },
    webp: { type: Boolean, required: false },
    showMenuByLongpress: { type: Boolean, required: false },
    width: { type: String, required: false },
    height: { type: String, required: false },
    shape: { type: String, required: false },
    radius: { type: String, required: false },
    loadingIcon: { type: String, required: false },
    errorIcon: { type: String, required: false },
    iconFamily: { type: String, required: false },
    showLoading: { type: Boolean, required: false },
    showError: { type: Boolean, required: false },
    background: { type: String, required: false },
    fade: { type: Boolean, required: false },
    customLoad: { type: Function, required: false }
  }, defaultImageProps),
  emits: ["click", "load", "error"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("image");
    const status = ref(0 /* UNSTATED */);
    const isLoaded = ref(false);
    const resizeSensorVisible = computed(
      () => FIX_MODES[props.mode]
    );
    const sensorWidth = ref(0);
    const sensorHeight = ref(0);
    const onResize = (res) => {
      sensorWidth.value = res.width;
      sensorHeight.value = res.height;
    };
    const aspectRatio = ref(0);
    const loadedUrl = ref("");
    const doLoad = (event) => {
      const { width, height } = event.target && !isNullish(event.target.naturalWidth) ? {
        width: event.target.naturalWidth,
        height: event.target.naturalHeight
      } : event.detail;
      aspectRatio.value = width / height;
      status.value = 8 /* LOADED */;
      isLoaded.value = true;
      loadedUrl.value = props.src;
      emit("load", event);
    };
    const onLoad = async (event) => {
      if (!props.customLoad) {
        doLoad(event);
      }
    };
    const onError = (event) => {
      status.value = 16 /* ERROR */;
      emit("error", event);
    };
    const onClick = (event) => {
      emit("click", event);
    };
    watch(
      () => props.src,
      async () => {
        if (props.src) {
          status.value = isLoaded.value && !(status.value & 16 /* ERROR */) ? 4 /* LATER_LOADING */ : 1 /* FIRST_LOADING */;
        }
        if (props.customLoad) {
          props.customLoad((event) => {
            doLoad(event);
          });
        }
      },
      {
        immediate: true
      }
    );
    __expose({});
    const imageClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m(props.shape),
        bem.m("animated", props.fade),
        props.rootClass
      );
    });
    const imageStyle = computed(() => {
      return stringifyStyle(props.rootStyle, {
        width: status.value & 8 /* LOADED */ && props.mode === "heightFix" ? aspectRatio.value * sensorHeight.value + "px" : props.width,
        height: status.value & 8 /* LOADED */ && props.mode === "widthFix" ? sensorWidth.value / aspectRatio.value + "px" : props.height,
        borderRadius: props.shape === "square" ? props.radius : void 0,
        background: status.value & 8 /* LOADED */ ? "transparent" : props.background
      });
    });
    const displayClass = computed(() => {
      return classNames(bem.e("display"));
    });
    const displayStyle = computed(() => {
      return stringifyStyle({
        backgroundImage: loadedUrl.value ? `url(${loadedUrl.value})` : "none",
        backgroundPosition: IMAGE_MODES[props.mode][0],
        backgroundSize: IMAGE_MODES[props.mode][1]
      });
    });
    const interactionClass = computed(() => {
      return classNames(bem.e("interaction"));
    });
    const __returned__ = { props, emit, bem, STATUS, status, isLoaded, resizeSensorVisible, sensorWidth, sensorHeight, onResize, aspectRatio, loadedUrl, doLoad, onLoad, onError, onClick, imageClass, imageStyle, displayClass, displayStyle, interactionClass, SarResizeSensor, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>