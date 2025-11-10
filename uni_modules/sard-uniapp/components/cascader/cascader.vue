<template>
  <view :class="cascaderClass" :style="cascaderStyle">
    <sar-tabs scrollable v-model:current="currentTab" :list="tabList" />

    <slot name="top" :tab-index="currentTab"></slot>

    <view :class="bem.e('container')">
      <view
        :class="bem.e('wrapper')"
        :style="
          stringifyStyle({
            transform: `translateX(${-Number(currentTab) * 100}%)`,
            transitionDuration: renderedPane ? null : '0s',
          })
        "
      >
        <view
          v-for="(panel, panelIndex) in panels"
          :key="panelIndex"
          :class="bem.e('pane')"
        >
          <view :class="bem.e('options')">
            <scroll-view scroll-y trap-scroll :class="bem.e('scroll')">
              <view
                v-for="(option, optionIndex) in panel.options"
                :key="optionIndex"
                :class="
                  classNames(
                    bem.e('option'),
                    bem.em(
                      'option',
                      'selected',
                      panel.selected &&
                        panel.selected[mergedFieldKeys.value] ===
                          option[mergedFieldKeys.value],
                    ),
                    bem.em(
                      'option',
                      'disabled',
                      option[mergedFieldKeys.disabled],
                    ),
                  )
                "
                @click="onOptionClick(option, panelIndex)"
              >
                <view :class="bem.e('option-label')">
                  {{
                    labelRender
                      ? labelRender(option)
                      : option[mergedFieldKeys.label]
                  }}
                </view>
                <view :class="bem.e('option-icon')">
                  <sar-icon family="sari" name="success" />
                </view>
              </view>
            </scroll-view>
            <view
              :class="
                classNames(
                  bem.e('loading-wrapper'),
                  bem.em('loading-wrapper', 'show', panel.options.length === 0),
                )
              "
            >
              <view :class="bem.e('loading')">
                <sar-loading />
              </view>
            </view>
          </view>
        </view>
      </view>
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
  isEmptyBinding,
  isEmptyArray
} from "../../utils";
import { useTranslate } from "../locale";
import SarTabs from "../tabs/tabs.vue";
import SarIcon from "../icon/icon.vue";
import SarLoading from "../loading/loading.vue";
import {
  defaultFieldKeys,
  getSelectedOptionsByValue,
  defaultCascaderProps
} from "./common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {string | number | (string | number)[]} modelValue 选中项的值，默认值：-。
 * @property {CascaderOption[]} options 可选项数据源，默认值：[]。
 * @property {CascaderFieldKeys} fieldKeys 自定义 `options` 中的字段，默认值：defaultFieldKeys。
 * @property {string} hintText 未选中时的提示文案，默认值：'请选择'。
 * @property {(option: CascaderOption) => string} labelRender 自定义可选项渲染，默认值：-。
 * @property {boolean} changeOnSelect 点击每级选项都会触发变化，默认值：false。
 * @property {boolean} allLevels 是否绑定所有级别的值，而不单单是最后一级，默认值：false。
 * @event {(value: string | number | (string | number)[], selectedOptions: CascaderOption[]) => void} update 全部选项选择完成后触发
 * @event {(value: string | number | (string | number)[], selectedOptions: CascaderOption[]) => void} change 全部选项选择完成后触发
 * @event {(option: CascaderOption, tabIndex: number) => void} select 选中某一项时触发
 */
