<template>
  <view :class="menuClass" :style="menuStyle">
    <sar-menu-item
      v-for="(option, i) in options"
      :key="i"
      :text="option.text"
      :icon="option.icon"
      :icon-family="option.iconFamily"
      :disabled="option.disabled"
      :with-icon="withIcon"
      :direction="direction"
      @click="onClick(option)"
    />
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import SarMenuItem from "../menu-item/menu-item.vue";
import {
  defaultMenuProps
} from "./common";
export default  _defineComponent({
  components: {
    SarMenuItem,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "menu",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    options: { type: Array, required: false },
    direction: { type: String, required: false },
    theme: { type: String, required: false }
  }, defaultMenuProps),
  emits: ["select"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("menu");
    const onClick = (option) => {
      if (!option.disabled) {
        emit("select", option);
      }
    };
    const withIcon = computed(() => {
      return props.options.some((option) => !!option.icon);
    });
    const menuClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m(props.direction),
        bem.m(props.theme),
        bem.m("with-icon", withIcon.value),
        props.rootClass
      );
    });
    const menuStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, onClick, withIcon, menuClass, menuStyle, SarMenuItem };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>