<template>
  <sar-popout
    v-model:visible="innerVisible"
    :title="title"
    :show-confirm="showConfirm"
    :root-class="popoutClass"
    :root-style="popoutStyle"
    @confirm="onConfirm"
    @visible-hook="onVisibleHook"
  >
    <template #visible="{ already }">
      <sar-cascader
        v-if="already"
        :model-value="popoutValue"
        :options="options"
        :field-keys="fieldKeys"
        :hint-text="hintText"
        :change-on-select="changeOnSelect"
        :label-render="labelRender"
        :all-levels="allLevels"
        @select="(option, tabIndex) => $emit('select', option, tabIndex)"
        @change="onChange"
      >
        <template #top="{ tabIndex }">
          <slot name="top" :tab-index="tabIndex"></slot>
        </template>
      </sar-cascader>
    </template>
  </sar-popout>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import SarPopout from "../popout/popout.vue";
import SarCascader from "../cascader/cascader.vue";
import {
  defaultCascaderPopoutProps
} from "./common";
import { isEmptyBinding } from "../../utils";
import { useFormPopout } from "../../use";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string | number | (string | number)[]} modelValue 选中项的值，默认值：-。
 * @property {CascaderOption[]} options 可选项数据源，默认值：[]。
 * @property {CascaderFieldKeys} fieldKeys 自定义 `options` 中的字段，默认值：defaultFieldKeys。
 * @property {string} hintText 未选中时的提示文案，默认值：'请选择'。
 * @property {(option: CascaderOption) => string} labelRender 自定义可选项渲染，默认值：-。
 * @property {boolean} changeOnSelect 点击每级选项都会触发变化，默认值：false。
 * @property {boolean} allLevels 是否绑定所有级别的值，而不单单是最后一级，默认值：false。
 * @property {string} popoutClass 弹窗框根元素类名，默认值：-。
 * @property {StyleValue} popoutStyle 弹窗框根元素样式，默认值：-。
 * @property {boolean} visible 是否显示弹出框，默认值：-。
 * @property {string} title 弹出框标题，默认值：-。
 * @property {boolean} showConfirm 是否显示确定按钮，隐藏按钮可用于快捷选择，默认值：true。
 * @property {boolean} validateEvent 是否触发表单验证，默认值：true。
 * @property {boolean} resettable 关闭弹出框后，是否可复位弹出框值，默认值：false。
 * @event {(visible: boolean) => void} update 弹出框显隐时触发
 * @event {(value: string | number, selectedOptions: CascaderOption[]) => void} change 级联输入组件值改变时触发
 * @event {(option: CascaderOption, tabIndex: number) => void} select 选择级联选择某一项时触发
 * @event {() => void} confirm 点击确定按钮时触发
 * @event {(name: TransitionHookName) => void} visible-hook 入场/退场动画状态改变时触发
 * @event {() => void} before-enter 入场动画开始前触发
 * @event {() => void} enter 入场动画开始时触发
 * @event {() => void} after-enter 入场动画结束时触发
 * @event {() => void} enter-cancelled 入场动画取消时触发
 * @event {() => void} before-leave 退场动画开始前触发
 * @event {() => void} leave 退场动画开始时触发
 * @event {() => void} after-leave 退场动画结束时触发
 * @event {() => void} leave-cancelled 退场动画取消时触发
 */
export default  _defineComponent({
  components: {
    SarPopout,
    SarCascader,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "cascader-popout",
  props:  _mergeDefaults({
    visible: { type: Boolean, required: false },
    title: { type: String, required: false },
    showConfirm: { type: Boolean, required: false },
    validateEvent: { type: Boolean, required: false },
    popoutClass: { type: String, required: false },
    popoutStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    resettable: { type: Boolean, required: false },
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    modelValue: { type: [String, Number, Array], required: false },
    options: { type: Array, required: false },
    fieldKeys: { type: Object, required: false },
    hintText: { type: String, required: false },
    labelRender: { type: Function, required: false },
    changeOnSelect: { type: Boolean, required: false },
    allLevels: { type: Boolean, required: false }
  }, defaultCascaderPopoutProps),
  emits: ["update:visible", "update:model-value", "change", "select", "confirm", "before-enter", "enter", "after-enter", "enter-cancelled", "before-leave", "leave", "after-leave", "leave-cancelled", "visible-hook"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const { innerVisible, popoutValue, onChange, onConfirm, onVisibleHook } = useFormPopout(props, emit, {
      onChange() {
        if (!props.showConfirm && !isEmptyBinding(popoutValue.value)) {
          onConfirm(false);
          innerVisible.value = false;
        }
      }
    });
    const __returned__ = { props, emit, innerVisible, popoutValue, onChange, onConfirm, onVisibleHook, SarPopout, SarCascader };
    return __returned__;
  }
});
</script>
