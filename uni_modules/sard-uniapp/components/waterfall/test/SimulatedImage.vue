<template>
  <view class="relative box-border" :style="{ paddingTop }">
    <view class="absolute inset-0 flex justify-center items-center sbg-fourth">
      <text>{{ meta.width }}</text>
      <text>x</text>
      <text>{{ meta.height }}</text>
    </view>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { useTimeout } from "../../../use";
import { random } from "../../../utils";
import { computed, onMounted, ref } from "vue";
export default  _defineComponent({
  __name: "SimulatedImage",
  props: {
    meta: { type: Object, required: true }
  },
  emits: ["load"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const internalWidth = ref(320);
    const internalHeight = ref(240);
    const currWidth = computed(() => internalWidth.value);
    const currHeight = computed(() => internalHeight.value);
    const paddingTop = computed(
      () => currHeight.value / currWidth.value * 100 + "%"
    );
    const { start } = useTimeout(
      () => {
        internalWidth.value = props.meta.width;
        internalHeight.value = props.meta.height;
        emit("load", {
          detail: {
            width: props.meta.width,
            height: props.meta.height
          }
        });
      },
      random(50, 150)
    );
    onMounted(() => {
      start();
    });
    const __returned__ = { props, emit, internalWidth, internalHeight, currWidth, currHeight, paddingTop, start };
    return __returned__;
  }
});
</script>
