<template>
  <view :class="indexesAnchorClass" :style="indexesAnchorStyle">
    <slot>
      {{ name }}
    </slot>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed, inject, onBeforeMount, getCurrentInstance } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  getBoundingClientRect,
  uniqid,
  isNullish
} from "../../utils";
import {
  indexesContextSymbol
} from "../indexes/common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number | string} name 索引锚点名称，默认值：-。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "indexes-anchor",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    name: { type: [String, Number], required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("indexes");
    const context = inject(indexesContextSymbol);
    if (!context) {
      throw new Error("IndexesAnchor must be included in Indexes.");
    }
    const anchorId = uniqid();
    const instance = getCurrentInstance();
    const getRect = () => {
      return getBoundingClientRect(`.${anchorId}`, instance);
    };
    onBeforeMount(() => {
      if (!isNullish(props.name)) {
        context.register(props.name, getRect);
      }
    });
    const indexesAnchorClass = computed(() => {
      return classNames(bem.e("anchor"), props.rootClass, anchorId);
    });
    const indexesAnchorStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, bem, context, anchorId, instance, getRect, indexesAnchorClass, indexesAnchorStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>