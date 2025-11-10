<template>
  <view :class="rateClass" :style="rateStyle">
    <view
      :class="bem.e('content')"
      :style="contentStyle"
      :id="rateId"
      @touchstart="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @mousedown="onMouseDown"
    >
      <view
        v-for="(item, i) in starList"
        :key="i"
        :class="bem.e('item')"
        :id="i === 0 ? firstStarId : undefined"
        :style="
          stringifyStyle({
            fontSize: size,
          })
        "
        @click="onClick($event, i)"
      >
        <view
          :class="bem.e('star-void')"
          :style="
            stringifyStyle({
              color: isDisabled ? undefined : voidColor,
            })
          "
        >
          <template v-if="voidText">
            {{ voidText }}
          </template>
          <sar-icon v-else :name="voidIcon" :family="iconFamily" />
        </view>
        <view
          :class="bem.e('star')"
          :style="
            stringifyStyle({
              color: isDisabled ? undefined : color,
              width: item.width,
            })
          "
        >
          <template v-if="text">
            {{ text }}
          </template>
          <sar-icon v-else :name="icon" :family="iconFamily" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, getCurrentInstance, ref, watch } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid,
  getBoundingClientRect
} from "../../utils";
import SarIcon from "../icon/icon.vue";
import { useFormContext, useFormItemContext } from "../form/common";
import { defaultRateProps } from "./common";
import { useMouseDown } from "../../use";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number} modelValue 选中图标数，默认值：-。
 * @property {boolean} allowHalf 是否允许半选，默认值：false。
 * @property {boolean} clearable 在点击相同值，或划到最左边时，是否将值重置为 0，默认值：false。
 * @property {number} count 图标总数，默认值：5。
 * @property {string} size 图标大小，默认值：-。
 * @property {string} gap 图标间距，默认值：-。
 * @property {string} iconFamily 图标字体，默认值：-。
 * @property {string} icon 自定义选中时的图标，默认值：-。
 * @property {string} voidIcon 自定义未选中时的图标，默认值：-。
 * @property {string} text 自定义选中时的文字，默认值：-。
 * @property {string} voidText 自定义未选中时的文字，默认值：-。
 * @property {string} color 选中时的颜色，默认值：-。
 * @property {string} voidColor 未选中时的颜色，默认值：-。
 * @property {boolean} disabled 禁用状态，默认值：false。
 * @property {boolean} readonly 只读状态，默认值：false。
 * @property {boolean} validateEvent 是否触发表单验证，默认值：true。
 * @event {(value: number) => void} update 选中的值改变时触发
 * @event {(value: number) => void} change 选中的值改变时触发
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
  __name: "rate",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    modelValue: { type: Number, required: false },
    allowHalf: { type: Boolean, required: false },
    clearable: { type: Boolean, required: false },
    count: { type: Number, required: false },
    size: { type: String, required: false },
    gap: { type: String, required: false },
    iconFamily: { type: String, required: false },
    icon: { type: String, required: false },
    voidIcon: { type: String, required: false },
    text: { type: String, required: false },
    voidText: { type: String, required: false },
    color: { type: String, required: false },
    voidColor: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false },
    validateEvent: { type: Boolean, required: false }
  }, defaultRateProps),
  emits: ["update:model-value", "change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("rate");
    const formContext = useFormContext();
    const formItemContext = useFormItemContext();
    const isDisabled = computed(() => {
      return formContext?.disabled || props.disabled;
    });
    const isReadonly = computed(() => {
      return formContext?.readonly || props.readonly;
    });
    const innerValue = ref(props.modelValue ?? 0);
    watch(
      () => props.modelValue,
      () => {
        innerValue.value = props.modelValue ?? 0;
        if (props.validateEvent) {
          formItemContext?.onChange();
        }
      }
    );
    const rateId = uniqid();
    const firstStarId = uniqid();
    const instance = getCurrentInstance();
    const rateRect = ref();
    const firstStarRect = ref();
    const starList = computed(() => {
      return Array(props.count).fill(0).map((_, index) => {
        const diff = index + 1 - innerValue.value;
        const width = (diff <= 0 ? 1 : diff > 1 ? 0 : innerValue.value % 1) * 100 + "%";
        return {
          width
        };
      });
    });
    const onClick = async (event, index) => {
      if (isReadonly.value || isDisabled.value) {
        return;
      }
      let nextValue;
      if (props.allowHalf) {
        const { left: rateLeft, width: rateWidth } = await getBoundingClientRect(
          `#${rateId}`,
          instance
        );
        const { width: starWidth } = await getBoundingClientRect(
          `#${firstStarId}`,
          instance
        );
        const { clientX } = "touches" in event ? event.touches[0] : event;
        const offsetX = clientX - rateLeft;
        const gap = (rateWidth - props.count * starWidth) / (props.count - 1);
        const itemOffsetLeft = index * (starWidth + gap);
        const isHalf = offsetX - itemOffsetLeft <= starWidth / 2;
        nextValue = index + (isHalf ? 0.5 : 1);
      } else {
        nextValue = index + 1;
      }
      if (props.clearable && nextValue === innerValue.value) {
        nextValue = 0;
      }
      if (nextValue !== void 0 && nextValue !== innerValue.value) {
        innerValue.value = nextValue;
        emit("update:model-value", nextValue);
        emit("change", nextValue);
      }
    };
    const onTouchStart = () => {
      if (isReadonly.value || isDisabled.value) {
        return;
      }
      getBoundingClientRect(`#${rateId}`, instance).then((rect) => {
        rateRect.value = rect;
      });
      getBoundingClientRect(`#${firstStarId}`, instance).then((rect) => {
        firstStarRect.value = rect;
      });
    };
    const onTouchMove = (event) => {
      if (isReadonly.value || isDisabled.value) {
        return;
      }
      if (!rateRect.value || !firstStarRect.value) {
        return;
      }
      const { left: rateLeft, width: rateWidth } = rateRect.value;
      const { clientX } = event.touches[0];
      const offsetX = clientX - rateLeft;
      let nextValue;
      if (offsetX < 0) {
        nextValue = 0;
      } else {
        const { width: starWidth } = firstStarRect.value;
        const gap = (rateWidth - props.count * starWidth) / (props.count - 1);
        for (let i = props.count - 1; i >= 0; i--) {
          const left = i * (gap + starWidth);
          if (offsetX >= left) {
            const index = i + (props.allowHalf && offsetX <= left + starWidth / 2 ? 0.5 : 1);
            nextValue = index;
            break;
          }
        }
      }
      if (nextValue === 0 && !props.clearable) {
        nextValue = props.allowHalf ? 0.5 : 1;
      }
      if (nextValue !== void 0 && nextValue !== innerValue.value) {
        innerValue.value = nextValue;
        emit("update:model-value", nextValue);
        emit("change", nextValue);
      }
    };
    const onMouseDown = useMouseDown(onTouchStart, onTouchMove);
    const rateClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("disabled", isDisabled.value),
        bem.m("readonly", isReadonly.value),
        props.rootClass
      );
    });
    const rateStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const contentStyle = computed(() => {
      return stringifyStyle({
        gap: props.gap
      });
    });
    const __returned__ = { props, emit, bem, formContext, formItemContext, isDisabled, isReadonly, innerValue, rateId, firstStarId, instance, rateRect, firstStarRect, starList, onClick, onTouchStart, onTouchMove, onMouseDown, rateClass, rateStyle, contentStyle, get stringifyStyle() {
      return stringifyStyle;
    }, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>