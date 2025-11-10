<template>
  <sar-popup
    effect="slide-bottom"
    :visible="innerVisible"
    :duration="duration"
    @overlay-click="onOverlayClick"
    @visible-hook="onVisibleHook"
  >
    <view :class="shareSheetClass" :style="shareSheetStyle">
      <view v-if="title || description" :class="bem.e('header')">
        <view v-if="title" :class="bem.e('title')">
          {{ title }}
        </view>
        <view v-if="description" :class="bem.e('description')">
          {{ description }}
        </view>
      </view>
      <view :class="bem.e('body')">
        <view v-for="(row, i) in finalItemList" :key="i" :class="bem.e('row')">
          <scroll-view scroll-x>
            <view :class="bem.e('row-content')">
              <view
                v-for="(item, j) in row"
                :key="j"
                :class="
                  classNames(
                    bem.e('item'),
                    bem.em('item', 'disabled', item.disabled),
                  )
                "
                @click="onSelect(item)"
              >
                <view
                  :class="bem.e('icon-wrapper')"
                  :style="
                    stringifyStyle({
                      backgroundColor: item.background,
                      color: item.color,
                    })
                  "
                >
                  <image
                    v-if="isImg(item.icon)"
                    :src="item.icon"
                    mode="aspectFill"
                    :class="bem.e('image')"
                  />
                  <sar-icon
                    v-else
                    :name="item.icon"
                    :family="item.iconFamily"
                  />
                </view>
                <view :class="bem.e('item-name')">{{ item.name }}</view>
                <view :class="bem.e('item-description')">
                  {{ item.description }}
                </view>
              </view>
            </view>
          </scroll-view>
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
  isFileUrl,
  isFunction,
  isObject
} from "../../utils";
import SarPopup from "../popup/popup.vue";
import SarIcon from "../icon/icon.vue";
import {
  defaultShareSheetProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {boolean} visible 面板是否可见，默认值：-。
 * @property {number} duration 显隐动画时长，单位 ms，默认值：300。
 * @property {'slide-top' | 'slide-right' | 'slide-bottom' | 'slide-left' | 'zoom' | 'fade'} effect 显隐效果，默认值：'fade'。
 * @property {boolean} overlay 是否显示遮罩，默认值：true。
 * @property {string} overlayClass 添加到遮罩的类名，默认值：-。
 * @property {string} overlayStyle 添加到遮罩的样式，默认值：-。
 * @property {string} background 遮罩背景色，默认值：-。
 * @property {boolean} transparent 透明遮罩，默认值：false。
 * @property {boolean} overlayClosable 点击遮罩后是否关闭，默认值：true。
 * @property {boolean} keepRender 无论刚挂载还是隐藏，都始终不设置 display 为 none，一般用于内部包含计算尺寸的组件的情况，默认值：false。
 * @property {ShareSheetItem[] | ShareSheetItem[][]} itemList 面板选项列表，默认值：[]。
 * @property {string} title 面板标题，默认值：-。
 * @property {string} description 面板描述，默认值：-。
 * @property {string} cancel 取消按钮内容，默认值：-。
 * @property {(type: 'close' | 'cancel' | 'select') => boolean | Promise\<any>} beforeClose 关闭前的回调，返回 `false` 或 `rejected` 状态的 `Promise` 可阻止关闭，默认值：-。
 * @event {(visible: boolean) => void} update 分享面板显隐时触发
 * @event {() => void} close 点击遮罩时触发
 * @event {() => void} cancel 点击取消按钮时触发
 * @event {(item: ShareSheetItem) => void} select 点击分享项时触发
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
    SarIcon,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "share-sheet",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    itemList: { type: Array, required: false },
    title: { type: String, required: false },
    description: { type: String, required: false },
    cancel: { type: String, required: false },
    visible: { type: Boolean, required: false },
    overlayClosable: { type: Boolean, required: false },
    beforeClose: { type: Function, required: false },
    duration: { type: Number, required: false }
  }, defaultShareSheetProps),
  emits: ["update:visible", "close", "cancel", "select", "before-enter", "enter", "after-enter", "enter-cancelled", "before-leave", "leave", "after-leave", "leave-cancelled", "visible-hook"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("share-sheet");
    const finalItemList = computed(() => {
      const itemList = props.itemList;
      if (!Array.isArray(itemList)) {
        return [];
      }
      if (!Array.isArray(itemList[0])) {
        return [itemList];
      }
      return itemList;
    });
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
    const onSelect = (item) => {
      if (!item.disabled) {
        emit("select", item);
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
    const isImg = (url) => {
      return typeof url === "string" && isFileUrl(url);
    };
    const shareSheetClass = computed(() => {
      return classNames(bem.b(), bem.m("titled", !!props.title), props.rootClass);
    });
    const shareSheetStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, finalItemList, innerVisible, perhapsClose, onOverlayClick, onSelect, onCancel, onVisibleHook, isImg, shareSheetClass, shareSheetStyle, get classNames() {
      return classNames;
    }, get stringifyStyle() {
      return stringifyStyle;
    }, SarPopup, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>