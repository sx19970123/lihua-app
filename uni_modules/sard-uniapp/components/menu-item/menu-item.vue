<template>
  <view :class="menuItemClass" @click="onClick">
    <view
      v-if="icon || (withIcon && direction === 'vertical')"
      :class="bem.e('icon')"
    >
      <sar-icon v-if="icon" :name="icon" :family="iconFamily" />
    </view>
    <view v-if="text" :class="bem.e('text')">
      {{ text }}
    </view>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, createBem } from "../../utils";
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
  __name: "menu-item",
  props: {
    text: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    icon: { type: String, required: false },
    iconFamily: { type: String, required: false },
    withIcon: { type: Boolean, required: false },
    direction: { type: String, required: false }
  },
  emits: ["click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("menu");
    const onClick = (event) => {
      emit("click", event);
    };
    const menuItemClass = computed(() => {
      return classNames(bem.e("item"), bem.em("item", "disabled", props.disabled));
    });
    const __returned__ = { props, emit, bem, onClick, menuItemClass, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>