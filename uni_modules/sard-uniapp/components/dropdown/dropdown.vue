<template>
  <view :class="dropdownClass" :style="dropdownStyle">
    <view :class="bem.e('shadow')" />
    <slot></slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref, provide, toRef, unref, toRaw, reactive } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import {
  dropdownContextSymbol,
  defaultDropdownProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {'down' | 'up'} direction 菜单弹出方向，默认值：'down'。
 * @property {boolean} disabled 是否禁用，默认值：false。
 * @property {boolean} awayClosable 是否在点击外部区域后自动隐藏，默认值：true。
 * @property {boolean} overlayClosable 是否在点击遮罩后自动隐藏，默认值：true。
 * @property {number} duration 显隐动画时长，单位 ms，默认值：300。
 * @property {boolean} togglable 是否可取消选中的选项，默认值：false。
 * @property {any} valueOnClear 取消选项时设置的值，默认值：undefined。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "dropdown",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    direction: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    awayClosable: { type: Boolean, required: false },
    overlayClosable: { type: Boolean, required: false },
    duration: { type: Number, required: false },
    togglable: { type: Boolean, required: false },
    valueOnClear: { type: Function, required: false }
  }, defaultDropdownProps),
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("dropdown");
    const items = ref( new Map());
    const someVisible = computed(() => {
      return [...items.value.values()].some((item) => unref(item.visible));
    });
    const hideOthers = (instance) => {
      items.value.forEach((expose, ins) => {
        if (toRaw(ins) !== instance) {
          expose.hide();
        }
      });
    };
    const register = (instance, imperative) => {
      items.value.set(instance, imperative);
    };
    const unregister = (instance) => {
      items.value.delete(instance);
    };
    provide(
      dropdownContextSymbol,
      reactive({
        direction: toRef(() => props.direction),
        disabled: toRef(() => props.disabled),
        awayClosable: toRef(() => props.awayClosable),
        overlayClosable: toRef(() => props.overlayClosable),
        duration: toRef(() => props.duration),
        togglable: toRef(() => props.togglable),
        valueOnClear: toRef(() => props.valueOnClear),
        hideOthers,
        register,
        unregister
      })
    );
    const dropdownClass = computed(() => {
      return classNames(bem.b(), bem.m("show", someVisible.value), props.rootClass);
    });
    const dropdownStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, bem, items, someVisible, hideOthers, register, unregister, dropdownClass, dropdownStyle };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>