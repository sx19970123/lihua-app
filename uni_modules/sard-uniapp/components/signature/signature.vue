<template>
  <view
    :class="signatureClass"
    :style="signatureStyle"
    @transitionend="onTransitionEnd"
  >
    <sar-status-bar v-if="fullScreen && customNavbar" />

    <view :class="bem.e('content')">
      <view :class="bem.e('body')">
        <view :id="contentId" :class="bem.e('canvas-content')">
          <canvas
            type="2d"
            :class="bem.e('canvas')"
            :style="{
              width: canvasCSSWidth,
              height: canvasCSSHeight,
            }"
            :canvas-id="canvasId"
            :id="canvasId"
            disable-scroll
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
            @touchcancel="onTouchEnd"
            @mousedown="onMouseDown"
            @ready="onCanvasReady"
          ></canvas>
          <canvas
            type="2d"
            :class="bem.e('covert-canvas')"
            :style="{
              width: covertCanvasCSSWidth,
              height: covertCanvasCSSHeight,
            }"
            :canvas-id="covertCanvasId"
            :id="covertCanvasId"
            @ready="onCanvasReady"
          ></canvas>
        </view>
      </view>

      <view :class="bem.e('footer')" :id="footerId">
        <view
          :class="bem.e('footer-content')"
          :style="{ width: footerContentWidth }"
        >
          <sar-status-bar v-if="fullScreen && customNavbar" reverse />
          <slot></slot>
          <view :class="bem.e('button-group')">
            <sar-button
              v-if="fullScreen"
              size="small"
              type="pale"
              block
              @click="onCancel"
            >
              {{ cancelText || t('cancel') }}
            </sar-button>
            <sar-button size="small" type="pale" block @click="onClear">
              {{ clearText || t('clear') }}
            </sar-button>
            <sar-button size="small" block @click="onConfirm">
              {{ confirmText || t('confirm') }}
            </sar-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import {
  computed,
  onMounted,
  watch,
  getCurrentInstance,
  ref,
  reactive,
  toRef
} from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid,
  getBoundingClientRect,
  getNode,
  getWindowInfo,
  sleep,
  isWeb,
  isApp,
  isAlipay,
  plusToDataURL
} from "../../utils";
import {
  defaultSignatureProps
} from "./common";
import SarButton from "../button/button.vue";
import { useTransition, useZIndex } from "../../use";
import { useTranslate } from "../locale";
import SarStatusBar from "../status-bar/status-bar.vue";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} color 笔触颜色，默认值：'#000'。
 * @property {number} lineWidth 线条宽度，默认值：3。
 * @property {string} background 背景颜色，默认值：-。
 * @property {boolean} fullScreen 是否全屏展示，默认值：false。
 * @property {boolean} visible 视屏时控制显隐，默认值：false。
 * @property {number} duration 显隐持续时间，默认值：150。
 * @property {string} cancelText 取消按钮文案，默认值：'取消'。
 * @property {string} clearText 清空按钮文案，默认值：'清空'。
 * @property {string} confirmText 确定按钮文案，默认值：'确定'。
 * @property {'png' | 'jpg'} type 导出图片类型，默认值：'png'。
 * @property {'dataURL' | 'filePath'} target confirm 事件回调接收的图片类型，默认值：'dataURL'。
 * @property {number} quality 转换为 DataURL 时的质量，默认值：0.92。
 * @event {(visible: boolean) => void} update 弹出框显隐时触发
 * @event {(dataURL: string) => void} confirm 点击确定按钮时触发
 * @event {() => void} clear 点击清空按钮时触发
 * @event {() => void} cancel 点击取消按钮时触发
 */
