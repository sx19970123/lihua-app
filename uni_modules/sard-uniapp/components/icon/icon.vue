<template>
  <view :class="iconClass" :style="iconStyle" @click="onClick">
    <image v-if="isImg" :class="bem.e('image')" :src="name" />
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, isFileUrl, createBem } from "../../utils";
import { defaultIconProps } from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} name 图标名称或图片链接，如果名称带有`/`，会被认为是图片图标，默认值：''。
 * @property {string} family 字体名称，默认值：'sari'。
 * @property {string} size 图标大小，默认值：-。
 * @property {string} color 图标颜色，默认值：-。
 * @property {boolean} separate 是否分开字体和字体名称，而不进行拼接，默认值：false。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "icon",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    name: { type: String, required: false },
    family: { type: String, required: false },
    size: { type: String, required: false },
    color: { type: String, required: false },
    separate: { type: Boolean, required: false }
  }, defaultIconProps),
  emits: ["click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("icon");
    const isImg = computed(() => {
      return isFileUrl(props.name);
    });
    const onClick = (event) => {
      emit("click", event);
    };
    const iconClass = computed(() => {
      if (isImg.value) {
        return classNames(bem.b(), props.rootClass);
      }
      if (props.name.includes(":")) {
        const [family, name] = props.name.split(":");
        return classNames(
          bem.b(),
          family,
          props.separate && family !== "sari" ? name : `${family}-${name}`,
          props.rootClass
        );
      }
      return classNames(
        bem.b(),
        props.family,
        props.separate && props.family !== "sari" ? props.name : `${props.family}-${props.name}`,
        props.rootClass
      );
    });
    const iconStyle = computed(() => {
      return stringifyStyle(
        {
          fontSize: props.size,
          color: props.color
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, emit, bem, isImg, onClick, iconClass, iconStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>