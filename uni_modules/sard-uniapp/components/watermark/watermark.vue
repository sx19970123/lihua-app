<template>
  <view :class="watermarkClass" :style="watermarkStyle">
    <view :class="bem.e('canvas-wrapper')">
      <canvas
        :class="bem.e('canvas')"
        :canvas-id="canvasId"
        :id="canvasId"
      ></canvas>
    </view>
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
  toArray,
  getRotatedRect
} from "../../utils";
import {
  defaultWatermarkProps,
  defaultWatermarkFont
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number} width 图片水印的宽度，默认值：120。
 * @property {number} height 图片水印的宽度，默认值：64。
 * @property {number} rotate 水印的旋转角度，默认值：-22。
 * @property {number} zIndex 水印元素的z-index值，默认值：9。
 * @property {string} image 水印图片，建议使用 2x 或 3x 图像，默认值：-。
 * @property {string | string[]} content 水印文本内容，默认值：-。
 * @property {WatermarkFont} font 文字样式，默认值：-。
 * @property {[x: number, y: number]} gap 水印之间的间距，默认值：[30, 30]。
 * @property {[x: number, y: number]} offset 水印从容器左上角的偏移，默认值：[gap[0]/2, gap[1]/2]。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "watermark",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    width: { type: Number, required: false },
    height: { type: Number, required: false },
    rotate: { type: Number, required: false },
    zIndex: { type: Number, required: false },
    image: { type: String, required: false },
    content: { type: [String, Array], required: false },
    font: { type: Object, required: false },
    gap: { type: Array, required: false },
    offset: { type: Array, required: false }
  }, defaultWatermarkProps),
  setup(__props, { expose: __expose }) {
    const props = __props;
    const bem = createBem("watermark");
    const offset = computed(() => {
      const [offsetX = props.gap[0] / 2, offsetY = props.gap[1] / 2] = props.offset || [];
      return [offsetX, offsetY];
    });
    const mergedFont = computed(() => {
      return {
        ...defaultWatermarkFont,
        ...props.font
      };
    });
    const instance = getCurrentInstance();
    const canvasId = uniqid();
    const contextRef = shallowRef();
    const dataURL = ref("");
    const imageSize = ref(0);
    const imgPath = ref("");
    const imgSrcWidth = ref(0);
    const imgSrcHeight = ref(0);
    const imgFail = ref(false);
    watch(
      () => props.image,
      () => {
        if (props.image) {
          uni.getImageInfo({
            src: props.image,
            success(result) {
              imgPath.value = result.path;
              imgSrcWidth.value = result.width;
              imgSrcHeight.value = result.height;
              imgFail.value = false;
            },
            fail() {
              imgFail.value = true;
            }
          });
        }
      },
      {
        immediate: true
      }
    );
    const drawWatermark = () => {
      const context = contextRef.value;
      if (!context) {
        return;
      }
      context.clearRect(0, 0, 999, 999);
      let width = 0;
      let height = 0;
      let widths = [];
      let rotatedRect = { w1: 0, w2: 0, h1: 0, h2: 0, width: 0, height: 0 };
      const shouldDrawImage = imgPath.value && !imgFail.value && imgSrcWidth.value && imgSrcHeight.value;
      if (shouldDrawImage) {
        rotatedRect = getRotatedRect(props.width, props.height, props.rotate);
      } else {
        const { fontSize, fontStyle, fontWeight, fontFamily, color } = mergedFont.value;
        const textHeight = fontSize;
        context.font = [
          fontStyle,
          "normal",
          fontWeight,
          fontSize + "px",
          fontFamily
        ].join(" ");
        context.setFillStyle(color);
        context.setTextBaseline("top");
        toArray(props.content).filter(Boolean).forEach((item) => {
          const metrics = context.measureText(item);
          widths.push(metrics.width);
          width = Math.max(width, metrics.width);
          height += textHeight;
        });
        rotatedRect = getRotatedRect(width, height, props.rotate);
      }
      const draw = () => {
        context.save();
        let rotate = (props.rotate % 360 + 540) % 360 - 180;
        rotate = rotate === -180 ? 180 : rotate;
        if (rotate < 0 && rotate >= -90) {
          context.translate(0, rotatedRect.h1);
        } else if (rotate < -90) {
          context.translate(rotatedRect.w2, rotatedRect.height);
        } else if (rotate >= 0 && rotate < 90) {
          context.translate(rotatedRect.w1, 0);
        } else {
          context.translate(rotatedRect.width, rotatedRect.h2);
        }
        context.rotate(rotate * Math.PI / 180);
        if (shouldDrawImage) {
          context.drawImage(imgPath.value, 0, 0, props.width, props.height);
        } else {
          const { fontSize, textAlign } = mergedFont.value;
          const textHeight = fontSize;
          toArray(props.content).filter(Boolean).forEach((item, i) => {
            let x = 0;
            switch (textAlign) {
              case "left":
                x = 0;
                break;
              case "center":
                x = (width - widths[i]) / 2;
                break;
              case "right":
                x = width - widths[i];
                break;
            }
            context.fillText(item, x, i * textHeight);
          });
        }
        context.restore();
      };
      const [columnGap, rowGap] = props.gap;
      draw();
      context.translate(0, -rowGap - rotatedRect.height);
      draw();
      context.translate(
        rotatedRect.width + columnGap,
        (rotatedRect.height + rowGap) / 2
      );
      draw();
      context.translate(0, rowGap + rotatedRect.height);
      draw();
      context.draw(false, () => {
        const clipWidth = (rotatedRect.width + columnGap) * 2;
        const clipHeight = rotatedRect.height + rowGap;
        imageSize.value = clipWidth;
        uni.canvasToTempFilePath(
          {
            x: 0,
            y: 0,
            width: clipWidth,
            height: clipHeight,
            destWidth: clipWidth,
            destHeight: clipHeight,
            canvasId,
            success(res) {
              dataURL.value = res.tempFilePath;
            }
          },
          instance
        );
      });
    };
    watch(
      [
        contextRef,
        imgPath,
        imgSrcWidth,
        imgSrcHeight,
        imgFail,
        () => props.content,
        () => props.font,
        () => props.gap,
        () => props.rotate,
        () => props.width,
        () => props.height
      ],
      () => {
        drawWatermark();
      }
    );
    onMounted(async () => {
      contextRef.value = uni.createCanvasContext(canvasId, instance);
    });
    __expose({});
    const watermarkClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const watermarkStyle = computed(() => {
      const [offsetX, offsetY] = offset.value;
      return stringifyStyle(
        {
          top: `${offsetY}px`,
          left: `${offsetX}px`,
          width: `calc(100% - ${offsetX}px)`,
          height: `calc(100% - ${offsetY}px)`,
          backgroundSize: `${imageSize.value}px`,
          backgroundImage: `url(${dataURL.value})`,
          zIndex: props.zIndex
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, bem, offset, mergedFont, instance, canvasId, contextRef, dataURL, imageSize, imgPath, imgSrcWidth, imgSrcHeight, imgFail, drawWatermark, watermarkClass, watermarkStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>