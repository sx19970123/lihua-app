<template>
  <view :class="qrcodeClass" :style="qrcodeStyle">
    <view :class="bem.e('canvas-wrapper')">
      <canvas
        :class="canvasId"
        :width="canvasSize"
        :height="canvasSize"
        :style="{ width: canvasSize + 'px', height: canvasSize + 'px' }"
        :canvas-id="canvasId"
        :id="canvasId"
      ></canvas>
    </view>
    <image
      :src="dataURL"
      :show-menu-by-longpress="showMenuByLongpress"
      mode="aspectFit"
      :class="bem.e('image')"
    />
    <slot></slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import {
  computed,
  getCurrentInstance,
  onMounted,
  ref,
  shallowRef,
  watch
} from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid,
  qrcode
} from "../../utils";
import {
  defaultQrcodeProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} text 要编码的字符串数据，默认值：-。
 * @property {'L' | 'M' | 'Q' | 'H'} ecl 错误纠错级别，默认值：'M'。
 * @property {string} size 二维码呈现的大小，默认值：320rpx。
 * @property {number} canvasSize 画板的大小，默认值：400。
 * @property {string} color 二维码颜色，默认值：#000。
 * @property {string} bgColor 二维码背景颜色，默认值：#fff。
 * @property {number} quietZoneModules 安静区域模块数，默认值：2。
 * @property {boolean} showMenuByLongpress 长按图片显示菜单(微信小程序)，默认值：false。
 * @property {string} icon 二维码中图片的地址，默认值：-。
 * @event {(tempFilePath: string) => void} success 二维码图片绘制成功后触发，可用于获取临时文件路径
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "qrcode",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    text: { type: String, required: false },
    ecl: { type: String, required: false },
    type: { type: String, required: false },
    size: { type: String, required: false },
    canvasSize: { type: Number, required: false },
    color: { type: String, required: false },
    bgColor: { type: String, required: false },
    quietZoneModules: { type: Number, required: false },
    showMenuByLongpress: { type: Boolean, required: false },
    icon: { type: String, required: false }
  }, defaultQrcodeProps),
  emits: ["success"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("qrcode");
    const instance = getCurrentInstance();
    const canvasId = uniqid();
    const contextRef = shallowRef();
    const qrcodeMap = computed(() => {
      return qrcode(props.text, {
        ecl: props.ecl
      });
    });
    const dataURL = ref("");
    const drawQrcode = async () => {
      const context = contextRef.value;
      if (!context) {
        return;
      }
      const map = qrcodeMap.value;
      const size = props.canvasSize;
      const moduleSize = size / (map.length + props.quietZoneModules * 2);
      const margin = moduleSize * props.quietZoneModules;
      context.clearRect(0, 0, size, size);
      context.setFillStyle(props.bgColor);
      context.fillRect(0, 0, size, size);
      context.setFillStyle(props.color);
      map.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
          if (col === 1) {
            context.fillRect(
              colIndex * moduleSize + margin,
              rowIndex * moduleSize + margin,
              moduleSize,
              moduleSize
            );
          }
        });
      });
      await drawIcon(context);
      context.draw(false, () => {
        uni.canvasToTempFilePath(
          {
            x: 0,
            y: 0,
            width: size,
            height: size,
            destWidth: size,
            destHeight: size,
            canvasId,
            success(res) {
              dataURL.value = res.tempFilePath;
              emit("success", res.tempFilePath);
            },
            fail(err) {
              console.log("uni.canvasToTempFilePath fail", err);
            }
          },
          instance
        );
      });
    };
    const drawIcon = async (ctx) => {
      if (props.icon) {
        const iconInfo = await loadIcon(props.icon);
        const size = props.canvasSize;
        ctx.save();
        ctx.beginPath();
        ctx.drawImage(iconInfo.path, size * 0.4, size * 0.4, size * 0.2, size * 0.2);
        ctx.restore();
      }
    };
    const loadIcon = (path) => {
      return new Promise((resolve, reject) => {
        uni.getImageInfo({
          src: path,
          success(res) {
            resolve(res);
          },
          fail(err) {
            console.log("uni.getImageInfo fail", path);
            console.log("uni.getImageInfo fail", err);
            reject(err);
          }
        });
      });
    };
    watch(
      [
        contextRef,
        qrcodeMap,
        () => props.canvasSize,
        () => props.color,
        () => props.bgColor,
        () => props.quietZoneModules,
        () => props.icon
      ],
      () => {
        drawQrcode();
      }
    );
    onMounted(async () => {
      contextRef.value = uni.createCanvasContext(canvasId, instance);
    });
    const qrcodeClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const qrcodeStyle = computed(() => {
      return stringifyStyle(props.rootStyle, {
        width: props.size,
        height: props.size
      });
    });
    const __returned__ = { props, emit, bem, instance, canvasId, contextRef, qrcodeMap, dataURL, drawQrcode, drawIcon, loadIcon, qrcodeClass, qrcodeStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>