<template>
  <sar-popup
    effect="slide-bottom"
    :visible="innerVisible"
    :duration="duration"
    @overlay-click="onOverlayClick"
    @visible-hook="onVisibleHook"
  >
    <view :class="actionSheetClass" :style="actionSheetStyle">
      <view v-if="description" :class="bem.e('description')">
        {{ description }}
      </view>
      <view :class="bem.e('content')">
        <view
          v-for="(item, i) in itemList"
          :key="i"
          :class="
            classNames(
              bem.e('item'),
              bem.em('item', 'disabled', item.disabled),
              bem.em('item', 'loading', item.loading),
            )
          "
          :style="stringifyStyle({ color: item.color })"
          @click="onSelect(item, i)"
        >
          <template v-if="!item.loading">
            <view :class="bem.e('item-name')">
              {{ item.name }}
            </view>
            <view v-if="item.description" :class="bem.e('item-description')">
              {{ item.description }}
            </view>
          </template>
          <view v-else :class="bem.e('loading')">
            <sar-loading />
          </view>
        </view>
      </view>
      <template v-if="cancel">
        <view :class="bem.e('gap')"></view>
        <view :class="bem.e('cancel')" @click="onCancel">
          {{ cancel }}
        </view>
      </template>
    </view>
  </sar-popup>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref, watch } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  noop,
  isFunction,
  isObject
} from "../../utils";
import SarPopup from "../popup/popup.vue";
import SarLoading from "../loading/loading.vue";
import {
  defaultActionSheetProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} description 动作面板描述说明，默认值：-。
 * @property {ActionSheetItem[]} itemList 面板项列表，默认值：[]。
 * @property {string} cancel 取消按钮文字，默认值：-。
 * @property {boolean} visible 是否显示动作面板，默认值：false。
 * @property {boolean} overlayClosable 点击遮罩后是否关闭，默认值：true。
 * @property {(type: 'close' | 'cancel' | 'select') => any} beforeClose 关闭前的回调，返回 `false` 或 `rejected` 状态的 `Promise` 可阻止关闭，默认值：-。
 * @property {number} duration 显隐动画时长，单位 ms，默认值：300。
 * @event {(visible: boolean) => void} update 动作面板显隐时触发
 * @event {() => void} close 点击遮罩时触发
 * @event {() => void} cancel 点击取消按钮时触发
 * @event {(item: ActionSheetItem, index: number) => void} select 点击动作按钮时触发
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
    SarPopup,
    SarLoading,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "action-sheet",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    description: { type: String, required: false },
    itemList: { type: Array, required: false },
    cancel: { type: String, required: false },
    visible: { type: Boolean, required: false },
    overlayClosable: { type: Boolean, required: false },
    beforeClose: { type: Function, required: false },
    duration: { type: Number, required: false }
  }, defaultActionSheetProps),
  emits: ["update:visible", "close", "cancel", "select", "before-enter", "enter", "after-enter", "enter-cancelled", "before-leave", "leave", "after-leave", "leave-cancelled", "visible-hook"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("action-sheet");
    const innerVisible = ref(props.visible);
    watch(
      () => props.visible,
      () => {
        innerVisible.value = props.visible;
      }
    );
    const perhapsClose = (type) => {
      if (isFunction(props.beforeClose)) {
        const result = props.beforeClose(type);
        if (isObject(result) && isFunction(result.then)) {
          return result.then(() => {
            innerVisible.value = false;
            emit("update:visible", false);
          }).catch(noop);
        } else if (result === false) {
          return;
        }
      }
      innerVisible.value = false;
      emit("update:visible", false);
    };
    const onOverlayClick = () => {
      emit("close");
      if (props.overlayClosable) {
        perhapsClose("close");
      }
    };
    const onSelect = (item, index) => {
      if (!item.disabled && !item.loading) {
        emit("select", item, index);
        perhapsClose("select");
      }
    };
    const onCancel = () => {
      emit("cancel");
      perhapsClose("cancel");
    };
    const onVisibleHook = (name) => {
      emit("visible-hook", name);
      emit(name);
    };
    const actionSheetClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("headless", !props.description),
        props.rootClass
      );
    });
    const actionSheetStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, innerVisible, perhapsClose, onOverlayClick, onSelect, onCancel, onVisibleHook, actionSheetClass, actionSheetStyle, get classNames() {
      return classNames;
    }, get stringifyStyle() {
      return stringifyStyle;
    }, SarPopup, SarLoading };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>