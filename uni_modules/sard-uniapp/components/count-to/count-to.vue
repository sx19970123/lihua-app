<template>
  {{ renderedNumer }}
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, onUnmounted, ref, watch } from "vue";
import { addSeparator, createAnimation } from "../../utils";
import { defaultCountToProps } from "./common";
/**
 * @property {number} value 滚动到的目标数值，默认值：0。
 * @property {number} precision 精度，即小数位数，默认值：0。
 * @property {string} separator 千分位分隔符，默认值：-。
 * @property {number} separatorDigit 默认每三位插入一个分隔符，也可以自定义，默认值：3。
 * @property {number} duration 滚动到目标值持续时间，单位 ms，默认值：2000。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "count-to",
  props:  _mergeDefaults({
    value: { type: Number, required: false },
    precision: { type: Number, required: false },
    separator: { type: String, required: false },
    separatorDigit: { type: Number, required: false },
    duration: { type: Number, required: false }
  }, defaultCountToProps),
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const number = ref(0);
    let tl;
    const renderedNumer = computed(() => {
      const fixedNum = number.value.toFixed(props.precision);
      return props.separator ? addSeparator(fixedNum, props.separator, props.separatorDigit) : fixedNum;
    });
    watch(
      () => props.value,
      () => {
        tl?.pause();
        tl = createAnimation(
          number,
          {
            value: props.value
          },
          {
            duration: props.duration,
            easing: "easeOutQuint",
            round: Math.pow(10, props.precision)
          }
        );
      },
      {
        flush: "post",
        immediate: true
      }
    );
    onUnmounted(() => {
      tl?.pause();
    });
    const __returned__ = { props, number, get tl() {
      return tl;
    }, set tl(v) {
      tl = v;
    }, renderedNumer };
    return __returned__;
  }
});
</script>
