<template>
  <view :class="sliderClass" :style="sliderStyle" @click="onSliderClick">
    <view
      :class="bem.e('track')"
      :id="trackId"
      :style="
        stringifyStyle({
          width: vertical ? trackSize : null,
          height: !vertical ? trackSize : null,
          backgroundColor: trackColor,
        })
      "
    >
      <view
        :class="bem.e('piece')"
        :style="
          stringifyStyle({
            [vertical ? 'top' : 'left']: rangePercent[0],
            [vertical ? 'height' : 'width']: rangePercent[1],
            backgroundColor: pieceColor,
          })
        "
      >
        <view
          v-if="range"
          :class="
            classNames(
              bem.e('thumb-container'),
              bem.em('thumb-container', 'start'),
            )
          "
          @touchstart="onTouchStart($event, 0)"
          @touchmove.stop.prevent="onTouchMove($event, 0)"
          @touchend="onTouchEnd($event)"
          @touchcancel="onTouchEnd($event)"
          @mousedown="onMouseDown0"
        >
          <slot name="start-thumb" :value="rangeValue[0]">
            <view :class="bem.e('thumb')" :style="thumbStyle"></view>
          </slot>
          <view v-if="showValue" :class="valueClass" :style="valueStyle">
            {{ rangeValue[0] }}
          </view>
        </view>
        <view
          :class="
            classNames(
              bem.e('thumb-container'),
              bem.em('thumb-container', 'end'),
            )
          "
          @touchstart="onTouchStart($event, 1)"
          @touchmove.stop.prevent="onTouchMove($event, 1)"
          @touchend="onTouchEnd($event)"
          @touchcancel="onTouchEnd($event)"
          @mousedown="onMouseDown1"
        >
          <slot name="end-thumb" :value="rangeValue[1]">
            <view :class="bem.e('thumb')" :style="thumbStyle"></view>
          </slot>
          <view v-if="showValue" :class="valueClass" :style="valueStyle">
            {{ rangeValue[1] }}
          </view>
        </view>
      </view>
      <template v-if="showScale">
        <view
          v-for="(scale, i) in scales"
          :key="i"
          :class="
            classNames(bem.e('scale'), bem.em('scale', 'active', scale.active))
          "
          :style="stringifyStyle(scale.style)"
        >
          <view :class="bem.e('scale-text')">{{ scale.value }}</view>
        </view>
      </template>
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, getCurrentInstance, ref, watch } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid,
  getBoundingClientRect,
  clamp,
  mround,
  arrayEqual,
  toArray
} from "../../utils";
import { useFormContext, useFormItemContext } from "../form/common";
import {
  defaultSliderProps
} from "./common";
import { useMouseDown } from "../../use";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {boolean} range 双滑块模式，默认值：false。
 * @property {number | number[]} modelValue 滑块值，默认值：-。
 * @property {number} min 最小值，默认值：0。
 * @property {number} max 最大值，默认值：100。
 * @property {number} step 步长，默认值：1。
 * @property {boolean} vertical 垂直方向滑块，默认值：false。
 * @property {boolean} disabled 禁用状态，默认值：false。
 * @property {boolean} readonly 只读状态，默认值：false。
 * @property {string} pieceColor 滑块间的轨道颜色，默认值：-。
 * @property {string} trackColor 滑块轨道颜色，默认值：-。
 * @property {string} trackSize 滑块轨道尺寸，默认值：-。
 * @property {string} thumbColor 滑块颜色，默认值：-。
 * @property {string} thumbSize 滑块尺寸，默认值：-。
 * @property {boolean} showValue 是否显示值，默认值：false。
 * @property {'top' | 'right' | 'bottom' | 'left'} valuePosition 值显示的位置，默认值：'top' / 'right'。
 * @property {string} valueBackground 设置值的背景色，默认值：-。
 * @property {string} valueColor 设置值的字体颜色，默认值：-。
 * @property {boolean} showScale 是否显示刻度，默认值：false。
 * @property {'top' | 'right' | 'bottom' | 'left'} scalePosition 刻度显示的位置，默认值：'bottom' / 'left'。
 * @property {boolean} validateEvent 是否触发表单验证，默认值：true。
 * @event {(value: number | number[]) => void} update 滑块值实时改变时触发
 * @event {(value: number | number[]) => void} input 滑块值实时改变时触发
 * @event {(value: number | number[]) => void} change 滑块点击或拖动结束且值改变时触发
 * @event {(event: TouchEvent) => void} drag-start 开始拖动时触发
 * @event {(event: TouchEvent) => void} drag-end 结束拖动时触发
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "slider",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    range: { type: Boolean, required: false },
    modelValue: { type: [Number, Array], required: false },
    min: { type: Number, required: false },
    max: { type: Number, required: false },
    step: { type: Number, required: false },
    vertical: { type: Boolean, required: false },
    disabled: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false },
    pieceColor: { type: String, required: false },
    trackColor: { type: String, required: false },
    trackSize: { type: String, required: false },
    thumbColor: { type: String, required: false },
    thumbSize: { type: String, required: false },
    showValue: { type: Boolean, required: false },
    valuePosition: { type: String, required: false },
    valueBackground: { type: String, required: false },
    valueColor: { type: String, required: false },
    showScale: { type: Boolean, required: false },
    scalePosition: { type: String, required: false },
    validateEvent: { type: Boolean, required: false }
  }, defaultSliderProps),
  emits: ["update:model-value", "input", "change", "drag-start", "drag-end"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("slider");
    const formContext = useFormContext();
    const formItemContext = useFormItemContext();
    const isDisabled = computed(() => {
      return formContext?.disabled || props.disabled;
    });
    const isReadonly = computed(() => {
      return formContext?.readonly || props.readonly;
    });
    const innerValue = ref(
      props.modelValue ?? (props.range ? [props.min, props.min] : props.min)
    );
    watch(
      () => props.modelValue,
      () => {
        innerValue.value = props.modelValue ?? (props.range ? [props.min, props.min] : props.min);
        if (props.validateEvent) {
          formItemContext?.onChange();
        }
      }
    );
    const trackId = uniqid();
    const instance = getCurrentInstance();
    let trackRect;
    let downValue;
    let moveValue;
    let downRatio = 0;
    let triggerMove = false;
    const onSliderClick = async (event) => {
      if (isDisabled.value || isReadonly.value) {
        return;
      }
      const { clientY, clientX } = "touches" in event ? event.touches[0] : "detail" in event && "clientX" in event.detail ? event.detail : event;
      trackRect = await getBoundingClientRect(`#${trackId}`, instance);
      const trackSize = props.vertical ? trackRect.height : trackRect.width;
      const tapCoord = props.vertical ? clientY : clientX;
      const startCoord = props.vertical ? trackRect.top : trackRect.left;
      const offset = tapCoord - startCoord;
      const ratio = offset / trackSize;
      const total = props.max - props.min;
      const tapValue = clamp(
        mround(props.min + total * ratio, props.step),
        props.min,
        props.max
      );
      let nextValue;
      if (Array.isArray(innerValue.value)) {
        const [start, end] = innerValue.value;
        if (Math.abs(tapValue - end) <= Math.abs(tapValue - start)) {
          if (tapValue !== innerValue.value[1]) {
            nextValue = [start, tapValue];
          }
        } else {
          if (tapValue !== innerValue.value[0]) {
            nextValue = [tapValue, end];
          }
        }
      } else {
        if (tapValue !== innerValue.value) {
          nextValue = tapValue;
        }
      }
      if (nextValue !== void 0) {
        innerValue.value = nextValue;
        emit("update:model-value", nextValue);
        emit("input", nextValue);
        emit("change", nextValue);
      }
    };
    let downCoord = {
      x: 0,
      y: 0
    };
    const onTouchStart = async (event, index) => {
      if (isDisabled.value || isReadonly.value) {
        return;
      }
      downCoord = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
      trackRect = await getBoundingClientRect(`#${trackId}`, instance);
      const thumbValue = Array.isArray(innerValue.value) ? innerValue.value[index] : innerValue.value;
      downRatio = (thumbValue - props.min) / (props.max - props.min);
      downValue = innerValue.value;
      moveValue = innerValue.value;
    };
    const onTouchMove = (event, index) => {
      if (isDisabled.value || isReadonly.value) {
        return;
      }
      if (!triggerMove) {
        triggerMove = true;
        emit("drag-start", event);
      }
      if (!trackRect) {
        return;
      }
      const deltaX = event.touches[0].clientX - downCoord.x;
      const deltaY = event.touches[0].clientY - downCoord.y;
      const trackSize = props.vertical ? trackRect.height : trackRect.width;
      const delta = props.vertical ? deltaY : deltaX;
      const ratio = delta / trackSize + downRatio;
      const total = props.max - props.min;
      const tapValue = clamp(
        mround(props.min + total * ratio, props.step),
        props.min,
        props.max
      );
      let nextValue;
      if (Array.isArray(downValue)) {
        const [start, end] = downValue;
        if (index === 1) {
          nextValue = tapValue < start ? [tapValue, start] : [start, tapValue];
        } else {
          nextValue = tapValue > end ? [end, tapValue] : [tapValue, end];
        }
      } else {
        nextValue = tapValue;
      }
      if (!arrayEqual(toArray(nextValue), toArray(moveValue))) {
        moveValue = nextValue;
        innerValue.value = nextValue;
        emit("update:model-value", nextValue);
        emit("input", nextValue);
      }
    };
    const onTouchEnd = (event) => {
      triggerMove = false;
      if (isDisabled.value || isReadonly.value) {
        return;
      }
      emit("drag-end", event);
      if (!arrayEqual(toArray(downValue), toArray(innerValue.value))) {
        emit("change", innerValue.value);
      }
    };
    const onMouseDown0 = useMouseDown(
      (event) => onTouchStart(event, 0),
      (event) => onTouchMove(event, 0)
    );
    const onMouseDown1 = useMouseDown(
      (event) => onTouchStart(event, 1),
      (event) => onTouchMove(event, 1)
    );
    const rangeValue = computed(() => {
      let startValue;
      let endValue;
      if (Array.isArray(innerValue.value)) {
        startValue = innerValue.value[0];
        endValue = innerValue.value[1];
      } else {
        startValue = props.min;
        endValue = innerValue.value;
      }
      return [startValue, endValue];
    });
    const rangePercent = computed(() => {
      const startRatio = (rangeValue.value[0] - props.min) / (props.max - props.min);
      const endRatio = (rangeValue.value[1] - props.min) / (props.max - props.min);
      const startPercent = startRatio * 100 + "%";
      const endPercent = (endRatio - startRatio) * 100 + "%";
      return [startPercent, endPercent];
    });
    const scales = computed(() => {
      if (!props.showScale) {
        return [];
      }
      const total = props.max - props.min;
      const direction = props.vertical ? "top" : "left";
      const scales2 = [
        {
          value: props.min,
          style: {
            [direction]: "0%"
          },
          active: props.min === rangeValue.value[0]
        }
      ];
      let scale = props.min;
      do {
        scale += props.step;
        if (scale > props.max) {
          scale = props.max;
        }
        scales2.push({
          value: scale,
          style: {
            [direction]: (scale - props.min) / total * 100 + "%"
          },
          active: scale >= rangeValue.value[0] && scale <= rangeValue.value[1]
        });
      } while (scale < props.max);
      return scales2;
    });
    const sliderClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("vertical", props.vertical),
        bem.m("disabled", isDisabled.value),
        bem.m("readonly", isReadonly.value),
        bem.m("show-scale", props.showScale),
        bem.m(
          `scale-${props.scalePosition ?? (props.vertical ? "left" : "bottom")}`,
          props.showScale
        ),
        props.rootClass
      );
    });
    const sliderStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const thumbStyle = computed(() => {
      return stringifyStyle({
        width: props.thumbSize,
        height: props.thumbSize,
        backgroundColor: props.thumbColor
      });
    });
    const valueClass = computed(() => {
      return classNames(
        bem.e("value"),
        bem.em("value", props.valuePosition ?? (props.vertical ? "right" : "top"))
      );
    });
    const valueStyle = computed(() => {
      return stringifyStyle({
        backgroundColor: props.valueBackground,
        color: props.valueColor
      });
    });
    const __returned__ = { props, emit, bem, formContext, formItemContext, isDisabled, isReadonly, innerValue, trackId, instance, get trackRect() {
      return trackRect;
    }, set trackRect(v) {
      trackRect = v;
    }, get downValue() {
      return downValue;
    }, set downValue(v) {
      downValue = v;
    }, get moveValue() {
      return moveValue;
    }, set moveValue(v) {
      moveValue = v;
    }, get downRatio() {
      return downRatio;
    }, set downRatio(v) {
      downRatio = v;
    }, get triggerMove() {
      return triggerMove;
    }, set triggerMove(v) {
      triggerMove = v;
    }, onSliderClick, get downCoord() {
      return downCoord;
    }, set downCoord(v) {
      downCoord = v;
    }, onTouchStart, onTouchMove, onTouchEnd, onMouseDown0, onMouseDown1, rangeValue, rangePercent, scales, sliderClass, sliderStyle, thumbStyle, valueClass, valueStyle, get classNames() {
      return classNames;
    }, get stringifyStyle() {
      return stringifyStyle;
    } };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>