export default  _defineComponent({
  components: {
    SarTabs,
    SarIcon,
    SarLoading,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "cascader",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    modelValue: { type: [String, Number, Array], required: false },
    options: { type: Array, required: false },
    fieldKeys: { type: Object, required: false },
    hintText: { type: String, required: false },
    labelRender: { type: Function, required: false },
    changeOnSelect: { type: Boolean, required: false },
    allLevels: { type: Boolean, required: false }
  }, defaultCascaderProps),
  emits: ["update:model-value", "change", "select"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("cascader");
    const { t } = useTranslate("cascader");
    const updatePanels = () => {
      let nextPanels;
      if (isEmptyBinding(tempValue) || isEmptyArray(tempValue)) {
        nextPanels = [
          {
            options: props.options || [],
            selected: null
          }
        ];
      } else {
        const selectedOptions = getSelectedOptionsByValue(
          props.options || [],
          tempValue,
          mergedFieldKeys.value
        );
        if (selectedOptions && selectedOptions.length > 0) {
          let nextOptions = props.options;
          nextPanels = selectedOptions.map((option) => {
            const panel = {
              options: nextOptions || [],
              selected: option
            };
            nextOptions = option[mergedFieldKeys.value.children];
            return panel;
          });
          if (nextOptions) {
            nextPanels.push({
              options: nextOptions,
              selected: null
            });
          }
        } else {
          nextPanels = [
            {
              options: props.options || [],
              selected: null
            }
          ];
        }
      }
      panels.value = nextPanels;
      currentTab.value = nextPanels.length - 1;
      if (!renderedPane.value) {
        setTimeout(() => {
          renderedPane.value = true;
        }, 30);
      }
    };
    const isLastOption = (option) => {
      return !Array.isArray(option[mergedFieldKeys.value.children]);
    };
    const onOptionClick = (option, panelIndex) => {
      if (option.disabled) {
        return;
      }
      let nextPanels = panels.value.slice();
      nextPanels[panelIndex].selected = option;
      const selectBack = panelIndex < nextPanels.length - 1;
      if (selectBack) {
        nextPanels = nextPanels.slice(0, panelIndex + 1);
      }
      const isLast = isLastOption(option);
      if (!isLast) {
        const nextPanel = {
          options: option[mergedFieldKeys.value.children],
          selected: null
        };
        nextPanels.push(nextPanel);
      }
      currentTab.value = isLast ? panelIndex : nextPanels.length - 1;
      if (props.allLevels) {
        tempValue = nextPanels.map((panel) => panel.selected).filter(Boolean).map((option2) => option2[mergedFieldKeys.value.value]);
      } else {
        tempValue = option[mergedFieldKeys.value.value];
      }
      panels.value = nextPanels;
      emit("select", option, panelIndex);
      if (isLast || props.changeOnSelect) {
        const selectedOptions = nextPanels.map((panel) => panel.selected).filter(Boolean);
        emit("update:model-value", tempValue, selectedOptions);
        emit("change", tempValue, selectedOptions);
      }
    };
    const innerPaceholder = computed(() => {
      return props.hintText || t("pleaseSelect");
    });
    const mergedFieldKeys = computed(() => {
      return Object.assign(
        {},
        defaultFieldKeys,
        props.fieldKeys
      );
    });
    let tempValue = props.modelValue;
    const currentTab = ref(0);
    const renderedPane = ref(false);
    const panels = ref([]);
    const tabList = computed(() => {
      return panels.value.map((panel) => {
        const { selected } = panel;
        const label = selected ? selected[mergedFieldKeys.value.label] : innerPaceholder.value;
        return {
          title: label
        };
      });
    });
    watch(
      () => props.modelValue,
      () => {
        if (Array.isArray(props.modelValue)) {
          if (props.modelValue.length > 0) {
            if (props.modelValue.every(
              (item, index) => panels.value[index].selected?.[mergedFieldKeys.value.value] === item
            )) {
              return;
            }
          }
        } else {
          if (!isEmptyBinding(props.modelValue)) {
            if (panels.value.some(
              (panel) => panel.selected?.[mergedFieldKeys.value.value] === props.modelValue
            )) {
              return;
            }
          }
        }
        tempValue = props.modelValue;
        updatePanels();
      }
    );
    watch(
      () => props.options,
      () => {
        updatePanels();
      },
      {
        immediate: true
      }
    );
    const cascaderClass = computed(() => {
      return classNames(bem.b(), props.rootClass);
    });
    const cascaderStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, t, updatePanels, isLastOption, onOptionClick, innerPaceholder, mergedFieldKeys, get tempValue() {
      return tempValue;
    }, set tempValue(v) {
      tempValue = v;
    }, currentTab, renderedPane, panels, tabList, cascaderClass, cascaderStyle, get classNames() {
      return classNames;
    }, get stringifyStyle() {
      return stringifyStyle;
    }, SarTabs, SarIcon, SarLoading };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>