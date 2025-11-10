<template>
  <view :class="swiperDotClass" :style="swiperDotStyle">
    <template v-if="type === 'fraction'">
      {{ current + 1 }}/{{ innerList.length }}
    </template>
    <template v-else-if="type === 'title'">
      <view :class="bem.e('item')">
        {{ current + 1 }}/{{ innerList.length }}
        {{ innerList[current]?.[field] }}
      </view>
    </template>
    <template v-else>
      <view
        v-for="(n, i) in innerList.length"
        :key="i"
        :class="
          classNames(bem.e('item'), bem.em('item', 'active', i === current))
        "
      >
        {{ type === 'index' ? n : '' }}
      </view>
    </template>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import { defaultSwiperDotProps } from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {'dot' | 'dot-bar' | 'index' | 'title' | 'fraction'} type 指示点类型，默认值：'dot'。
 * @property {number} current 当前指示点索引，默认值：0。
 * @property {number} total 指示点总数，默认值：0。
 * @property {any[]} list 用于 `title` 类型的文本数据，默认值：-。
 * @property {string} field `type` 为 `title` 时，显示的内容字段，默认值：'title'。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "swiper-dot",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    type: { type: String, required: false },
    current: { type: Number, required: false },
    total: { type: Number, required: false },
    list: { type: Array, required: false },
    field: { type: String, required: false }
  }, defaultSwiperDotProps),
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("swiper-dot");
    const innerList = computed(() => {
      return props.list ?? Array(props.total).fill("");
    });
    const swiperDotClass = computed(() => {
      return classNames(bem.b(), bem.m(props.type), props.rootClass);
    });
    const swiperDotStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, bem, innerList, swiperDotClass, swiperDotStyle, get classNames() {
      return classNames;
    } };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>