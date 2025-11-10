<template>
  <sar-table-fixation
    :table-width="tableWidth"
    :scroll-y="fixedRow"
    :height="height"
    :bordered="bordered"
    :underline="underline"
    @scroll-side="onScrollSide"
  >
    <view :id="tableId" :class="tableClass" :style="tableStyle">
      <slot></slot>
    </view>
  </sar-table-fixation>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import {
  computed,
  getCurrentInstance,
  nextTick,
  onMounted,
  provide,
  reactive,
  ref
} from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid,
  getBoundingClientRect,
  isNullish
} from "../../utils";
import {
  tableContextSymbol,
  defaultTableProps
} from "./common";
import SarTableFixation from "../table-fixation/table-fixation.vue";
import { useWindowResize } from "../../use";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {boolean} bordered 给单元格添加边框，默认值：false。
 * @property {boolean} underline 给单元格添加下边框，默认值：false。
 * @property {string} height 设置表格高度以便可以固定表头，默认值：-。
 */
export default  _defineComponent({
  components: {
    SarTableFixation,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "table",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    bordered: { type: Boolean, required: false },
    underline: { type: Boolean, required: false },
    height: { type: String, required: false }
  }, defaultTableProps),
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("table");
    const tableId = uniqid();
    const instance = getCurrentInstance();
    const tableWidth = ref(0);
    const setTableRect = async () => {
      const tableRect = await getBoundingClientRect(`#${tableId}`, instance);
      tableWidth.value = tableRect.width;
    };
    onMounted(() => {
      nextTick(setTableRect);
    });
    useWindowResize(setTableRect);
    const fixedRow = computed(() => {
      return !isNullish(props.height);
    });
    const scrollSide = ref(null);
    const onScrollSide = (side) => {
      scrollSide.value = side;
    };
    provide(tableContextSymbol, reactive({}));
    const tableClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("bordered", props.bordered),
        bem.m("underline", props.underline),
        bem.m("scroll-" + scrollSide.value, scrollSide.value),
        props.rootClass
      );
    });
    const tableStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, bem, tableId, instance, tableWidth, setTableRect, fixedRow, scrollSide, onScrollSide, tableClass, tableStyle, SarTableFixation };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>