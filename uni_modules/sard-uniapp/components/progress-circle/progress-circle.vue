<template>
  <view :class="progressCircleClass" :style="progressCircleStyle">
    <view :class="trackClass" :style="trackStyle">
      <view :class="pieceClass" :style="pieceStyle">
        <view :class="capStartClass" :style="capStartStyle" />
        <view :class="capEndClass" :style="capEndStyle" />
      </view>
    </view>
    <slot>
      <view v-if="!status" :class="bem.e('text')">{{ percent }}%</view>
      <view v-if="status" :class="bem.e('status')">
        <sar-icon family="sari" :name="iconName" />
      </view>
    </slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import SarIcon from "../icon/icon.vue";
import {
  defaultProgressCircle
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number} percent 当前进度，默认值：0。
 * @property {string} color 进度条颜色，默认值：-。
 * @property {string} trackColor 轨道颜色，默认值：-。
 * @property {number} thickness 进度条粗细，表示占圆环直径的百分比值，默认值：4。
 * @property {string} size 圆环尺寸，默认值：-。
 * @property {'success' | 'warning' | 'error'} status 进度条当前状态，默认值：-。
 */
export default  _defineComponent({
  components: {
    SarIcon,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "progress-circle",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    percent: { type: Number, required: false },
    color: { type: String, required: false },
    trackColor: { type: String, required: false },
    thickness: { type: Number, required: false },
    size: { type: String, required: false },
    status: { type: String, required: false }
  }, defaultProgressCircle),
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("progress-circle");
    const iconName = computed(() => {
      if (!props.status) {
        return "";
      }
      return {
        success: "check-circle-fill",
        warning: "warning-fill",
        error: "x-circle-fill"
      }[props.status];
    });
    const radius = computed(() => {
      return 50 - props.thickness / 2;
    });
    const angle = computed(() => {
      return props.percent / 100 * 360;
    });
    const radian = computed(() => {
      return angle.value / 180 * Math.PI;
    });
    const mask = computed(() => {
      return `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3e%3ccircle stroke='black' fill='none' stroke-width='${props.thickness}' cx='50' cy='50' r='${radius.value}' /%3e%3c/svg%3e")`;
    });
    const progressCircleClass = computed(() => {
      return classNames(bem.b(), bem.m(props.status, props.status), props.rootClass);
    });
    const progressCircleStyle = computed(() => {
      return stringifyStyle(
        {
          width: props.size,
          height: props.size
        },
        props.rootStyle
      );
    });
    const trackClass = computed(() => {
      return classNames(bem.e("track"));
    });
    const trackStyle = computed(() => {
      return stringifyStyle({
        backgroundColor: props.trackColor,
        "-webkit-mask": mask.value,
        mask: mask.value
      });
    });
    const pieceClass = computed(() => {
      return classNames(bem.e("piece"));
    });
    const pieceStyle = computed(() => {
      return stringifyStyle({
        color: props.color,
        backgroundImage: `conic-gradient(currentColor ${angle.value}deg, transparent 0)`
      });
    });
    const capStartClass = computed(() => {
      return classNames(bem.e("cap"), bem.e("cap-start"));
    });
    const capStartStyle = computed(() => {
      return stringifyStyle({
        width: props.thickness + "%",
        height: props.thickness + "%"
      });
    });
    const capEndClass = computed(() => {
      return classNames(bem.e("cap"), bem.e("cap-end"));
    });
    const capEndStyle = computed(() => {
      return stringifyStyle({
        width: props.thickness + "%",
        height: props.thickness + "%",
        left: 50 + Math.sin(radian.value) * radius.value + "%",
        top: 50 - Math.cos(radian.value) * radius.value + "%"
      });
    });
    const __returned__ = { props, bem, iconName, radius, angle, radian, mask, progressCircleClass, progressCircleStyle, trackClass, trackStyle, pieceClass, pieceStyle, capStartClass, capStartStyle, capEndClass, capEndStyle, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>