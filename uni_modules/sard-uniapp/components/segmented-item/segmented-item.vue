<template>
  <view
    :class="segmentedItemClass"
    :style="segmentedItemStyle"
    @click="onClick"
  >
    <slot>
      <view :class="bem.e('icon')">
        <sar-icon :name="icon" :family="iconFamily" :size="iconSize" />
      </view>
      <view v-if="label" :class="bem.e('label')">{{ label }}</view>
    </slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, inject } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import {
  defaultSegmentedItemProps
} from "./common";
import {
  segmentedContextSymbol
} from "../segmented/common";
import SarIcon from "../icon/icon.vue";
import { useFormContext } from "../form";
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
  __name: "segmented-item",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    label: { type: [String, Number], required: false },
    value: { type: [String, Number, Boolean], required: false },
    icon: { type: String, required: false },
    iconFamily: { type: String, required: false },
    iconSize: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false }
  }, defaultSegmentedItemProps),
  emits: ["click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("segmented-item");
    const context = inject(segmentedContextSymbol, null);
    if (!context) {
      throw new Error("SegmentedItem must be included in Segmented.");
    }
    const formContext = useFormContext();
    const isSelected = computed(() => {
      return context.value === props.value;
    });
    const isDisabled = computed(() => {
      return formContext?.disabled || context?.disabled || props.disabled;
    });
    const isReadonly = computed(() => {
      return formContext?.readonly || context?.readonly || props.readonly;
    });
    const onClick = (event) => {
      if (!isDisabled.value && !isReadonly.value) {
        context.toggle(props.value);
      }
      emit("click", event);
    };
    __expose({});
    const segmentedItemClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("selected", isSelected.value),
        bem.m("disabled", isDisabled.value),
        bem.m("readonly", isReadonly.value),
        bem.m("with-icon", !!props.icon),
        bem.m(context.size),
        bem.m(context.shape),
        props.rootClass
      );
    });
    const segmentedItemStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, context, formContext, isSelected, isDisabled, isReadonly, onClick, segmentedItemClass, segmentedItemStyle, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>