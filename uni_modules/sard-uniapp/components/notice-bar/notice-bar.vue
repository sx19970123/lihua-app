<template>
  <view :class="noticeBarClass" :style="noticeBarStyle" @click="onClick">
    <view v-if="!hideLeftIcon" :class="bem.e('left-icon')">
      <slot name="left-icon">
        <sar-icon family="sari" name="volume-up" />
      </slot>
    </view>
    <view :class="bem.e('content')" :id="contentId">
      <view
        :class="bem.e('wrapper')"
        :id="wrapperId"
        :style="wrapperStyle"
        @animationend="onAnimationEnd"
      >
        <slot></slot>
        <sar-resize-sensor @resize="onResize" />
      </view>
    </view>
    <view
      v-if="closable || linkable"
      :class="bem.e('right-icon')"
      @click="onRightIconClick"
    >
      <slot name="right-icon">
        <sar-icon
          family="sari"
          :name="closable ? 'close' : linkable ? 'right' : ''"
        />
      </slot>
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref, getCurrentInstance, onMounted } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  uniqid,
  getBoundingClientRect
} from "../../utils";
import SarIcon from "../icon/icon.vue";
import SarResizeSensor from "../resize-sensor/resize-sensor.vue";
import {
  defaultNoticeBarProps
} from "./common";
import { useTimeout } from "../../use";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string} color 自定义颜色，默认值：-。
 * @property {string} background 自定义背景色，默认值：-。
 * @property {boolean} hideLeftIcon 隐藏左边图标，默认值：false。
 * @property {number} delay 挂载后，延迟动画时间（单位 ms），避免进入页面时卡顿，默认值：1000。
 * @property {number} speed 滚动速率 (px/s)，默认值：50。
 * @property {'auto' | 'never' | 'always'} scrollable 是否开启滚动播放，内容长度溢出时默认开启，默认值：'auto'。
 * @property {boolean} wrap 是否开启文本换行，默认值：false。
 * @property {boolean} closable 是否显示关闭按钮，默认值：false。
 * @property {boolean} linkable 是否展示右侧箭头，默认值：false。
 * @property {boolean} visible 是否显示公告栏，默认值：true。
 * @property {boolean} vertical 搭配 `Swipe` 组件实现垂直滚动，默认值：false。
 * @event {(event: any) => void} click 点击公告栏时触发
 * @event {() => void} close 点击关闭按钮时触发
 */
export default  _defineComponent({
  components: {
    SarIcon,
    SarResizeSensor,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "notice-bar",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    color: { type: String, required: false },
    background: { type: String, required: false },
    hideLeftIcon: { type: Boolean, required: false },
    delay: { type: Number, required: false },
    speed: { type: Number, required: false },
    scrollable: { type: String, required: false },
    wrap: { type: Boolean, required: false },
    closable: { type: Boolean, required: false },
    linkable: { type: Boolean, required: false },
    visible: { type: Boolean, required: false },
    vertical: { type: Boolean, required: false }
  }, defaultNoticeBarProps),
  emits: ["click", "close"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("notice-bar");
    const instance = getCurrentInstance();
    const contentId = uniqid();
    const wrapperId = uniqid();
    const shouldScroll = ref(false);
    const wrapperData = ref({
      first: 0,
      later: 0,
      contentWidth: 0
    });
    const getWidth = async (id) => {
      return (await getBoundingClientRect(`#${id}`, instance)).width;
    };
    const update = async () => {
      if (props.scrollable === "never") {
        shouldScroll.value = false;
        return;
      }
      const [contentWidth, wrapperWidth] = await Promise.all([
        getWidth(contentId),
        getWidth(wrapperId)
      ]);
      const nextShouldScroll = props.scrollable === "always" || wrapperWidth > contentWidth;
      if (nextShouldScroll) {
        wrapperData.value = {
          first: wrapperWidth / props.speed * 1e3,
          later: (wrapperWidth + contentWidth) / props.speed * 1e3,
          contentWidth
        };
      }
      shouldScroll.value = nextShouldScroll;
    };
    const firstLap = ref(true);
    const onAnimationEnd = () => {
      if (firstLap.value) {
        firstLap.value = false;
      }
    };
    const { start: updateLater } = useTimeout(
      () => {
        update();
      },
      () => props.delay
    );
    onMounted(() => {
      if (props.scrollable) {
        updateLater();
      }
    });
    const onResize = () => {
      update();
    };
    const innerVisible = ref(props.visible);
    const onRightIconClick = () => {
      if (props.closable) {
        innerVisible.value = false;
        emit("close");
      }
    };
    const onClick = (event) => {
      emit("click", event);
    };
    __expose({
      update
    });
    const noticeBarClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("wrap", props.wrap),
        bem.m("vertical", props.vertical),
        bem.m("linkable", props.linkable),
        bem.m("infinite", !firstLap.value),
        bem.m("scrollable", shouldScroll.value),
        props.rootClass
      );
    });
    const noticeBarStyle = computed(() => {
      return stringifyStyle(
        {
          color: props.color,
          background: props.background,
          display: innerVisible.value ? "flex" : "none"
        },
        props.rootStyle
      );
    });
    const wrapperStyle = computed(() => {
      return stringifyStyle({
        transform: `translateX(${firstLap.value ? 0 : wrapperData.value.contentWidth}px)`,
        animationDuration: `${firstLap.value ? wrapperData.value.first : wrapperData.value.later}ms`
      });
    });
    const __returned__ = { props, emit, bem, instance, contentId, wrapperId, shouldScroll, wrapperData, getWidth, update, firstLap, onAnimationEnd, updateLater, onResize, innerVisible, onRightIconClick, onClick, noticeBarClass, noticeBarStyle, wrapperStyle, SarIcon, SarResizeSensor };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>