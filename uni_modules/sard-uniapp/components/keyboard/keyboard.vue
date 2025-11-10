<template>
  <view :class="keyboardClass" :style="keyboardStyle">
    <view :class="bem.e('content')">
      <template v-if="type === 'number'">
        <view
          v-for="key in numberKeys"
          :key="key"
          :class="classNames(bem.e('key-wrapper'), bem.em('key-wrapper', key))"
          @click="onKeyClick(key)"
        >
          <view :class="bem.e('key')">
            {{ key }}
          </view>
        </view>
      </template>
      <template v-else-if="type === 'digit'">
        <view
          v-for="key in digitKeys"
          :key="key"
          :class="classNames(bem.e('key-wrapper'), bem.em('key-wrapper', key))"
          @click="onKeyClick(key)"
        >
          <view :class="bem.e('key')">
            {{ key }}
          </view>
        </view>
      </template>
      <template v-else-if="type === 'idcard'">
        <view
          v-for="key in idcardKeys"
          :key="key"
          :class="classNames(bem.e('key-wrapper'), bem.em('key-wrapper', key))"
          @click="onKeyClick(key)"
        >
          <view :class="bem.e('key')">
            {{ key }}
          </view>
        </view>
      </template>
      <template v-else-if="type === 'random'">
        <view
          v-for="key in randomKeys"
          :key="key"
          :class="classNames(bem.e('key-wrapper'), bem.em('key-wrapper', key))"
          @click="onKeyClick(key)"
        >
          <view :class="bem.e('key')">
            {{ key }}
          </view>
        </view>
      </template>
      <template v-else-if="type === 'plate'">
        <template v-if="innerMode === 'chinese'">
          <view
            v-for="(key, i) in chineseKeys"
            :key="key"
            :class="
              classNames(bem.e('key-wrapper'), bem.em('key-wrapper', key))
            "
            :style="`order: ${i}`"
            @click="onKeyClick(key)"
          >
            <view :class="bem.e('key')">
              {{ key }}
            </view>
          </view>
          <view
            :class="bem.e('intercept')"
            :style="`order: ${interceptOrder}`"
          ></view>
        </template>
        <template v-if="innerMode === 'english'">
          <view
            v-for="(key, i) in englishKeys"
            :key="key"
            :style="`order: ${i}`"
            :class="
              classNames(bem.e('key-wrapper'), bem.em('key-wrapper', key))
            "
            @click="onKeyClick(key)"
          >
            <view :class="bem.e('key')">
              {{ key }}
            </view>
          </view>
        </template>
        <view
          :class="toggleClass"
          :style="`order: ${interceptOrder}`"
          @click="onToggle()"
        >
          <view :class="bem.e('key')">
            {{ toggleKey }}
          </view>
        </view>
      </template>
      <view :class="backspaceClass" style="order: 100" @click="onBackspace">
        <view :class="bem.e('key')">
          <sar-icon family="sari" name="backspace" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref, watch } from "vue";
import { classNames, stringifyStyle, createBem } from "../../utils";
import {
  numberKeys,
  digitKeys,
  idcardKeys,
  chineseKeys,
  englishKeys,
  getRandomKeys,
  defaultKeyboardProps
} from "./common";
import SarIcon from "../icon/icon.vue";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {'number' | 'digit' | 'idcard' | 'random' | 'plate'} type 键盘类型，默认值：'number'。
 * @property {'chinese' | 'english'} mode 'plate'键盘时的模式，默认值：'chinese'。
 * @event {(key: string) => void} input 可输入按键点击时触发
 * @event {() => void} delete 点击删除按钮时触发
 * @event {(mode: 'chinese' | 'english') => void} toggle 切换车牌号的中英文时触发
 * @event {(mode: 'chinese' | 'english') => void} update 切换车牌号的中英文时触发
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
  __name: "keyboard",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    type: { type: String, required: false },
    mode: { type: String, required: false }
  }, defaultKeyboardProps),
  emits: ["input", "delete", "toggle", "update:mode"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("keyboard");
    const onKeyClick = (key) => {
      emit("input", key);
    };
    const onBackspace = () => {
      emit("delete");
    };
    __expose({
      shuffle() {
        randomKeys.value = getRandomKeys();
      },
      toggle(mode) {
        onToggle(mode);
      }
    });
    const randomKeys = ref([]);
    watch(
      () => props.type,
      () => {
        if (props.type === "random") {
          randomKeys.value = getRandomKeys();
        }
      },
      {
        immediate: true
      }
    );
    const innerMode = ref(props.mode);
    watch(
      () => props.mode,
      () => {
        innerMode.value = props.mode;
      }
    );
    const toggleKey = computed(() => {
      return {
        chinese: "ABC",
        english: "\u7701\u4EFD"
      }[innerMode.value];
    });
    const interceptOrder = computed(() => {
      if (innerMode.value === "english") {
        return englishKeys.length - 8;
      }
      const overflow = chineseKeys.length % 10;
      return chineseKeys.length - (overflow > 7 ? 0 : overflow + 1);
    });
    const onToggle = (newMode) => {
      innerMode.value = newMode || (innerMode.value === "chinese" ? "english" : "chinese");
      emit("toggle", innerMode.value);
      emit("update:mode", innerMode.value);
    };
    const keyboardClass = computed(() => {
      return classNames(bem.b(), bem.m(props.type), props.rootClass);
    });
    const keyboardStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const toggleClass = computed(() => {
      return classNames(bem.e("key-wrapper"), bem.em("key-wrapper", "toggle"));
    });
    const backspaceClass = computed(() => {
      return classNames(bem.e("key-wrapper"), bem.em("key-wrapper", "backspace"));
    });
    const __returned__ = { props, emit, bem, onKeyClick, onBackspace, randomKeys, innerMode, toggleKey, interceptOrder, onToggle, keyboardClass, keyboardStyle, toggleClass, backspaceClass, get classNames() {
      return classNames;
    }, get numberKeys() {
      return numberKeys;
    }, get digitKeys() {
      return digitKeys;
    }, get idcardKeys() {
      return idcardKeys;
    }, get chineseKeys() {
      return chineseKeys;
    }, get englishKeys() {
      return englishKeys;
    }, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>