<template>
  <view :class="fabItemClass" :style="fabItemStyle" @click="onClick">
    <view
      v-if="!isVisibleEmpty(name) && !context.hideName"
      :class="bem.e('name')"
    >
      {{ name }}
    </view>
    <view
      :class="bem.e('btn')"
      :style="stringifyStyle({ background: background, color: color })"
    >
      <slot>
        <sar-icon :family="iconFamily" :name="icon" />
      </slot>
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, inject } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  isVisibleEmpty
} from "../../utils";
import {
  defaultFabItemProps
} from "./common";
import { fabContextSymbol } from "../fab/common";
import SarIcon from "../icon/icon.vue";
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
  __name: "fab-item",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    name: { type: String, required: false },
    color: { type: String, required: false },
    background: { type: String, required: false },
    icon: { type: String, required: false },
    iconFamily: { type: String, required: false },
    isEntry: { type: Boolean, required: false },
    index: { type: Number, required: false },
    item: { type: Object, required: false }
  }, defaultFabItemProps),
  emits: ["click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("fab-item");
    const context = inject(fabContextSymbol);
    const onClick = (event) => {
      if (!props.isEntry) {
        context.onItemClick(props.item || {}, props.index || 0);
      }
      emit("click", event);
    };
    __expose({});
    const fabItemClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("left", context.isLeft),
        bem.m("entry", props.isEntry),
        props.rootClass
      );
    });
    const fabItemStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, context, onClick, fabItemClass, fabItemStyle, get stringifyStyle() {
      return stringifyStyle;
    }, get isVisibleEmpty() {
      return isVisibleEmpty;
    }, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>