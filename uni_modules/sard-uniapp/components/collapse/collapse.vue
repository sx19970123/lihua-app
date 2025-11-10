<template>
  <view
    :class="collapseClass"
    :style="collapseStyle"
    @transitionend="onTransitionEnd"
  >
    <view
      :class="classNames(bem.e('content'), contentClass)"
      :style="stringifyStyle(contentStyle)"
      :id="contentId"
    >
      <slot></slot>
    </view>
  </view>
</template>

<script>
import { defineComponent as _defineComponent } from "vue";
import { getCurrentInstance, watch, computed, ref } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid,
  getBoundingClientRect
} from "../../utils";
/**
 * @property {boolean} visible 是否可见，默认值：false。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "collapse",
  props: {
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    contentClass: { type: String, required: false },
    contentStyle: { type: String, required: false },
    visible: { type: Boolean, required: false }
  },
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("collapse");
    const instance = getCurrentInstance();
    const contentId = uniqid();
    const getHeight = async () => {
      return (await getBoundingClientRect(`#${contentId}`, instance)).height;
    };
    const collapseHeight = ref(props.visible ? "auto" : "0px");
    const open = () => {
      collapseHeight.value = "0px";
      setTimeout(async () => {
        const height = await getHeight();
        collapseHeight.value = height + "px";
      }, 30);
    };
    const close = async () => {
      const height = await getHeight();
      collapseHeight.value = height + "px";
      setTimeout(async () => {
        collapseHeight.value = "0px";
      }, 30);
    };
    const onTransitionEnd = () => {
      if (collapseHeight.value !== "0px") {
        collapseHeight.value = "auto";
      }
    };
    watch(
      () => props.visible,
      () => {
        if (props.visible) {
          open();
        } else {
          close();
        }
      }
    );
    const collapseClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const collapseStyle = computed(() => {
      return stringifyStyle(
        {
          height: collapseHeight.value,
          overflow: collapseHeight.value === "auto" ? "visible" : "hidden"
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, bem, instance, contentId, getHeight, collapseHeight, open, close, onTransitionEnd, collapseClass, collapseStyle, get classNames() {
      return classNames;
    }, get stringifyStyle() {
      return stringifyStyle;
    } };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>