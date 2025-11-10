<template>
  <sar-popout
    v-model:visible="innerVisible"
    :title="title"
    :root-class="popoutClass"
    :root-style="popoutStyle"
    @confirm="onConfirm"
    @visible-hook="onVisibleHook"
  >
    <template v-if="showCheckAll" #title-prepend>
      <view :class="bem.e('check-all')">
        <sar-checkbox
          v-model:checked="allChecked"
          :indeterminate="isIndeterminate"
          @change="onAllChange"
        >
          {{ count }}
        </sar-checkbox>
      </view>
    </template>
    <template #visible="{ already }">
      <view v-if="already">
        <sar-list-item v-if="searchable">
          <sar-input
            v-model="searchValue"
            :placeholder="filterPlaceholder"
            clearable
          >
            <template #prepend>
              <sar-icon family="sari" name="search" />
            </template>
          </sar-input>
        </sar-list-item>
        <view :class="containerClass">
          <scroll-view
            :class="scrollClass"
            scroll-y
            trap-scroll
            :upper-threshold="0"
            :lower-threshold="0"
            :throttle="false"
            @scroll="onScroll"
            @scrolltoupper="onScrolltoupper"
            @scrolltolower="onScrolltolower"
          >
            <sar-checkbox-group
              :size="size"
              :type="type"
              :checkedColor="checkedColor"
              :direction="direction"
              :validate-event="false"
              :model-value="popoutValue"
              @change="onChange"
            >
              <template #custom="{ toggle }">
                <sar-list inlaid>
                  <sar-list-item
                    v-for="option in filteredOptions"
                    :key="option.value"
                    :title="option.label"
                    :hover="!option.disabled"
                    @click="select(option, toggle)"
                  >
                    <template v-if="iconPosition === 'left'" #icon>
                      <sar-checkbox
                        readonly
                        :disabled="option.disabled"
                        :value="option.value"
                        :validate-event="false"
                      />
                    </template>
                    <template v-if="iconPosition === 'right'" #value>
                      <sar-checkbox
                        readonly
                        :disabled="option.disabled"
                        :value="option.value"
                        :validate-event="false"
                      />
                    </template>
                  </sar-list-item>
                </sar-list>
              </template>
            </sar-checkbox-group>
          </scroll-view>
        </view>
      </view>
    </template>
  </sar-popout>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref } from "vue";
