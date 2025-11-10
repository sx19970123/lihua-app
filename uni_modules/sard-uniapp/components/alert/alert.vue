<template>
  <view v-if="visible" :class="alertClass" :style="alertStyle">
    <view v-if="showIcon" :class="bem.e('icon')">
      <slot name="icon">
        <sar-icon family="sari" :name="mapTypeIcon[type]" />
      </slot>
    </view>
    <view :class="bem.e('content')"><slot></slot></view>
    <view v-if="closable" :class="bem.e('close')" @click="onClose">
      <sar-icon family="sari" name="close" />
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import {
  defaultAlertProps,
  mapTypeIcon
} from "./common";
import SarIcon from "../icon/icon.vue";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {'primary' | 'success' | 'warning' | 'danger'} type 警告提示样式类型，默认值：'primary'。
 * @property {StyleValue} showIcon 是否显示图标，默认值：-。
 * @property {boolean} closable 是否显示关闭按钮，默认值：false。
 * @property {string} color 字体颜色，默认值：-。
 * @property {string} background 背景颜色，默认值：-。
 * @event {() => void} close 点击关闭按钮触发
 */
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
  __name: "alert",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    showIcon: { type: Boolean, required: false },
    closable: { type: Boolean, required: false },
    type: { type: String, required: false },
    color: { type: String, required: false },
    background: { type: String, required: false }
  }, defaultAlertProps),
  emits: ["close"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("alert");
    const visible = ref(true);
    const onClose = () => {
      visible.value = false;
      emit("close");
    };
    const alertClass = computed(() => {
      return classNames(bem.b(), bem.m(props.type), props.rootClass);
    });
    const alertStyle = computed(() => {
      return stringifyStyle(
        {
          color: props.color,
          background: props.background
        },
        props.rootStyle
      );
    });
    const __returned__ = { props, emit, bem, visible, onClose, alertClass, alertStyle, get mapTypeIcon() {
      return mapTypeIcon;
    }, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>