<template>
  <view :class="progressBarClass" :style="progressBarStyle">
    <view :class="bem.e('track')" :style="trackStyle">
      <view :class="bem.e('piece')" :style="pieceStyle">
        <view v-if="showText && inside" :class="bem.e('text')">
          <slot>{{ percent }}%</slot>
        </view>
      </view>
    </view>
    <view v-if="showText && !inside && !status" :class="bem.e('text')">
      <slot>{{ percent }}%</slot>
    </view>
    <view v-if="status" :class="bem.e('status')">
      <sar-icon family="sari" :name="iconName" />
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import SarIcon from "../icon/icon.vue";
import {
  defaultProgressBarProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number} percent 当前进度，默认值：0。
 * @property {boolean} inside 在内部显示文本，默认值：false。
 * @property {string} color 进度条颜色，默认值：-。
 * @property {string} trackColor 轨道颜色，默认值：-。
 * @property {string} thickness 进度条粗细，默认值：-。
 * @property {string} showText 是否显示文本，默认值：true。
 * @property {boolean} striped 是否显示条纹样式，默认值：false。
 * @property {boolean} animated 是否显示条纹动画，默认值：false。
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
  __name: "progress-bar",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    percent: { type: Number, required: false },
    inside: { type: Boolean, required: false },
    color: { type: String, required: false },
    trackColor: { type: String, required: false },
    thickness: { type: String, required: false },
    showText: { type: Boolean, required: false },
    striped: { type: Boolean, required: false },
    animated: { type: Boolean, required: false },
    status: { type: String, required: false }
  }, defaultProgressBarProps),
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("progress-bar");
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
    const progressBarClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("inside", props.inside),
        bem.m("striped", props.striped),
        bem.m("animated", props.animated),
        bem.m(props.status, props.status),
        props.rootClass
      );
    });
    const progressBarStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const trackStyle = computed(() => {
      return stringifyStyle({
        height: props.thickness,
        backgroundColor: props.trackColor
      });
    });
    const pieceStyle = computed(() => {
      return stringifyStyle({
        width: `${props.percent}%`,
        backgroundColor: props.color
      });
    });
    const __returned__ = { props, bem, iconName, progressBarClass, progressBarStyle, trackStyle, pieceStyle, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>