import SarPopout from "../popout/popout.vue";
import SarCheckboxGroup from "../checkbox-group/checkbox-group.vue";
import SarCheckbox from "../checkbox/checkbox.vue";
import SarList from "../list/list.vue";
import SarListItem from "../list-item/list-item.vue";
import SarInput from "../input/input.vue";
import SarIcon from "../icon/icon.vue";
import { classNames, createBem, getMayPrimitiveOption } from "../../utils";
import {
  defaultCheckboxPopoutProps
} from "./common";
import { useScrollSide, useFormPopout, useIndeterminate } from "../../use";
import { defaultOptionKeys } from "../checkbox/common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {any[]} modelValue 指定选中的选项，默认值：-。
 * @property {boolean} disabled 禁用状态，默认值：-。
 * @property {boolean} readonly 只读状态，默认值：-。
 * @property {string} size 图标的尺寸，默认值：-。
 * @property {'square' | 'circle'} type 图标类型，默认值：'square'。
 * @property {string} checkedColor 选中时图标的颜色，默认值：-。
 * @property {boolean} validateEvent 是否触发表单验证，默认值：true。
 * @property {CheckboxGroupOption[]} options 自动设置复选框，默认值：-。
 * @property {CheckboxGroupOptionKeys} optionKeys 自定义 options 的 label、value 的字段，默认值：{label: 'label', value: 'value'}。
 * @property {string} popoutClass 弹窗框根元素类名，默认值：-。
 * @property {StyleValue} popoutStyle 弹窗框根元素样式，默认值：-。
 * @property {boolean} visible 是否显示弹出框，默认值：-。
 * @property {string} title 弹出框标题，默认值：-。
 * @property {boolean} showCheckAll 是否显示全选，默认值：false。
 * @property {boolean} searchable 是否可搜索，默认值：false。
 * @property {string} filterPlaceholder 搜索输入框占位符内容，默认值：-。
 * @property {boolean} resettable 关闭弹出框后，是否可复位弹出框值，默认值：false。
 * @property {'left' | 'right'} iconPosition 可定义复选框的位置，默认值：'left'。
 * @event {(visible: boolean) => void} update 弹出框显隐时触发
 * @event {(value: any[] | undefined) => void} change 复选输入组件值改变时触发
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
    SarCheckboxGroup,
    SarCheckbox,
    SarList,
    SarListItem,
    SarInput,
    SarIcon,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "checkbox-popout",
  props:  _mergeDefaults({
    visible: { type: Boolean, required: false },
    title: { type: String, required: false },
    popoutClass: { type: String, required: false },
    popoutStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    showCheckAll: { type: Boolean, required: false },
    searchable: { type: Boolean, required: false },
    filterPlaceholder: { type: String, required: false },
    resettable: { type: Boolean, required: false },
    iconPosition: { type: String, required: false },
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    modelValue: { type: Array, required: false },
    disabled: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false },
    size: { type: String, required: false },
    type: { type: String, required: false },
    checkedColor: { type: String, required: false },
    direction: { type: String, required: false },
    validateEvent: { type: Boolean, required: false },
    options: { type: Array, required: false },
    optionKeys: { type: Object, required: false }
  }, defaultCheckboxPopoutProps()),
  emits: ["update:visible", "update:model-value", "change", "confirm", "before-enter", "enter", "after-enter", "enter-cancelled", "before-leave", "leave", "after-leave", "leave-cancelled", "visible-hook"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("checkbox-popout");
    const { innerVisible, popoutValue, onChange, onConfirm, onVisibleHook } = useFormPopout(props, emit);
    const fieldKeys = computed(() => {
      return Object.assign({}, defaultOptionKeys, props.optionKeys);
    });
    const objectOptions = computed(() => {
      return props.options.map((option) => {
        return {
          label: getMayPrimitiveOption(option, fieldKeys.value.label),
          value: getMayPrimitiveOption(option, fieldKeys.value.value),
          disabled: getMayPrimitiveOption(option, fieldKeys.value.disabled) === true
        };
      });
    });
    const select = (option, toggle) => {
      if (!option.disabled) {
        toggle(option.value);
      }
    };
    const { allChecked, isIndeterminate, onAllChange } = useIndeterminate(
      popoutValue,
      objectOptions
    );
    const searchValue = ref("");
    const filteredOptions = computed(() => {
      const searchString = searchValue.value;
      if (!searchString) return objectOptions.value;
      return objectOptions.value.filter((option) => {
        return option.label.includes(searchString);
      });
    });
    const count = computed(() => {
      return (popoutValue.value?.length || 0) + " / " + props.options.length;
    });
    const { scrollSide, onScroll, onScrolltoupper, onScrolltolower } = useScrollSide();
    const containerClass = computed(() => {
      return classNames(
        bem.e("container"),
        bem.em("container", scrollSide.value, scrollSide.value)
      );
    });
    const scrollClass = computed(() => {
      return classNames(
        bem.e("scroll"),
        bem.em("scroll", "searchable", props.searchable)
      );
    });
    const __returned__ = { props, emit, bem, innerVisible, popoutValue, onChange, onConfirm, onVisibleHook, fieldKeys, objectOptions, select, allChecked, isIndeterminate, onAllChange, searchValue, filteredOptions, count, scrollSide, onScroll, onScrolltoupper, onScrolltolower, containerClass, scrollClass, SarPopout, SarCheckboxGroup, SarCheckbox, SarList, SarListItem, SarInput, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>