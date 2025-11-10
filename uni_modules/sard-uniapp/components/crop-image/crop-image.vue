<template>
  <sar-popup
    effect="full-fade"
    :visible="visible"
    :duration="duration"
    :overlay="false"
    @after-enter="onAfterEnter"
    @visible-hook="onVisibleHook"
  >
    <view :class="cropImageClass" :style="cropImageStyle">
      <view
        :class="bem.e('sensor')"
        @mousedown="onMouseDown"
        @touchstart="onTouchStart"
        @touchmove.stop.prevent="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchEnd"
      >
        <view :class="bem.e('focus')" :style="focusStyle">
          <view :class="bem.e('puppet')" :style="puppetStyle">
            <image
              v-if="imageOrigSize[0] > 0"
              mode="scaleToFill"
              :src="src"
              :class="bem.e('image')"
              :style="imageStyle"
              @touchstart="onImageTouchStart"
            />
          </view>
        </view>
      </view>
      <view :class="bem.e('mask')" :style="maskStyle"></view>

      <view :class="bem.e('toolbar')">
        <sar-button
          size="small"
          type="pale-text"
          color="white"
          block
          @click="onCancel"
        >
          <text style="font-size: var(--sar-text-base); font-weight: bold">
            {{ cancelText || t('cancel') }}
          </text>
        </sar-button>
        <sar-button
          size="small"
          type="pale-text"
          color="white"
          block
          @click="onReset"
        >
          <sar-icon family="sari" name="undo" size="var(--sar-text-xl)" />
        </sar-button>
        <sar-button
          size="small"
          type="pale-text"
          color="white"
          block
          @click="onRotate"
        >
          <sar-icon
            family="sari"
            name="rotate-left"
            size="var(--sar-text-xl)"
          />
        </sar-button>
        <sar-button size="small" block @click="onConfirm">
          <text style="font-weight: bold">
            {{ confirmText || t('confirm') }}
          </text>
        </sar-button>
      </view>
    </view>

    <view v-if="isCropping" :class="bem.e('loading')">
      <sar-loading />
    </view>
  </sar-popup>

  <view :class="bem.e('canvas-wrapper')">
    <canvas
      type="2d"
      :hidpi="false"
      :canvas-id="canvasId"
      :id="canvasId"
      :style="canvasStyle"
    ></canvas>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, getCurrentInstance, onBeforeUnmount, ref, watch } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  getWindowInfo,
  getAspectFillSize,
  getAspectFitSize,
  uniqid,
  isApp,
  getNode,
  isWeb,
  createInertialAnimate,
  isAlipay,
  sleep
} from "../../utils";
import {
  defaultCropImageProps
} from "./common";
import { useDragPinch, useTimeout } from "../../use";
import { useTranslate } from "../locale";
import SarPopup from "../popup/popup.vue";
import SarIcon from "../icon/icon.vue";
import SarButton from "../button/button.vue";
import SarLoading from "../loading/loading.vue";
const minGapX = 20;
const bounceCoeff = 4;
const maxScale = 5;
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {boolean} visible 是否显示裁剪弹框，默认值：false。
 * @property {string} src 要裁剪的图片，默认值：false。
 * @property {string} cropScale 裁剪的比例，默认值：'1:1'。
 * @property {'png' | 'jpg'} type 导出图片类型，默认值：'png'。
 * @property {number} quality 导出图片的质量，默认值：0.92。
 * @property {number} duration 弹窗显隐过渡时间（单位 ms），默认值：150。
 * @property {(filePath: string) => void} success 裁剪成功回调，默认值：-。
 * @property {(err: any) => void} fail 裁剪失败回调，默认值：-。
 * @property {() => void} complete 裁剪成功或失败回调，默认值：-。
 * @property {() => void} cancel 点击取消按钮时触发，默认值：-。
 * @property {(width: number, height: number) => number} beforeCrop 裁剪前回调，可以修改裁剪的尺寸；接收宽高，返回缩放比例，默认值：-。
 * @event {(visible: boolean) => void} update 弹出框显隐时触发
 * @event {(name: TransitionHookName) => void} visible-hook 入场/退场动画状态改变时触发
 * @event {() => void} before-enter 入场动画开始前触发
 * @event {() => void} enter 入场动画开始时触发
 * @event {() => void} after-enter 入场动画结束时触发
 * @event {() => void} enter-cancelled 入场动画取消时触发
 * @event {() => void} before-leave 退场动画开始前触发
 * @event {() => void} leave 退场动画开始时触发
 * @event {() => void} after-leave 退场动画结束时触发
 * @event {() => void} leave-cancelled 退场动画取消时触发
 */
