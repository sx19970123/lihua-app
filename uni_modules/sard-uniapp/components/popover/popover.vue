<template>
  <slot></slot>

  <sar-overlay
    :visible="innerVisible"
    :z-index="zIndex"
    :transparent="transparent"
    @click="onOverlayClick"
  />
  <view
    v-if="innerVisible || realVisible"
    :class="popoverClass"
    :style="popoverStyle"
    @animationend="onTransitionEnd"
  >
    <view :class="bem.e('content')" :id="contentId">
      <slot name="content">
        <sar-menu
          :options="options"
          :direction="direction"
          :theme="theme"
          @select="onSelect"
        />
      </slot>
    </view>
    <view :class="bem.e('arrow')" :style="stringifyStyle(arrowPositionStyle)" />
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import {
  computed,
  ref,
  watch,
  getCurrentInstance,
  provide,
  nextTick,
  reactive,
  toRef
} from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  getBoundingClientRect,
  uniqid
} from "../../utils";
import { useTransition, useZIndex } from "../../use";
import { getPopoverPosition } from "./utils";
import SarOverlay from "../overlay/overlay.vue";
import SarMenu from "../menu/menu.vue";
import {
  popoverContextSymbol,
  defaultPopoverProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {boolean} visible 是否显示气泡弹出框，默认值：-。
 * @property {MenuOption[]} options 菜单选项列表，默认值：[]。
 * @property {PopoverPosition} position 弹出位置，默认值：'bottom'。
 * @property {'vertical' | 'horizontal'} direction 菜单选项排列方向，默认值：'vertical'。
 * @property {'dark' | 'light'} theme 主题风格，默认值：'light'。
 * @property {number} refGap 气泡弹出框与`reference`元素的间距，单位 px，默认值：10。
 * @property {number} viewportGap 气泡弹出框距与视窗的间距，单位 px，默认值：10。
 * @property {boolean} transparent 遮罩是否透明，默认值：true。
 * @property {number} duration 显隐动画时长，单位 ms，默认值：150。
 * @event {(visible: boolean) => void} update 弹出框显隐时触发
 * @event {(option: MenuOption) => void} select 选择菜单项时触发
 */
export default  _defineComponent({
  components: {
    SarOverlay,
    SarMenu,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "popover",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    visible: { type: Boolean, required: false },
    options: { type: Array, required: false },
    position: { type: String, required: false },
    direction: { type: String, required: false },
    theme: { type: String, required: false },
    refGap: { type: Number, required: false },
    viewportGap: { type: Number, required: false },
    transparent: { type: Boolean, required: false },
    controller: { type: Object, required: false },
    duration: { type: Number, required: false }
  }, defaultPopoverProps),
  emits: ["update:visible", "select"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("popover");
    const innerVisible = ref(props.visible);
    const transitionVisible = ref(false);
    const instance = getCurrentInstance();
    const contentId = uniqid();
    const popperPositionStyle = ref({
      top: "0",
      left: "0"
    });
    const arrowPositionStyle = ref({
      top: "0",
      left: "0"
    });
    const getAndSetPosition = async () => {
      const [referenceRect, contentRect] = await Promise.all([
        getReferenceRect(),
        getBoundingClientRect(`#${contentId}`, instance)
      ]);
      if (referenceRect) {
        const [popperPosition, arrowPosition] = getPopoverPosition(
          referenceRect,
          contentRect,
          {
            position: props.position,
            refGap: props.refGap,
            viewportGap: props.viewportGap,
            arrowSize: 15
          }
        );
        popperPositionStyle.value = {
          top: `calc(${popperPosition.top}px + var(--window-top))`,
          left: popperPosition.left + "px"
        };
        arrowPositionStyle.value = {
          top: arrowPosition.top + "px",
          left: arrowPosition.left + "px"
        };
        transitionVisible.value = true;
      }
    };
    const { realVisible, transitionClass, onTransitionEnd } = useTransition(
      reactive({
        visible: transitionVisible,
        duration: toRef(() => props.duration),
        prefix: bem.m("")
      })
    );
    watch(
      () => props.visible,
      () => {
        innerVisible.value = props.visible;
      }
    );
    watch(innerVisible, () => {
      if (innerVisible.value) {
        nextTick(() => {
          getAndSetPosition();
        });
      } else {
        transitionVisible.value = false;
      }
    });
    const onOverlayClick = () => {
      innerVisible.value = false;
      emit("update:visible", false);
    };
    const onSelect = (option) => {
      innerVisible.value = false;
      emit("select", option);
      emit("update:visible", false);
    };
    let referenceExpose;
    const context = {
      show() {
        innerVisible.value = true;
        emit("update:visible", true);
      },
      register(expose) {
        referenceExpose = expose;
      }
    };
    provide(popoverContextSymbol, context);
    watch(
      () => props.controller,
      () => {
        if (props.controller) {
          props.controller._inject(context);
        }
      },
      {
        immediate: true
      }
    );
    const getReferenceRect = () => {
      if (referenceExpose) {
        return referenceExpose.getRect();
      }
    };
    const [zIndex, increaseZIndex] = useZIndex();
    watch(innerVisible, () => {
      if (innerVisible.value) {
        increaseZIndex();
      }
    });
    const popoverClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m(props.theme),
        bem.m(props.direction),
        transitionClass.value,
        props.rootClass
      );
    });
    const popoverStyle = computed(() => {
      return stringifyStyle(
        {
          zIndex: zIndex.value,
          transformOrigin: `${arrowPositionStyle.value.left} ${arrowPositionStyle.value.top}`,
          opacity: realVisible.value ? 1 : 0,
          animationDuration: props.duration + "ms"
        },
        popperPositionStyle.value,
        props.rootStyle
      );
    });
    const __returned__ = { props, emit, bem, innerVisible, transitionVisible, instance, contentId, popperPositionStyle, arrowPositionStyle, getAndSetPosition, realVisible, transitionClass, onTransitionEnd, onOverlayClick, onSelect, get referenceExpose() {
      return referenceExpose;
    }, set referenceExpose(v) {
      referenceExpose = v;
    }, context, getReferenceRect, zIndex, increaseZIndex, popoverClass, popoverStyle, get stringifyStyle() {
      return stringifyStyle;
    }, SarOverlay, SarMenu };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>