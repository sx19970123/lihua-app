<template>
  <view :class="accordionItemClass" :style="accordionItemStyle">
    <view :class="classNames(bem.e('header'))" @click="onClick">
      <view :class="bem.e('title')">{{ title }}</view>
      <view v-if="value" :class="bem.e('value')">{{ value }}</view>
      <view :class="bem.e('arrow')">
        <sar-icon family="sari" :name="arrowName" />
      </view>
    </view>
    <sar-collapse :visible="visible">
      <view :class="bem.e('body')">
        <slot></slot>
      </view>
    </sar-collapse>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed, inject } from "vue";
import { classNames, stringifyStyle, createBem, isNullish } from "../../utils";
import {
  accoridonContextSymbol
} from "../accordion/common";
import SarCollapse from "../collapse/collapse.vue";
import SarIcon from "../icon/icon.vue";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} title 面板标题，默认值：-。
 * @property {string} value 面板的值，默认值：-。
 * @property {string | number} name 面板的唯一标识，默认值：-。
 * @property {boolean} disabled 禁用面板，默认值：false。
 * @event {(event: any) => void} click 点击面板头部时触发
 */
export default  _defineComponent({
  components: {
    SarCollapse,
    SarIcon,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "accordion-item",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    title: { type: String, required: false },
    value: { type: String, required: false },
    name: { type: [String, Number], required: false },
    disabled: { type: Boolean, required: false }
  },
  emits: ["click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("accordion-item");
    const context = inject(
      accoridonContextSymbol
    );
    if (!context) {
      throw new Error("AccordionItem must be included in Accordion.");
    }
    const onClick = (event) => {
      if (!props.disabled && !isNullish(props.name)) {
        context.toggle(props.name);
      }
      emit("click", event);
    };
    const visible = computed(() => {
      return context.multiple ? (context.value || []).includes(props.name) : context.value === props.name;
    });
    const arrowName = computed(() => {
      return visible.value ? "up" : "down";
    });
    const accordionItemClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("disabled", props.disabled),
        bem.m("borderless", context.hideBorder),
        props.rootClass
      );
    });
    const accordionItemStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, context, onClick, visible, arrowName, accordionItemClass, accordionItemStyle, get classNames() {
      return classNames;
    }, SarCollapse, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>