export default  _defineComponent({
  components: {
    SarPopup,
    SarIcon,
    SarButton,
    SarLoading,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "crop-image",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    visible: { type: Boolean, required: false },
    src: { type: String, required: false },
    cropScale: { type: String, required: false },
    type: { type: String, required: false },
    quality: { type: Number, required: false },
    duration: { type: Number, required: false },
    success: { type: Function, required: false },
    fail: { type: Function, required: false },
    complete: { type: Function, required: false },
    cancel: { type: Function, required: false },
    id: { type: String, required: false },
    beforeCrop: { type: Function, required: false },
    cancelText: { type: String, required: false },
    confirmText: { type: String, required: false }
  }, defaultCropImageProps),
  emits: ["update:visible", "before-enter", "enter", "after-enter", "enter-cancelled", "before-leave", "leave", "after-leave", "leave-cancelled", "visible-hook"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("crop-image");
    const { t } = useTranslate("signature");
    const innerVisible = ref(props.visible);
    watch(
      () => props.visible,
      () => {
        innerVisible.value = props.visible;
      }
    );
    const close = () => {
      innerVisible.value = false;
      emit("update:visible", false);
    };
    const onVisibleHook = (name) => {
      emit("visible-hook", name);
      emit(name);
    };
    const { windowWidth, windowHeight, pixelRatio } = getWindowInfo();
    const aspectRatio = computed(() => {
      const [w, h] = props.cropScale.split(":").map(Number);
      return [w, h];
    });
    const minGapY = windowWidth / 750 * 128;
    const focusRect = computed(() => {
      const maxWidth = windowWidth - minGapX * 2;
      const maxHeight = windowHeight - minGapY * 2;
      const [width, height] = getAspectFitSize(
        ...aspectRatio.value,
        maxWidth,
        maxHeight
      );
      const left = (windowWidth - width) / 2;
      const top = (windowHeight - height) / 2;
      return [left, top, width, height];
    });
    const rotate = ref(0);
    const actualRotate = ref(0);
    const { start: onRotateEnd } = useTimeout(() => {
      actualRotate.value = rotate.value;
    }, 150 + 100);
    watch(rotate, () => {
      onRotateEnd();
    });
    const isRotating = computed(() => rotate.value !== actualRotate.value);
    const isStillRotating = ref(false);
    const { start: stopRotateLater, stop: cancelStopRotate } = useTimeout(() => {
      isStillRotating.value = false;
    }, 150);
    watch(isRotating, () => {
      cancelStopRotate();
      if (isRotating.value) {
        isStillRotating.value = true;
      } else {
        stopRotateLater();
      }
    });
    const maskStyle = computed(() => {
      const [left, top, width, height] = focusRect.value;
      return {
        left: left + "px",
        top: top + "px",
        width: width + "px",
        height: height + "px"
      };
    });
    const focusStyle = computed(() => {
      return {
        ...maskStyle.value,
        transition: isRotating.value ? "" : "none",
        transform: `rotate(${rotate.value - actualRotate.value}deg)`
      };
    });
    const imageOrigSize = ref([0, 0]);
    watch(
      () => props.src,
      () => {
        imageOrigSize.value = [0, 0];
        rotate.value = 0;
        actualRotate.value = 0;
        isStillRotating.value = false;
        if (props.src) {
          uni.getImageInfo({
            src: props.src,
            success(res) {
              imageOrigSize.value = [res.width, res.height];
            }
          });
        }
      },
      {
        immediate: true
      }
    );
    const imageCoverSize = ref([0, 0]);
    watch(
      imageOrigSize,
      () => {
        const [, , width, height] = focusRect.value;
        imageCoverSize.value = getAspectFillSize(
          ...imageOrigSize.value,
          width,
          height
        );
      },
      {
        immediate: true
      }
    );
    const reversedCoverSize = computed(() => {
      const size = [...imageCoverSize.value];
      return actualRotate.value % 180 !== 0 ? size.reverse() : size;
    });
    const imgLeft = ref(0);
    const imgTop = ref(0);
    const imgWidth = ref(0);
    const imgHeight = ref(0);
    watch(
      imageCoverSize,
      ([width, height]) => {
        imgWidth.value = width;
        imgHeight.value = height;
        imgLeft.value = 0;
        imgTop.value = 0;
      },
      {
        immediate: true
      }
    );
    watch(actualRotate, (rotate2, oldRotate) => {
      const oldWidth = imgWidth.value;
      const oldHeight = imgHeight.value;
      const oldTop = imgTop.value;
      const oldLeft = imgLeft.value;
      const [, , focusWidth, focusHeight] = focusRect.value;
      const top = focusHeight / 2 - oldTop;
      const left = focusWidth / 2 - oldLeft;
      const right = oldWidth - left;
      const bottom = oldHeight - top;
      const r = (rotate2 - oldRotate) % 360;
      let topOpposite = 0;
      let leftOpposite = 0;
      if (r === 0) return;
      switch (r) {
        case -90:
        case 270:
          topOpposite = right;
          leftOpposite = top;
          break;
        case -180:
        case 180:
          topOpposite = bottom;
          leftOpposite = right;
          break;
        case -270:
        case 90:
          topOpposite = left;
          leftOpposite = bottom;
          break;
      }
      imgTop.value = focusHeight / 2 - topOpposite;
      imgLeft.value = focusWidth / 2 - leftOpposite;
      if (rotate2 % 180 - oldRotate % 180 !== 0) {
        const [width, height] = [oldWidth, oldHeight].reverse();
        imgWidth.value = width;
        imgHeight.value = height;
      }
    });
    const isCaptured = ref(false);
    const inInertia = ref(false);
    const puppetStyle = computed(() => {
      const [width, height] = reversedCoverSize.value;
      const scale = imgWidth.value / width || 1;
      const x = imgLeft.value;
      const y = imgTop.value;
      return {
        width: width + "px",
        height: height + "px",
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        transition: isStillRotating.value || isCaptured.value || inInertia.value ? "none" : ""
      };
    });
    const imageStyle = computed(() => {
      const [reversedCoverWidth, reversedCoverHeight] = reversedCoverSize.value;
      const r = Math.abs(actualRotate.value) % 360;
      const [width, height] = r % 180 !== 0 ? [reversedCoverHeight, reversedCoverWidth] : [reversedCoverWidth, reversedCoverHeight];
      return {
        width: width + "px",
        height: height + "px",
        transform: `translate(-50%, -50%) rotate(${actualRotate.value}deg)`
      };
    });
    const onImageTouchStart = (event) => {
      if (isWeb) {
        event.preventDefault();
      }
    };
    let stopInertialAnimate = null;
    onBeforeUnmount(() => {
      stopInertialAnimate?.();
    });
    const { onMouseDown, onTouchStart, onTouchMove, onTouchEnd } = useDragPinch({
      onOffset(offsetX, offsetY) {
        const [, , focusWidth, focusHeight] = focusRect.value;
        if (imgWidth.value !== focusWidth) {
          if (imgLeft.value > 0 || imgLeft.value < focusWidth - imgWidth.value) {
            offsetX /= bounceCoeff;
          }
          imgLeft.value += offsetX;
        }
        if (imgHeight.value !== focusHeight) {
          if (imgTop.value > 0 || imgTop.value < focusHeight - imgHeight.value) {
            offsetY /= bounceCoeff;
          }
          imgTop.value += offsetY;
        }
      },
      onScale(originX, originY, scale) {
        const [focusLeft, focusTop, focusWidth, focusHeight] = focusRect.value;
        let offsetScaleX = imgWidth.value * scale;
        let offsetScaleY = imgHeight.value * scale;
        if (imgWidth.value < focusWidth || imgHeight.value < focusHeight) {
          offsetScaleX /= bounceCoeff;
          offsetScaleY /= bounceCoeff;
        } else if (imgWidth.value > reversedCoverSize.value[0] * maxScale && offsetScaleX > 0) {
          offsetScaleX = 0;
          offsetScaleY = 0;
        }
        const nextWidth = imgWidth.value + offsetScaleX;
        const nextHeight = imgHeight.value + offsetScaleY;
        const originScaleX = (originX - focusLeft - imgLeft.value) / imgWidth.value;
        const originScaleY = (originY - focusTop - imgTop.value) / imgHeight.value;
        imgLeft.value += (imgWidth.value - nextWidth) * originScaleX;
        imgTop.value += (imgHeight.value - nextHeight) * originScaleY;
        imgWidth.value = nextWidth;
        imgHeight.value = nextHeight;
      },
      onCapture() {
        isCaptured.value = true;
        stopInertialAnimate?.();
      },
      onRelease(v) {
        const [, , focusWidth, focusHeight] = focusRect.value;
        const currWidth = imgWidth.value;
        const currHeight = imgHeight.value;
        const tooSmall = currWidth < focusWidth || currHeight < focusHeight;
        const tooBig = currWidth > reversedCoverSize.value[0] * maxScale;
        if (tooSmall || tooBig) {
          const [width, height] = tooSmall ? getAspectFillSize(currWidth, currHeight, focusWidth, focusHeight) : reversedCoverSize.value.map((item) => item * maxScale);
          imgWidth.value = width;
          imgHeight.value = height;
          imgLeft.value += (currWidth - width) / 2;
          imgTop.value += (currHeight - height) / 2;
        }
        const overLeft = imgLeft.value > 0;
        const overRight = imgLeft.value < focusWidth - imgWidth.value;
        if (overLeft) {
          imgLeft.value = 0;
        } else if (overRight) {
          imgLeft.value = focusWidth - imgWidth.value;
        }
        const overTop = imgTop.value > 0;
        const overBottom = imgTop.value < focusHeight - imgHeight.value;
        if (overTop) {
          imgTop.value = 0;
        } else if (overBottom) {
          imgTop.value = focusHeight - imgHeight.value;
        }
        isCaptured.value = false;
        if (tooSmall || overLeft || overRight || overTop || overBottom) return;
        if (v.x === 0 && v.y === 0) return;
        inInertia.value = true;
        const animateList = [
          [v.x, imgLeft, focusWidth, imgWidth.value],
          [v.y, imgTop, focusHeight, imgHeight.value]
        ].filter(([v2]) => v2 !== 0).map(([v2, translate, boxSize, elSize]) => {
          const animate = createInertialAnimate(v2, {
            update(value) {
              let next = translate.value + value;
              const overStart = next > 0;
              const overEnd = next < boxSize - elSize;
              if (overStart) {
                next = 0;
              } else if (overEnd) {
                next = boxSize - elSize;
              }
              translate.value = next;
              if (overStart || overEnd) {
                animate.stop();
                tryFinish();
              }
            },
            complete() {
              tryFinish();
            }
          });
          animate.play();
          return animate;
        });
        const tryFinish = () => {
          if (animateList.every((animate) => !animate.isAnimating())) {
            inInertia.value = false;
          }
        };
        stopInertialAnimate = () => {
          animateList.forEach((animate) => {
            animate.stop();
          });
          inInertia.value = false;
          stopInertialAnimate = null;
        };
      }
    });
    const instance = getCurrentInstance();
    const canvasId = uniqid();
    let context;
    let canvas;
    const getCanvas = async () => {
      if (isApp) {
        context = uni.createCanvasContext(canvasId, instance);
      } else {
        canvas = await getNode(`#${canvasId}`, instance);
        context = canvas.getContext("2d");
      }
    };
    const onAfterEnter = () => {
      getCanvas();
    };
    const canvasWidth = ref(0);
    const canvasHeight = ref(0);
    const canvasStyle = computed(() => {
      return {
        width: canvasWidth.value + "px",
        height: canvasHeight.value + "px"
      };
    });
    const cropImage = async () => {
      return new Promise((resolve, reject) => {
        const [imgOrigW, imgOrigH] = imageOrigSize.value;
        const [, , focusWidth, focusHeight] = focusRect.value;
        const rotate2 = actualRotate.value % 360;
        let scale = (rotate2 % 180 !== 0 ? imgOrigH : imgOrigW) / imgWidth.value;
        let canvasW = focusWidth * scale;
        let canvasH = focusHeight * scale;
        let customScale = 1;
        if (props.beforeCrop) {
          customScale = props.beforeCrop(canvasW, canvasH);
        }
        canvasW *= customScale;
        canvasH *= customScale;
        scale *= customScale;
        const imgL = imgLeft.value * scale;
        const imgT = imgTop.value * scale;
        const imgW = imgOrigW * customScale;
        const imgH = imgOrigH * customScale;
        let tx = 0;
        let ty = 0;
        switch (rotate2) {
          case 0:
            tx = imgL;
            ty = imgT;
            break;
          case -90:
            tx = (imgW + imgT) * -1;
            ty = imgL;
            break;
          case -180:
            tx = (imgW + imgL) * -1;
            ty = (imgH + imgT) * -1;
            break;
          case -270:
            tx = imgT;
            ty = (imgH + imgL) * -1;
            break;
        }
        canvasWidth.value = canvasW;
        canvasHeight.value = canvasH;
        if (!isApp) {
          canvas.width = canvasW;
          canvas.height = canvasH;
        }
        const canvasToTempFilePath = () => {
          let width = canvasWidth.value;
          let height = canvasHeight.value;
          if (isWeb || isApp) {
            width /= pixelRatio;
            height /= pixelRatio;
          }
          const options = {
            x: 0,
            y: 0,
            width,
            height,
            destWidth: canvasWidth.value,
            destHeight: canvasHeight.value,
            canvasId,
            canvas,
            fileType: props.type,
            quality: props.quality,
            success(res) {
              resolve(res.tempFilePath);
            },
            fail(err) {
              reject(err);
            }
          };
          if (isAlipay) {
            ;
            canvas.toTempFilePath(options);
          } else {
            uni.canvasToTempFilePath(options);
          }
        };
        const drawCanvas = (imgOrUrl) => {
          context.clearRect(0, 0, canvasW, canvasH);
          context.save();
          context.rotate(rotate2 * (Math.PI / 180));
          context.translate(tx, ty);
          context.scale(customScale, customScale);
          context.drawImage(
            imgOrUrl,
            0,
            0,
            imgOrigW,
            imgOrigH,
            0,
            0,
            imgOrigW,
            imgOrigH
          );
          context.restore();
          if (isApp) {
            ;
            context.draw(false, () => {
              canvasToTempFilePath();
            });
          } else {
            canvasToTempFilePath();
          }
        };
        if (isApp) {
          uni.getImageInfo({
            src: props.src,
            success(res) {
              setTimeout(() => {
                drawCanvas(res.path);
              }, 50);
            },
            fail(err) {
              reject(err);
            }
          });
        } else {
          const image = canvas.createImage ? canvas.createImage() : new Image();
          image.src = props.src;
          image.onload = async () => {
            await sleep(50);
            drawCanvas(image);
          };
          image.onerror = (err) => {
            reject(err);
          };
        }
      });
    };
    const onCancel = () => {
      props.cancel?.();
      close();
    };
    const onReset = () => {
      const current = Math.abs(rotate.value);
      const integer = Math.floor(current / 360) * 360;
      rotate.value = (integer + (current % 360 > 180 ? 360 : 0)) * -1;
    };
    const onRotate = () => {
      rotate.value -= 90;
    };
    const isCropping = ref(false);
    const onConfirm = () => {
      if (isCropping.value) {
        return;
      }
      isCropping.value = true;
      cropImage().then((filePath) => {
        close();
        props.success?.(filePath);
      }).catch((err) => {
        props.fail?.(err);
      }).finally(() => {
        isCropping.value = false;
        props.complete?.();
      });
    };
    const cropImageClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const cropImageStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    __expose({});
    const __returned__ = { props, emit, bem, t, innerVisible, close, onVisibleHook, windowWidth, windowHeight, pixelRatio, aspectRatio, minGapY, minGapX, focusRect, rotate, actualRotate, onRotateEnd, isRotating, isStillRotating, stopRotateLater, cancelStopRotate, maskStyle, focusStyle, imageOrigSize, imageCoverSize, reversedCoverSize, imgLeft, imgTop, imgWidth, imgHeight, isCaptured, inInertia, puppetStyle, imageStyle, onImageTouchStart, bounceCoeff, maxScale, get stopInertialAnimate() {
      return stopInertialAnimate;
    }, set stopInertialAnimate(v) {
      stopInertialAnimate = v;
    }, onMouseDown, onTouchStart, onTouchMove, onTouchEnd, instance, canvasId, get context() {
      return context;
    }, set context(v) {
      context = v;
    }, get canvas() {
      return canvas;
    }, set canvas(v) {
      canvas = v;
    }, getCanvas, onAfterEnter, canvasWidth, canvasHeight, canvasStyle, cropImage, onCancel, onReset, onRotate, isCropping, onConfirm, cropImageClass, cropImageStyle, SarPopup, SarIcon, SarButton, SarLoading };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>