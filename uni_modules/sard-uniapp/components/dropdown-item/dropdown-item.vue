<template>
  <view
    :class="dropdownItemClass"
    :style="dropdownItemStyle"
    @click="onItemClick"
  >
    <view v-if="label" :class="bem.e('label')">
      {{ label }}
      <text v-if="(!isNullish(title) || !isNullish(innerValue)) && separator">
        {{ separator }}
      </text>
    </view>
    <view v-if="title" :class="bem.e('title')">
      {{ title }}
    </view>
    <view v-if="!isNullish(innerValue)" :class="bem.e('value')">
      {{ currentLabel }}
    </view>
    <view v-else-if="placeholder" :class="bem.e('placeholder')">
      {{ placeholder }}
    </view>
    <view :class="bem.e('arrow')">
      <sar-icon family="sari" :name="currentArrow" />
    </view>
  </view>

  <view
    v-if="wholeVisible"
    :class="bem.e('away')"
    :style="awayInset"
    @click="onAwayClick"
    @touchmove.stop.prevent
  />
  <view v-if="wholeVisible" :class="bem.e('popover')" :style="popupInset">
    <sar-overlay
      root-style="position: absolute"
      :visible="popupVisible"
      :duration="context.duration"
      :z-index="zIndex"
      @click="onOverlayClick"
    />
    <view
      :class="popupClass"
      :style="popupStyle"
      @transitionend="onTransitionEnd"
    >
      <slot>
        <sar-list inlaid>
          <sar-list-item
            v-for="(option, i) in options"
            :key="i"
            :title="option.label"
            hover
            :root-class="
              classNames(
                bem.e('option'),
                bem.em('option', 'active', option.value === innerValue),
              )
            "
            @click="onOptionClick(option)"
          >
            <template #arrow>
              <view :class="bem.e('option-icon')">
                <sar-icon family="sari" name="success" />
              </view>
            </template>
          </sar-list-item>
        </sar-list>
      </slot>
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import {
  computed,
  getCurrentInstance,
  ref,
  watch,
  inject,
  onMounted,
  onUnmounted,
  reactive,
  toRef
} from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid,
  getBoundingClientRect,
  getWindowInfo,
  isNullish,
  isFunction,
  isObject,
  noop
} from "../../utils";
import SarList from "../list/list.vue";
import SarListItem from "../list-item/list-item.vue";
import SarIcon from "../icon/icon.vue";
import SarOverlay from "../overlay/overlay.vue";
import {
  dropdownContextSymbol,
  defaultDropdownItemProps,
  defaultValueOnClear
} from "../dropdown/common";
import { useTransition, useZIndex } from "../../use";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} title 标题，用于自定义菜单内容，默认值：-。
 * @property {string} label 标签说明，默认值：-。
 * @property {DropdownOption[]} options 菜单选项，默认值：[]。
 * @property {'down' | 'up'} direction 菜单弹出方向，默认值：'down'。
 * @property {boolean} disabled 是否禁用，默认值：false。
 * @property {any} modelValue 当前选择的菜单项的值，默认值：-。
 * @property {boolean} visible 弹出框是否可见，默认值：-。
 * @property {string} separator 标签后面分隔符，默认值：-。
 * @property {string} placeholder 占位符，默认值：-。
 * @property {boolean} togglable 是否可取消选中的选项，默认值：false。
 * @property {any} valueOnClear 取消选项时设置的值，默认值：undefined。
 * @property {() => any} beforeOpen 打开前的回调，返回 `false` 或 `rejected` 状态的 `Promise` 可阻止打开，默认值：-。
 * @property {DropdownBeforeClose} beforeClose 关闭前的回调，返回 `false` 或 `rejected` 状态的 `Promise` 可阻止关闭，默认值：-。
 * @event {(visible: boolean) => void} update 弹出框显隐时触发
 * @event {(value: any) => void} change 选中菜单选项时触发
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
    SarList,
    SarListItem,
    SarIcon,
    SarOverlay,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "dropdown-item",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    title: { type: String, required: false },
    label: { type: String, required: false },
    options: { type: Array, required: false },
    disabled: { type: Boolean, required: false },
    modelValue: { type: null, required: false },
    visible: { type: Boolean, required: false },
    separator: { type: String, required: false },
    placeholder: { type: String, required: false },
    togglable: { type: Boolean, required: false },
    valueOnClear: { type: Function, required: false },
    beforeClose: { type: Function, required: false },
    beforeOpen: { type: Function, required: false }
  }, defaultDropdownItemProps),
  emits: ["update:model-value", "change", "update:visible", "before-enter", "enter", "after-enter", "enter-cancelled", "before-leave", "leave", "after-leave", "leave-cancelled", "visible-hook"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("dropdown-item");
    const context = inject(
      dropdownContextSymbol
    );
    if (!context) {
      throw new Error("DropdownItem must be included in Dropdown.");
    }
    const itemId = uniqid();
    const instance = getCurrentInstance();
    const innerValue = ref(props.modelValue);
    const mergedTogglable = computed(() => props.togglable || context.togglable);
    const mergedValueOnClear = computed(
      () => props.valueOnClear || context.valueOnClear || defaultValueOnClear
    );
    watch(
      () => props.modelValue,
      () => {
        innerValue.value = props.modelValue;
      }
    );
    const innerVisible = ref(props.visible);
    const wholeVisible = ref(props.visible);
    const popupVisible = ref(props.visible);
    watch(
      () => props.visible,
      () => {
        innerVisible.value = props.visible;
      }
    );
    watch(innerVisible, () => {
      if (innerVisible.value) {
        wholeVisible.value = true;
        context.hideOthers(instance);
        setPosition().then(() => {
          popupVisible.value = true;
        });
      } else {
        popupVisible.value = false;
      }
    });
    const popupInset = ref("");
    const awayInset = ref("");
    const setPosition = async () => {
      const { windowHeight } = getWindowInfo();
      const itemRect = await getBoundingClientRect(`.${itemId}`, instance);
      const nextPopupInset = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      };
      const nextAwayInset = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      };
      if (context.direction === "down") {
        nextPopupInset.top = `calc(${itemRect.bottom}px + var(--window-top))`;
        nextPopupInset.bottom = 0;
        nextAwayInset.top = 0;
        nextAwayInset.bottom = `calc(${windowHeight - itemRect.bottom}px + var(--window-top))`;
      } else {
        nextPopupInset.top = 0;
        nextPopupInset.bottom = `${windowHeight - itemRect.top}px`;
        nextAwayInset.top = `calc(${itemRect.bottom}px + var(--window-top))`;
        nextAwayInset.bottom = 0;
      }
      popupInset.value = stringifyStyle(nextPopupInset);
      awayInset.value = stringifyStyle(nextAwayInset);
    };
    const setInnerVisible = (visible) => {
      if (visible !== innerVisible.value) {
        innerVisible.value = visible;
        emit("update:visible", visible);
      }
    };
    let isClosing = false;
    const perhapsClose = (type) => {
      if (isClosing) {
        return;
      }
      if (isFunction(props.beforeClose)) {
        const result = props.beforeClose(type);
        if (isObject(result) && isFunction(result.then)) {
          isClosing = true;
          return result.then(() => {
            setInnerVisible(false);
          }).catch(noop);
        } else if (result === false) {
          return;
        }
      }
      setInnerVisible(false);
    };
    let isOpening = false;
    const perhapsOpen = () => {
      if (isOpening) {
        return;
      }
      if (isFunction(props.beforeOpen)) {
        const result = props.beforeOpen();
        if (isObject(result) && isFunction(result.then)) {
          isOpening = true;
          return result.then(() => {
            setInnerVisible(true);
          }).catch(noop);
        } else if (result === false) {
          return;
        }
      }
      setInnerVisible(true);
    };
    const onItemClick = () => {
      if (!context.disabled && !props.disabled) {
        if (innerVisible.value) {
          perhapsClose("button");
        } else {
          perhapsOpen();
        }
      }
    };
    const onOptionClick = (option) => {
      let changed = false;
      if (option.value !== innerValue.value) {
        innerValue.value = option.value;
        changed = true;
      } else {
        if (mergedTogglable.value) {
          const value = mergedValueOnClear.value();
          if (value !== innerValue.value) {
            innerValue.value = value;
          }
          changed = true;
        }
      }
      if (changed) {
        emit("update:model-value", innerValue.value);
        emit("change", innerValue.value);
      }
      perhapsClose("option");
    };
    const onOverlayClick = () => {
      if (context.overlayClosable) {
        perhapsClose("overlay");
      }
    };
    const onAwayClick = () => {
      if (context.awayClosable) {
        perhapsClose("away");
      }
    };
    const hide = () => {
      if (innerVisible.value) {
        perhapsClose("other-button");
      }
    };
    onMounted(() => {
      context.register(instance, {
        hide,
        visible: wholeVisible
      });
    });
    const [zIndex, increaseZIndex] = useZIndex();
    const { realVisible, transitionClass, onTransitionEnd } = useTransition(
      reactive({
        visible: toRef(() => popupVisible.value),
        duration: toRef(() => context.duration),
        prefix: computed(() => bem.em("popup", popupEffect.value) + "-"),
        onVisibleHook: (name) => {
          if (name === "before-enter") {
            increaseZIndex();
            isOpening = false;
          }
          if (name === "after-leave") {
            wholeVisible.value = false;
          }
          if (name === "leave-cancelled" || name === "after-leave") {
            isClosing = false;
          }
          emit("visible-hook", name);
          emit(name);
        }
      })
    );
    const popupClass = computed(() => {
      return classNames(
        bem.e("popup"),
        bem.em("popup", popupEffect.value),
        transitionClass.value
      );
    });
    const popupStyle = computed(() => {
      return stringifyStyle(props.rootStyle, {
        zIndex: zIndex.value,
        display: realVisible.value ? "flex" : "none",
        transitionDuration: context.duration + "ms"
      });
    });
    onUnmounted(() => {
      context.unregister(instance);
    });
    const currentLabel = computed(() => {
      return props.options?.find((option) => option.value === innerValue.value)?.label;
    });
    const currentArrow = computed(() => {
      return wholeVisible.value ? "caret-up" : "caret-down";
    });
    const popupEffect = computed(() => {
      return context.direction === "up" ? "slide-bottom" : "slide-top";
    });
    const dropdownItemClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m(context.direction),
        bem.m("show", wholeVisible.value),
        bem.m("disabled", context.disabled || props.disabled),
        props.rootClass,
        itemId
      );
    });
    const dropdownItemStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, context, itemId, instance, innerValue, mergedTogglable, mergedValueOnClear, innerVisible, wholeVisible, popupVisible, popupInset, awayInset, setPosition, setInnerVisible, get isClosing() {
      return isClosing;
    }, set isClosing(v) {
      isClosing = v;
    }, perhapsClose, get isOpening() {
      return isOpening;
    }, set isOpening(v) {
      isOpening = v;
    }, perhapsOpen, onItemClick, onOptionClick, onOverlayClick, onAwayClick, hide, zIndex, increaseZIndex, realVisible, transitionClass, onTransitionEnd, popupClass, popupStyle, currentLabel, currentArrow, popupEffect, dropdownItemClass, dropdownItemStyle, get classNames() {
      return classNames;
    }, get isNullish() {
      return isNullish;
    }, SarList, SarListItem, SarIcon, SarOverlay };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>