export default  _defineComponent({
  components: {
    SarButton,
    SarStatusBar,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "signature",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    color: { type: String, required: false },
    lineWidth: { type: Number, required: false },
    background: { type: String, required: false },
    fullScreen: { type: Boolean, required: false },
    duration: { type: Number, required: false },
    visible: { type: Boolean, required: false },
    cancelText: { type: String, required: false },
    clearText: { type: String, required: false },
    confirmText: { type: String, required: false },
    customNavbar: { type: Boolean, required: false },
    type: { type: String, required: false },
    target: { type: String, required: false },
    quality: { type: Number, required: false }
  }, defaultSignatureProps),
  emits: ["update:visible", "confirm", "clear", "cancel"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("signature");
    const { t } = useTranslate("signature");
    const instance = getCurrentInstance();
    const dpr = getWindowInfo().pixelRatio;
    const contentId = uniqid();
    const canvasCSSWidth = ref("");
    const canvasCSSHeight = ref("");
    let canvasWidth = 0;
    let canvasHeight = 0;
    const covertCanvasCSSWidth = ref("");
    const covertCanvasCSSHeight = ref("");
    let covertCanvasWidth = 0;
    let covertCanvasHeight = 0;
    const canvasId = uniqid();
    let canvas;
    let context;
    const covertCanvasId = uniqid();
    let covertCanvas;
    let covertContext;
    let prevPoints = [0, 0];
    let isEmpty = true;
    const mapImageType = {
      jpg: "image/jpeg",
      png: "image/png"
    };
    const setCanvasSize = async () => {
      const bodyRect = await getBoundingClientRect(`#${contentId}`, instance);
      canvasWidth = bodyRect.width * dpr;
      canvasHeight = bodyRect.height * dpr;
      covertCanvasWidth = canvasHeight;
      covertCanvasHeight = canvasWidth;
      if (!isApp && canvas) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
      }
      if (!isWeb && !isApp) {
        context.resetTransform();
        context.scale(dpr, dpr);
      }
      canvasCSSWidth.value = bodyRect.width + "px";
      canvasCSSHeight.value = bodyRect.height + "px";
      if (!isApp && covertCanvas) {
        covertCanvas.width = covertCanvasWidth;
        covertCanvas.height = covertCanvasHeight;
      }
      if (!isWeb && !isApp) {
        covertContext.resetTransform();
        covertContext.scale(dpr, dpr);
      }
      covertCanvasCSSWidth.value = bodyRect.height + "px";
      covertCanvasCSSHeight.value = bodyRect.width + "px";
    };
    const getCanvas = async () => {
      if (isApp) {
        context = uni.createCanvasContext(
          canvasId,
          instance
        );
        covertContext = uni.createCanvasContext(
          covertCanvasId,
          instance
        );
      } else {
        canvas = await getNode(`#${canvasId}`, instance);
        if (canvas) {
          context = canvas.getContext("2d");
        }
        covertCanvas = await getNode(`#${covertCanvasId}`, instance);
        if (covertCanvas) {
          covertContext = covertCanvas.getContext("2d");
        }
      }
      if (!props.fullScreen) {
        await initialCanvas();
        if (isAlipay) {
          await initialCanvas();
        }
      }
    };
    onMounted(() => {
      if (!isAlipay) {
        getCanvas();
      }
    });
    let canvasReadyCount = 0;
    const onCanvasReady = () => {
      canvasReadyCount++;
      if (isAlipay && canvasReadyCount === 2) {
        getCanvas();
      }
    };
    const onTouchStart = (event) => {
      const { x, y } = event.touches[0];
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = props.lineWidth;
      context.strokeStyle = props.color;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x, y);
      prevPoints = [x, y];
      context.stroke();
      if (isApp) {
        ;
        context.draw(true);
      }
      isEmpty = false;
    };
    const onTouchMove = (event) => {
      const { x, y } = event.touches[0];
      context.moveTo(...prevPoints);
      context.lineTo(x, y);
      prevPoints = [x, y];
      context.stroke();
      if (isApp) {
        ;
        context.draw(true);
      }
    };
    const onTouchEnd = () => {
      context.closePath();
    };
    let rect;
    let isDown = false;
    const onMouseDown = async (event) => {
      if (isApp) {
        return;
      }
      isDown = true;
      document.addEventListener("mousemove", onMouseMove, true);
      document.addEventListener("mouseup", onMouseUp, true);
      rect = await getBoundingClientRect(`#${canvasId}`, instance);
      const touchEvent = {
        ...event,
        touches: [{ x: event.clientX - rect.left, y: event.clientY - rect.top }]
      };
      onTouchStart(touchEvent);
    };
    const onMouseMove = (event) => {
      if (!isDown) {
        return;
      }
      event.preventDefault?.();
      const touchEvent = {
        ...event,
        touches: [{ x: event.clientX - rect.left, y: event.clientY - rect.top }]
      };
      onTouchMove(touchEvent);
    };
    const onMouseUp = () => {
      if (!isDown) {
        return;
      }
      isDown = false;
      document.removeEventListener("mousemove", onMouseMove, true);
      document.removeEventListener("mouseup", onMouseUp, true);
    };
    const initialCanvas = async () => {
      await setCanvasSize();
      if (!isWeb && !isApp) {
        await sleep(50);
      }
      if (context) {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        if (isApp) {
          ;
          context.draw();
        }
        if (props.background) {
          context.fillStyle = props.background;
          context.fillRect(0, 0, canvasWidth, canvasHeight);
          if (isApp) {
            ;
            context.draw();
          }
        }
      }
      isEmpty = true;
    };
    const clear = () => {
      initialCanvas();
      emit("clear");
    };
    const getCanvasDataURL = async () => {
      if (isApp) {
        return await plusToDataURL(await getCanvasFilePath());
      }
      return canvas.toDataURL(mapImageType[props.type]);
    };
    const getCanvasFilePath = async () => {
      return await new Promise((resolve) => {
        const options = {
          x: 0,
          y: 0,
          width: canvasWidth,
          height: canvasHeight,
          destWidth: canvasWidth,
          destHeight: canvasHeight,
          canvasId,
          canvas,
          fileType: props.type,
          quality: props.quality,
          success(res) {
            resolve(res.tempFilePath);
          }
        };
        if (isAlipay) {
          ;
          canvas.toTempFilePath(options);
        } else {
          uni.canvasToTempFilePath(options);
        }
      });
    };
    const drawRotateCanvas = async () => {
      covertContext.clearRect(0, 0, covertCanvasWidth, covertCanvasHeight);
      covertContext.save();
      covertContext.scale(1 / dpr, 1 / dpr);
      covertContext.translate(0, covertCanvasHeight);
      covertContext.rotate(-Math.PI / 2);
      if (isApp) {
        const dataURL = await getCanvasDataURL();
        covertContext.drawImage(dataURL, 0, 0);
      } else {
        covertContext.drawImage(canvas, 0, 0);
      }
      covertContext.restore();
      if (isApp) {
        await new Promise((resolve) => {
          ;
          covertContext.draw(false, () => {
            resolve();
          });
        });
      }
    };
    const getRotateCanvasDataUrl = async () => {
      if (isApp) {
        return await plusToDataURL(await getRotateCanvasFilePath());
      }
      await drawRotateCanvas();
      return covertCanvas.toDataURL(mapImageType[props.type]);
    };
    const getRotateCanvasFilePath = async () => {
      await drawRotateCanvas();
      return await new Promise((resolve) => {
        const options = {
          x: 0,
          y: 0,
          width: covertCanvasWidth,
          height: covertCanvasHeight,
          destWidth: covertCanvasWidth,
          destHeight: covertCanvasHeight,
          canvasId: covertCanvasId,
          canvas: covertCanvas,
          fileType: props.type,
          quality: props.quality,
          success(res) {
            resolve(res.tempFilePath);
          }
        };
        if (isAlipay) {
          ;
          canvas.toTempFilePath(options);
        } else {
          uni.canvasToTempFilePath(options);
        }
      });
    };
    const getCanvasTarget = async () => {
      if (props.target === "dataURL") {
        return await getCanvasDataURL();
      }
      return await getCanvasFilePath();
    };
    const getRotateCanvasTarget = async () => {
      if (props.target === "dataURL") {
        return await getRotateCanvasDataUrl();
      }
      return await getRotateCanvasFilePath();
    };
    const confirm = async () => {
      const dataURL = isEmpty ? "" : props.fullScreen ? await getRotateCanvasTarget() : await getCanvasTarget();
      emit("confirm", dataURL);
      if (props.fullScreen) {
        close();
      }
    };
    const close = () => {
      innerVisible.value = false;
      emit("update:visible", false);
    };
    const onCancel = () => {
      close();
      emit("cancel");
    };
    const onClear = () => {
      clear();
    };
    const onConfirm = () => {
      confirm();
    };
    const resize = () => {
      initialCanvas();
    };
    const innerVisible = ref(props.visible);
    watch(
      () => props.visible,
      () => {
        innerVisible.value = props.visible;
      }
    );
    const [zIndex, increaseZIndex] = useZIndex();
    let fullScreenInitialled = false;
    const { realVisible, transitionClass, onTransitionEnd } = useTransition(
      reactive({
        visible: innerVisible,
        duration: toRef(() => props.duration),
        prefix: bem.m("fade-"),
        async onVisibleHook(name) {
          if (props.fullScreen) {
            switch (name) {
              case "enter": {
                if (!fullScreenInitialled) {
                  fullScreenInitialled = true;
                  await sleep(50);
                  setFooterContentWidth();
                  await initialCanvas();
                }
                break;
              }
            }
          }
        }
      })
    );
    watch(
      innerVisible,
      () => {
        if (innerVisible.value) {
          increaseZIndex();
        }
      },
      {
        immediate: true
      }
    );
    const footerContentWidth = ref("");
    const footerId = uniqid();
    const setFooterContentWidth = async () => {
      const rect2 = await getBoundingClientRect(`#${footerId}`, instance);
      footerContentWidth.value = rect2.height + "px";
    };
    const signatureClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("full", props.fullScreen),
        bem.m("hidden", props.fullScreen && !realVisible.value),
        props.fullScreen ? transitionClass.value : "",
        props.rootClass
      );
    });
    const signatureStyle = computed(() => {
      return stringifyStyle(
        {
          // display: isAlipay || realVisible.value ? 'flex' : 'none',
          "--sar-button-padding-x-sm": "32rpx",
          transitionDuration: props.duration + "ms",
          zIndex: props.fullScreen && innerVisible.value ? zIndex.value : null
        },
        props.rootStyle
      );
    });
    __expose({
      clear,
      confirm,
      resize
    });
    const __returned__ = { props, emit, bem, t, instance, dpr, contentId, canvasCSSWidth, canvasCSSHeight, get canvasWidth() {
      return canvasWidth;
    }, set canvasWidth(v) {
      canvasWidth = v;
    }, get canvasHeight() {
      return canvasHeight;
    }, set canvasHeight(v) {
      canvasHeight = v;
    }, covertCanvasCSSWidth, covertCanvasCSSHeight, get covertCanvasWidth() {
      return covertCanvasWidth;
    }, set covertCanvasWidth(v) {
      covertCanvasWidth = v;
    }, get covertCanvasHeight() {
      return covertCanvasHeight;
    }, set covertCanvasHeight(v) {
      covertCanvasHeight = v;
    }, canvasId, get canvas() {
      return canvas;
    }, set canvas(v) {
      canvas = v;
    }, get context() {
      return context;
    }, set context(v) {
      context = v;
    }, covertCanvasId, get covertCanvas() {
      return covertCanvas;
    }, set covertCanvas(v) {
      covertCanvas = v;
    }, get covertContext() {
      return covertContext;
    }, set covertContext(v) {
      covertContext = v;
    }, get prevPoints() {
      return prevPoints;
    }, set prevPoints(v) {
      prevPoints = v;
    }, get isEmpty() {
      return isEmpty;
    }, set isEmpty(v) {
      isEmpty = v;
    }, mapImageType, setCanvasSize, getCanvas, get canvasReadyCount() {
      return canvasReadyCount;
    }, set canvasReadyCount(v) {
      canvasReadyCount = v;
    }, onCanvasReady, onTouchStart, onTouchMove, onTouchEnd, get rect() {
      return rect;
    }, set rect(v) {
      rect = v;
    }, get isDown() {
      return isDown;
    }, set isDown(v) {
      isDown = v;
    }, onMouseDown, onMouseMove, onMouseUp, initialCanvas, clear, getCanvasDataURL, getCanvasFilePath, drawRotateCanvas, getRotateCanvasDataUrl, getRotateCanvasFilePath, getCanvasTarget, getRotateCanvasTarget, confirm, close, onCancel, onClear, onConfirm, resize, innerVisible, zIndex, increaseZIndex, get fullScreenInitialled() {
      return fullScreenInitialled;
    }, set fullScreenInitialled(v) {
      fullScreenInitialled = v;
    }, realVisible, transitionClass, onTransitionEnd, footerContentWidth, footerId, setFooterContentWidth, signatureClass, signatureStyle, SarButton, SarStatusBar };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>