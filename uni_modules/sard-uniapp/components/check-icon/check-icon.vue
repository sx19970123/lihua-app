<template>
  <view :class="checkIconClass">
    <sar-icon v-if="iconName" family="sari" :name="iconName" />
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
  __name: "check-icon",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    shape: { type: String, required: false, default: "square" },
    type: { type: String, required: false, default: "check" }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("check-icon");
    const iconName = computed(() => {
      return props.disabled && props.type === "check" ? "check" : props.disabled && props.type === "dash" ? "dash" : props.type === "check" ? `check-${props.shape}-fill` : props.type === "dash" ? `dash-${props.shape}-fill` : props.type === "dot" ? `record-circle` : void 0;
    });
    const checkIconClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m(props.shape),
        bem.m(props.type),
        bem.m("disabled", props.disabled)
      );
    });
    const __returned__ = { props, bem, iconName, checkIconClass, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>