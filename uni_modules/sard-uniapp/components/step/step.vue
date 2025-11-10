<template>
  <view :class="stepClass" :style="stepStyle">
    <view :class="bem.e('header')">
      <view :class="classNames(bem.e('line'), bem.e('line-before'))"></view>
      <view :class="bem.e('icon')">
        <slot name="icon" :status="currentStatus">
          <sar-icon
            :family="context.iconFamily || 'sari'"
            :name="statusIcon"
            :size="context.iconSize"
          />
        </slot>
      </view>
      <view :class="classNames(bem.e('line'), bem.e('line-after'))"></view>
    </view>
    <view :class="bem.e('body')">
      <slot :status="currentStatus">
        <view :class="bem.e('name')">{{ name }}</view>
        <view v-if="description" :class="bem.e('description')">
          {{ description }}
        </view>
      </slot>
    </view>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed, inject } from "vue";
import SarIcon from "../icon/icon.vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import { stepsContextSymbol } from "../steps/common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {StepsStatus} status 自定义状态，默认值：-。
 * @property {string} name 步骤名称，默认值：-。
 * @property {string} description 步骤描述，默认值：-。
 * @property {number} index 步骤下标（必填），默认值：-。
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
  __name: "step",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    status: { type: String, required: false },
    name: { type: String, required: false },
    description: { type: String, required: false },
    index: { type: Number, required: true }
  },
  setup(__props, { expose: __expose }) {
    const props = __props;
    __expose({});
    const bem = createBem("step");
    const context = inject(stepsContextSymbol);
    if (!context) {
      throw new Error("Step must be included in Steps.");
    }
    const currentStatus = computed(() => {
      return props.status ?? (props.index < context.current ? "finish" : props.index === context.current ? context.status ?? "process" : "wait");
    });
    const statusIcon = computed(() => {
      return {
        finish: context.finishIcon,
        process: context.processIcon,
        wait: context.waitIcon,
        error: context.errorIcon
      }[currentStatus.value];
    });
    const position = computed(() => {
      return props.index < context.current ? "behind" : context.current === props.index ? "self" : "front";
    });
    const stepClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("center", context.center),
        bem.m(currentStatus.value),
        bem.m(position.value),
        bem.m(context.direction),
        bem.m("reverse", context.reverse),
        props.rootClass
      );
    });
    const stepStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, bem, context, currentStatus, statusIcon, position, stepClass, stepStyle, SarIcon, get classNames() {
      return classNames;
    } };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>