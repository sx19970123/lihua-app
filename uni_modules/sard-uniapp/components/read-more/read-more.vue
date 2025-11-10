<template>
  <view :class="readMoreClass" :style="readMoreStyle">
    <view :id="contentId" :class="bem.e('content')" :style="contentStyle">
      <slot></slot>
      <view :class="bem.e('shadow')"></view>
    </view>
    <view
      v-if="!hideToggle"
      :id="toggleId"
      :class="bem.e('toggle')"
      @touchstart="onTouchStart"
      @mousedown="onMouseDown"
    >
      <sar-button type="pale-text" @click="onButtonClick">
        <text>{{ toggleText }}</text>
        <sar-icon family="sari" :name="toggleIcon" />
      </sar-button>
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
import {
  defaultReadMoreProps
} from "./common";
import SarButton from "../button/button.vue";
import SarIcon from "../icon/icon.vue";
import { useTranslate } from "../locale";
import { useMouseDown, useSingleTask } from "../../use";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {number} maxHeight 收起时最大展示高度，默认值：200。
 * @property {boolean} hideClose 是否隐藏收起按钮，打开后就不能手动收起来了，默认值：false。
 * @property {string} openText 展开状态按钮文案，默认值：'收起'。
 * @property {string} closeText 收起状态按钮文案，默认值：'展开'。
 * @property {boolean} visible 控制展开和收起，默认值：false。
 * @property {boolean} keepLocation 收起时保持按钮下面的内容在屏幕中原来的位置，只可用在页面滚动中，默认值：false。
 * @event {(visible: boolean)=> void} update 展开/收起时触发
 * @event {() => void} open 展开时触发
 * @event {() => void} close 收起时触发
 */
export default  _defineComponent({
  components: {
    SarButton,
    SarIcon,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "read-more",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    maxHeight: { type: Number, required: false },
    hideClose: { type: Boolean, required: false },
    openText: { type: String, required: false },
    closeText: { type: String, required: false },
    visible: { type: Boolean, required: false },
    keepLocation: { type: Boolean, required: false }
  }, defaultReadMoreProps),
  emits: ["update:visible", "open", "close"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("read-more");
    const { t } = useTranslate("readMore");
    const innerVisible = ref(props.visible);
    const { startTask, onFinishTask } = useSingleTask();
    watch(
      () => props.visible,
      () => {
        onFinishTask(() => {
          innerVisible.value = props.visible;
        });
      }
    );
    const handleClick = () => {
      innerVisible.value = !innerVisible.value;
      emit("update:visible", innerVisible.value);
      if (innerVisible.value) {
        emit("open");
      } else {
        onClose();
        emit("close");
      }
    };
    const onButtonClick = () => {
      onFinishTask(handleClick);
    };
    const toggleText = computed(() => {
      return innerVisible.value ? props.openText || t("fold") : props.closeText || t("unfold");
    });
    const toggleIcon = computed(() => {
      return innerVisible.value ? "up" : "down";
    });
    const hideToggle = computed(() => {
      return innerVisible.value && props.hideClose;
    });
    const contentId = uniqid();
    const toggleId = uniqid();
    const instance = getCurrentInstance();
    let scrollTop = 0;
    const onTouchStart = (event) => {
      if (props.keepLocation && innerVisible.value) {
        startTask(async () => {
          const { clientY, pageY } = event.touches[0];
          const contentRect = await getBoundingClientRect(`#${contentId}`, instance);
          const toggleRect = await getBoundingClientRect(`#${toggleId}`, instance);
          const closeContentHeight = Math.min(props.maxHeight, contentRect.height);
          const openContentHeight = contentRect.height;
          const offsetTop = clientY - toggleRect.top;
          const openContentPageY = pageY - offsetTop - openContentHeight;
          const closeContentClientY = toggleRect.top - closeContentHeight;
          scrollTop = openContentPageY - closeContentClientY;
        });
      }
    };
    const onMouseDown = useMouseDown(onTouchStart);
    const onClose = () => {
      if (props.keepLocation) {
        uni.pageScrollTo({
          scrollTop,
          duration: 0
        });
      }
    };
    __expose({});
    const readMoreClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("close", !innerVisible.value),
        props.rootClass
      );
    });
    const readMoreStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const contentStyle = computed(() => {
      return {
        maxHeight: innerVisible.value ? "none" : props.maxHeight + "px"
      };
    });
    const __returned__ = { props, emit, bem, t, innerVisible, startTask, onFinishTask, handleClick, onButtonClick, toggleText, toggleIcon, hideToggle, contentId, toggleId, instance, get scrollTop() {
      return scrollTop;
    }, set scrollTop(v) {
      scrollTop = v;
    }, onTouchStart, onMouseDown, onClose, readMoreClass, readMoreStyle, contentStyle, SarButton, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>