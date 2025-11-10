<template>
  <view :class="loadMoreClass" :style="loadMoreStyle" @click="onClick">
    <slot v-if="status === 'incomplete'" name="incomplete">
      {{ incompleteText || t('incompleteText') }}
    </slot>
    <slot v-else-if="status === 'loading'" name="loading">
      <sar-loading>
        {{ loadingText || t('loadingText') }}
      </sar-loading>
    </slot>
    <slot v-else-if="status === 'complete'" name="complete">
      {{ completeText || t('completeText') }}
    </slot>
    <slot v-else-if="status === 'error'" name="error">
      {{ errorText || t('errorText') }}
    </slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import {
  defaultLoadMoreProps
} from "./common";
import { useTranslate } from "../locale";
import SarLoading from "../loading/loading.vue";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {LoadMoreStatus} status 加载的状态，默认值：'incomplete'。
 * @property {string} incompleteText 未加载完的状态文本，默认值：'加载更多'。
 * @property {string} loadingText 加载中的状态文本，默认值：'加载中...'。
 * @property {string} completeText 加载完的状态文本，默认值：'没有更多了'。
 * @property {string} errorText 加载错误的状态文本，默认值：'请求失败，点击重新加载'。
 * @event {() => void} load-more 在 `incomplete` 状态下点击时触发
 * @event {() => void} reload 在 `error` 状态下点击时触发
 */
export default  _defineComponent({
  components: {
    SarLoading,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "load-more",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    status: { type: String, required: false },
    incompleteText: { type: String, required: false },
    loadingText: { type: String, required: false },
    completeText: { type: String, required: false },
    errorText: { type: String, required: false }
  }, defaultLoadMoreProps),
  emits: ["load-more", "reload"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("load-more");
    const { t } = useTranslate("loadMore");
    const onClick = () => {
      if (props.status === "incomplete") {
        emit("load-more");
      } else if (props.status === "error") {
        emit("reload");
      }
    };
    const loadMoreClass = computed(() => {
      return classNames(bem.b(), bem.m(props.status), props.rootClass);
    });
    const loadMoreStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, t, onClick, loadMoreClass, loadMoreStyle, SarLoading };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>