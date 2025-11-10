<template>
  <sar-crop-image v-bind="innerProps" v-model:visible="innerProps.visible" />
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref } from "vue";
import SarCropImage from "../crop-image/crop-image.vue";
import {
  defaultCropImageAgentProps,
  imperativeName
} from "./common";
import { useImperative } from "../../use";
export default  _defineComponent({
  components: {
    SarCropImage,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "crop-image-agent",
  props:  _mergeDefaults({
    id: { type: String, required: false },
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    visible: { type: Boolean, required: false },
    src: { type: String, required: false },
    cropScale: { type: String, required: false },
    type: { type: String, required: false },
    quality: { type: Number, required: false },
    duration: { type: Number, required: false },
    success: { type: Function, required: false },
    fail: { type: Function, required: false },
    complete: { type: Function, required: false },
    cancel: { type: Function, required: false },
    beforeCrop: { type: Function, required: false },
    cancelText: { type: String, required: false },
    confirmText: { type: String, required: false }
  }, defaultCropImageAgentProps()),
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const innerProps = ref({ ...props });
    const imperative = {
      show(newProps) {
        innerProps.value = {
          ...props,
          ...newProps,
          visible: true
        };
      },
      hide() {
        innerProps.value = {
          ...innerProps.value,
          visible: false
        };
      }
    };
    useImperative(
      imperativeName,
      imperative,
      computed(() => innerProps.value.id)
    );
    const __returned__ = { props, innerProps, imperative, SarCropImage };
    return __returned__;
  }
});
</script>
