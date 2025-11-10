<template>
  <view :class="loadingClass" :style="loadingStyle">
    <view :class="iconClass" :style="iconStyle">
      <slot v-if="type === 'circular'" name="circular">
        <view :class="bem.e('spinner')"></view>
      </slot>
      <template v-else-if="type === 'clock'">
        <view
          v-for="i in 12"
          :key="i"
          :class="
            classNames(
              bem.e('scale'),
              bem.em('scale', i),
              !props.animated
                ? {
                    [bem.em('scale', 'hidden')]: i > scaleShowNum,
                  }
                : null,
            )
          "
        ></view>
      </template>
    </view>

    <view
      v-if="isRenderVisible($slots.default || text)"
      :class="bem.e('text')"
      :style="loadingTextStyle"
    >
      <slot>
        {{ text }}
      </slot>
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import {
  classNames,
  stringifyStyle,
  isRenderVisible,
  createBem
} from "../../utils";
import {
  defaultLoadingProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {'clock' | 'circular'} type 加载类型，默认值：'circular'。
 * @property {string} color 加载颜色，默认值：-。
 * @property {string} size 图标尺寸，默认值：-。
 * @property {string} text 图标文字，默认值：-。
 * @property {string} textColor 文字颜色，默认值：-。
 * @property {string} textSize 文字尺寸，默认值：-。
 * @property {boolean} vertical 是否垂直排列图标和文案，默认值：false。
 * @property {boolean} animated 是否开启加载动画，默认值：true。
 * @property {number} progress 当前加载的进度，默认值：1。
 */
export default  _defineComponent({
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "loading",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    type: { type: String, required: false },
    color: { type: String, required: false },
    size: { type: String, required: false },
    text: { type: String, required: false },
    textColor: { type: String, required: false },
    textSize: { type: String, required: false },
    vertical: { type: Boolean, required: false },
    animated: { type: Boolean, required: false },
    progress: { type: Number, required: false }
  }, defaultLoadingProps()),
  setup(__props, { expose: __expose }) {
    __expose();
    const props = __props;
    const bem = createBem("loading");
    const scaleShowNum = computed(() => {
      return Math.max(Math.floor(props.progress * 12), 1);
    });
    const loadingClass = computed(() => {
      return classNames(bem.b(), bem.m("vertical", props.vertical), props.rootClass);
    });
    const loadingStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const iconClass = computed(() => {
      return classNames(
        bem.e("icon"),
        bem.em("icon", props.type),
        bem.em("icon", "animated", props.animated)
      );
    });
    const iconStyle = computed(() => {
      return stringifyStyle(
        {
          color: props.color,
          fontSize: props.size
        },
        props.type === "circular" && !props.animated ? {
          transform: `rotate(${props.progress * 360}deg)`
        } : null
      );
    });
    const loadingTextStyle = computed(() => {
      return stringifyStyle({ color: props.textColor, fontSize: props.textSize });
    });
    const __returned__ = { props, bem, scaleShowNum, loadingClass, loadingStyle, iconClass, iconStyle, loadingTextStyle, get classNames() {
      return classNames;
    }, get isRenderVisible() {
      return isRenderVisible;
    } };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>