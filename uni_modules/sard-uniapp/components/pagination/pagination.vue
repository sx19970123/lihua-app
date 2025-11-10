<template>
  <view :class="paginationClass" :style="paginationStyle">
    <view
      :class="
        classNames(
          bem.e('item'),
          bem.em('item', 'disabled', innerCurrent === 1),
          bem.e('prev'),
        )
      "
      @click="onPrevClick"
    >
      <slot name="prev">
        {{ t('previous') }}
      </slot>
    </view>
    <view v-if="type === 'simple'" :class="bem.e('ratio')">
      {{ innerCurrent }}/{{ innerPageCount }}
    </view>
    <template v-else>
      <view
        v-for="item in multiItems"
        :key="item.key"
        :class="
          classNames(bem.e('item'), bem.em('item', 'current', item.active))
        "
        @click="onItemClick(item.page)"
      >
        {{ item.text }}
      </view>
    </template>
    <view
      :class="
        classNames(
          bem.e('item'),
          bem.em('item', 'disabled', innerCurrent === innerPageCount),
          bem.e('next'),
        )
      "
      @click="onNextClick"
    >
      <slot name="next">
        {{ t('next') }}
      </slot>
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref, watch } from "vue";
import { classNames, stringifyStyle, createBem, clamp } from "../../utils";
import { useTranslate } from "../locale";
import {
  getPageRange,
  defaultPaginationProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number} total 总记录数，默认值：0。
 * @property {number} pageSize 每页记录数，默认值：10。
 * @property {number} current 当前页码，默认值：-。
 * @property {number} pageCount 总页数，默认自动计算，默认值：-。
 * @property {number} pageButtonCount 显示的页码按钮个数，默认值：5。
 * @property {boolean} hideOnSinglePage 只有一页时是否隐藏分页，默认值：false。
 * @property {'simple' | 'multi'} type 分页类型，默认值：'multi'。
 * @property {boolean} ellipsis 是否显示省略号，默认值：false。
 * @property {number} multiCount 点击省略号跳转的页数，默认值：5。
 * @event {(page: number) => void} update 页码改变时触发
 * @event {(page: number) => void} change 页码改变时触发
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "pagination",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    total: { type: Number, required: false },
    pageSize: { type: Number, required: false },
    current: { type: Number, required: false },
    pageCount: { type: Number, required: false },
    pageButtonCount: { type: Number, required: false },
    hideOnSinglePage: { type: Boolean, required: false },
    type: { type: String, required: false },
    ellipsis: { type: Boolean, required: false },
    multiCount: { type: Number, required: false }
  }, defaultPaginationProps),
  emits: ["update:current", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const { t } = useTranslate("pagination");
    const props = __props;
    const emit = __emit;
    const bem = createBem("pagination");
    const innerPageCount = computed(() => {
      return (props.pageCount ?? Math.ceil(props.total / props.pageSize)) || 1;
    });
    const innerCurrent = ref(props.current);
    watch(
      () => props.current,
      () => {
        innerCurrent.value = props.current;
      }
    );
    const range = computed(() => {
      return getPageRange(
        innerCurrent.value,
        innerPageCount.value,
        props.pageButtonCount
      );
    });
    const onPrevClick = () => {
      if (innerCurrent.value > 1) {
        changeTo(innerCurrent.value - 1);
      }
    };
    const onNextClick = () => {
      if (innerCurrent.value < innerPageCount.value) {
        changeTo(innerCurrent.value + 1);
      }
    };
    const onItemClick = (page) => {
      changeTo(page);
    };
    const changeTo = (page) => {
      if (page !== innerCurrent.value) {
        innerCurrent.value = page;
        emit("update:current", page);
        emit("change", page);
      }
    };
    const multiItems = computed(() => {
      if (props.type === "simple") {
        return [];
      }
      const length = range.value[1] - range.value[0] + 1;
      return Array(length).fill(0).map((_, i) => {
        let page = i + range.value[0];
        const isPrevMulti = i === 0 && page !== 1;
        const isNextMulti = i === length - 1 && page !== innerPageCount.value;
        const type = isPrevMulti ? -1 : isNextMulti ? 1 : 0;
        page = type === 0 ? page : clamp(
          innerCurrent.value + type * props.multiCount,
          1,
          innerPageCount.value
        );
        return {
          active: innerCurrent.value === page,
          page,
          key: i,
          text: props.ellipsis && (isPrevMulti || isNextMulti) ? "..." : page
        };
      });
    });
    const paginationClass = computed(() => {
      return classNames(bem.b(), bem.m(props.type), props.rootClass);
    });
    const paginationStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { t, props, emit, bem, innerPageCount, innerCurrent, range, onPrevClick, onNextClick, onItemClick, changeTo, multiItems, paginationClass, paginationStyle, get classNames() {
      return classNames;
    } };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>