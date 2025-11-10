<template>
  <view :class="stepsClass" :style="stepsStyle">
    <slot>
      <sar-step
        v-for="(item, i) in itemList"
        :key="i"
        :index="i"
        :status="item.status"
        :name="item.name"
        :description="item.description"
      />
    </slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, provide, reactive, toRef } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import SarStep from "../step/step.vue";
import {
  defaultStepsProps,
  stepsContextSymbol
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number} current 当前步骤对应的索引值，默认值：0。
 * @property {StepsItem[]} itemList 所有步骤的数据，默认值：[]。
 * @property {boolean} center 是否居中，默认值：false。
 * @property {'vertical' | 'horizontal'} direction 排列方向，默认值：'horizontal'。
 * @property {boolean} reverse 水平排列时，文字和图标是否调换位置，默认值：false。
 * @property {StepsStatus} status 指定当前步骤的状态，默认值：-。
 * @property {string} iconFamily 图标字体，默认值：-。
 * @property {string} iconSize 图标字号，默认值：-。
 * @property {string} finishIcon 已完成状态的图标名称，默认值：-。
 * @property {string} processIcon 处理中状态的图标名称，默认值：-。
 * @property {string} waitIcon 等待中状态的图标名称，默认值：-。
 * @property {string} errorIcon 错误状态的图标名称，默认值：-。
 */
export default  _defineComponent({
  components: {
    SarStep,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "steps",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    current: { type: Number, required: false },
    itemList: { type: Array, required: false },
    center: { type: Boolean, required: false },
    direction: { type: String, required: false },
    reverse: { type: Boolean, required: false },
    status: { type: String, required: false },
    iconFamily: { type: String, required: false },
    iconSize: { type: String, required: false },
    finishIcon: { type: String, required: false },
    processIcon: { type: String, required: false },
    waitIcon: { type: String, required: false },
    errorIcon: { type: String, required: false }
  }, defaultStepsProps),
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("steps");
    provide(
      stepsContextSymbol,
      reactive({
        current: toRef(() => props.current),
        direction: toRef(() => props.direction),
        center: toRef(() => props.center),
        iconFamily: toRef(() => props.iconFamily),
        iconSize: toRef(() => props.iconSize),
        finishIcon: toRef(() => props.finishIcon),
        processIcon: toRef(() => props.processIcon),
        waitIcon: toRef(() => props.waitIcon),
        errorIcon: toRef(() => props.errorIcon),
        status: toRef(() => props.status),
        reverse: toRef(() => props.reverse)
      })
    );
    const stepsClass = computed(() => {
      return classNames(bem.b(), bem.m(props.direction), props.rootClass);
    });
    const stepsStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, bem, stepsClass, stepsStyle, SarStep };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>