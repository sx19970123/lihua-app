<template>
  <view :class="stepperClass" :style="stepperStyle">
    <view
      :class="
        classNames(
          bem.e('button'),
          bem.em('button', 'disabled', isDisabled || isMin),
          bem.em('button', 'readonly', isReadonly),
          bem.em('button', 'decrease'),
        )
      "
      @click="onButtonClick(-1, isMin)"
      @touchstart="onTouchStart(-1)"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
      @mousedown="onMouseDown(-1)"
    >
      <sar-icon family="sari" name="minus" />
    </view>
    <input
      :class="bem.e('input')"
      :type="inputType"
      :placeholder="placeholder"
      :placeholder-class="bem.e('placeholder')"
      :value="inputValue"
      :disabled="isDisabled || isReadonly"
      :style="inputStyle"
      @input="onInput"
      @blur="onBlur"
      @focus="onFocus"
    />
    <view
      :class="
        classNames(
          bem.e('button'),
          bem.em('button', 'disabled', isDisabled || isMax),
          bem.em('button', 'readonly', isReadonly),
          bem.em('button', 'increase'),
        )
      "
      @click="onButtonClick(1, isMax)"
      @touchstart="onTouchStart(1)"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
      @mousedown="onMouseDown(1)"
    >
      <sar-icon family="sari" name="plus" />
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref, watch } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  isNullish,
  clamp
} from "../../utils";
import SarIcon from "../icon/icon.vue";
import { useFormContext, useFormItemContext } from "../form/common";
import {
  defaultStepperProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number | string} modelValue 当前输入值，默认值：-。
 * @property {number} min 最小值，默认值：Number.MIN_SAFE_INTEGER。
 * @property {number} max 最大值，默认值：Number.MAX_SAFE_INTEGER。
 * @property {number | null | 'min' | 'max'} valueOnClear 当输入框被清空时显示的值，默认值：null。
 * @property {number} step 点击按钮时增加或减少的数值，默认值：1。
 * @property {number} precision 数值精度，即允许的小数位数，默认值：-。
 * @property {string} inputStyle 输入框样式，默认值：-。
 * @property {'number' | 'digit' | 'text'} inputType 输入框类型，默认值：'number'。
 * @property {string} placeholder 输入框占位符，默认值：-。
 * @property {boolean} disabled 禁用状态，默认值：false。
 * @property {boolean} readonly 只读状态，默认值：false。
 * @property {boolean} press 是否可以通过长按增加/减少按钮改变数值，默认值：true。
 * @property {boolean} pressTime 触发长按事件的时间，单位毫秒，默认值：350。
 * @property {number} interval 长按改变数值的时间间隔，单位毫秒，默认值：150。
 * @property {boolean} validateEvent 是否触发表单验证，默认值：true。
 * @property {'medium' | 'small'} size 步进器尺寸，默认值：'medium'。
 * @event {(value: number | string | undefined) => void} update 输入框值改变时触发
 * @event {(value: number | string | undefined) => void} change 输入框值改变时触发
 * @event {(event: any) => void} focus 输入框聚焦时触发
 * @event {(event: any) => void} blur 输入框失焦时触发
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
  __name: "stepper",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    modelValue: { type: [Number, String, null], required: false },
    min: { type: Number, required: false },
    max: { type: Number, required: false },
    valueOnClear: { type: [Number, String], required: false },
    step: { type: Number, required: false },
    precision: { type: Number, required: false },
    inputStyle: { type: String, required: false },
    inputType: { type: String, required: false },
    placeholder: { type: String, required: false },
    disabled: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false },
    press: { type: Boolean, required: false },
    pressTime: { type: Number, required: false },
    interval: { type: Number, required: false },
    validateEvent: { type: Boolean, required: false },
    size: { type: String, required: false }
  }, defaultStepperProps),
  emits: ["update:model-value", "change", "focus", "blur"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("stepper");
    const formContext = useFormContext();
    const formItemContext = useFormItemContext();
    const isDisabled = computed(() => {
      return formContext?.disabled || props.disabled;
    });
    const isReadonly = computed(() => {
      return formContext?.readonly || props.readonly;
    });
    const innerValue = ref(props.modelValue);
    const inputValue = ref(props.modelValue);
    watch(
      () => props.modelValue,
      () => {
        innerValue.value = props.modelValue;
        inputValue.value = props.modelValue;
        if (props.validateEvent) {
          formItemContext?.onChange();
        }
      }
    );
    const setInnerValue = (value) => {
      innerValue.value = value;
      emit("update:model-value", value);
      emit("change", value);
    };
    const setValueEnsureSafe = (value) => {
      setInnerValue(value);
      inputValue.value = value;
    };
    const normalizedValue = (value) => {
      value = clamp(value, props.min, props.max);
      if (props.precision !== void 0) {
        value = +value.toFixed(props.precision);
      }
      return value;
    };
    const getValueOnClear = () => {
      return props.valueOnClear === "min" ? props.min : props.valueOnClear === "max" ? props.max : props.valueOnClear;
    };
    const onInput = (event) => {
      const value = event.detail.value;
      inputValue.value = value;
      if (value === "") {
        setInnerValue(getValueOnClear());
      }
    };
    const onBlur = (event) => {
      if (inputValue.value !== "") {
        const nextValue = Number(inputValue.value);
        if (isNaN(nextValue)) {
          inputValue.value = "";
          setInnerValue(getValueOnClear());
        } else {
          setValueEnsureSafe(normalizedValue(nextValue));
        }
      }
      emit("blur", event);
    };
    const onFocus = (event) => {
      emit("focus", event);
    };
    const isMin = computed(() => {
      return !isNullish(innerValue.value) && Number(innerValue.value) <= props.min;
    });
    const isMax = computed(() => {
      return !isNullish(innerValue.value) && Number(innerValue.value) >= props.max;
    });
    const setByStep = (delta) => {
      setValueEnsureSafe(
        normalizedValue((Number(innerValue.value) || 0) + props.step * delta)
      );
    };
    const onButtonClick = (delta, arrived) => {
      if (!isDisabled.value && !isReadonly.value && !arrived) {
        setByStep(delta);
      }
    };
    let pressTimer;
    let isPressing = false;
    const onLongPress = (delta) => {
      if (isPressing) {
        setByStep(delta);
        setTimeout(() => {
          onLongPress(delta);
        }, props.interval);
      }
    };
    const onTouchStart = (delta) => {
      if (!props.press || isDisabled.value || isReadonly.value || delta === -1 && isMin.value || delta === 1 && isMax.value) {
        return;
      }
      clearTimeout(pressTimer);
      isPressing = false;
      pressTimer = setTimeout(() => {
        isPressing = true;
        onLongPress(delta);
      }, props.pressTime);
    };
    const onTouchEnd = () => {
      clearTimeout(pressTimer);
      isPressing = false;
    };
    const onMouseDown = (delta) => {
      // #ifdef WEB
      onTouchStart(delta);
      const upHandler = () => {
        onTouchEnd();
        document.removeEventListener("mouseup", upHandler);
      };
      document.addEventListener("mouseup", upHandler);
      // #endif
    };
    const stepperClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m(props.size),
        bem.m("disabled", isDisabled.value),
        bem.m("readonly", isReadonly.value),
        props.rootClass
      );
    });
    const stepperStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, formContext, formItemContext, isDisabled, isReadonly, innerValue, inputValue, setInnerValue, setValueEnsureSafe, normalizedValue, getValueOnClear, onInput, onBlur, onFocus, isMin, isMax, setByStep, onButtonClick, get pressTimer() {
      return pressTimer;
    }, set pressTimer(v) {
      pressTimer = v;
    }, get isPressing() {
      return isPressing;
    }, set isPressing(v) {
      isPressing = v;
    }, onLongPress, onTouchStart, onTouchEnd, onMouseDown, stepperClass, stepperStyle, get classNames() {
      return classNames;
    }, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>