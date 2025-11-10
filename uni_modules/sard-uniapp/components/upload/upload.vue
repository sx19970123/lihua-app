<template>
  <view :class="uploadClass" :style="uploadStyle">
    <slot
      :list="innerValue"
      :on-select="onSelect"
      :on-remove="onRemove"
      :on-image-click="onImageClick"
    >
      <view :class="bem.e('wrapper')">
        <sar-upload-preview
          v-for="(item, index) in innerValue"
          :key="index"
          :file="item.file"
          :url="item.url"
          :is-image="item.isImage"
          :is-video="item.isVideo"
          :status="item.status"
          :name="item.name"
          :message="item.message"
          :removable="removable"
          :index="index"
          :disabled="isDisabled"
          :readonly="isReadonly"
          @remove="onRemove(index, item)"
          @image-click="onImageClick(index)"
          @click="onItemClick(index, item)"
        />
        <view
          v-if="innerValue.length < maxCount && !isReadonly"
          :class="bem.e('select')"
          @click="onSelect"
        >
          <slot name="select">
            <view :class="bem.e('select-icon')">
              <sar-icon family="sari" name="plus" />
            </view>
          </slot>
        </view>
      </view>
    </slot>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref, watch } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  getFileName,
  noop,
  isImageUrl,
  toArray,
  isFunction
} from "../../utils";
import SarUploadPreview from "../upload-preview/upload-preview.vue";
import SarIcon from "../icon/icon.vue";
import { chooseMedia } from "./utils";
import {
  defaultUploadProps
} from "./common";
import { useFormContext, useFormItemContext } from "../form/common";
/**
 * @property {string} rootClass 组件根元素类名，默认值：-。
 * @property {StyleValue} rootStyle 组件根元素样式，默认值：-。
 * @property {'image' | 'video' | ('image' | 'video' )[]} accept 允许上传的文件类型，默认值：'image'。
 * @property {boolean} multiple 是否开启图片多选，默认值：false。
 * @property {('album' | 'camera')[]} sourceType 文件选择来源，默认值：['album', 'camera']。
 * @property {('original' | 'compressed')[]} sizeType 所选的图片的尺寸，默认值：['original', 'compressed']。
 * @property {number} maxDuration 拍摄视频最长拍摄时间，单位秒，默认值：60。
 * @property {'back' | 'front'} camera 默认拉起的是前置或者后置摄像头。部分 Android 手机下由于系统 ROM 不支持无法生效，默认值：'back'。
 * @property {UploadFileItem[]} modelValue 已上传的文件列表，默认值：-。
 * @property {number} maxCount 文件上传数量限制，默认值：Number.MAX_SAFE_INTEGER。
 * @property {number | ((file: File) => boolean)} maxSize 文件大小限制，单位为 `byte`，默认值：Number.MAX_SAFE_INTEGER。
 * @property {(fileItem: UploadFileItem | UploadFileItem[]) => void} overSize 文件大小超过限制时触发，默认值：-。
 * @property {boolean} disabled 是否禁用文件上传，默认值：false。
 * @property {boolean} readonly 是否将上传区域设置为只读状态，默认值：false。
 * @property {(fileList: UploadFileItem[], next: (allowed: boolean | UploadSelectOptions) => void) => void} beforeChoose 文件选择前的回调，接受当前文件列表和 `next` 函数作参数，调用 `next(true)` 允许选择，调用 `next(false)` 不允许选择，或者传入一个配置对象自定义选择，默认值：-。
 * @property {(file: File) => boolean | Promise\<File>} beforeRead 文件读取前的回调，返回 false 可终止文件读取，支持返回 Promise，默认值：-。
 * @property {(fileItem: UploadFileItem | UploadFileItem[]) => void} afterRead 文件读取完成后的回调，默认值：-。
 * @property {boolean} removable 是否可删除，默认值：true。
 * @property {(index: number, fileItem: UploadFileItem) => boolean | Promise\<any>} beforeRemove 文件删除前的回调，返回 false 可终止文件删除，支持返回 Promise，默认值：-。
 * @property {boolean} validateEvent 是否触发表单验证，默认值：true。
 * @event {(value: UploadFileItem[]) => void} update 选择的文件列表改变时触发
 * @event {(value: UploadFileItem[]) => void} change 选择的文件列表改变时触发
 * @event {(index: number, item: UploadFileItem) => void} remove 删除文件时触发
 * @event {(item: UploadFileItem, index: number) => void} item-click 点击文件项时触发
 */
export default  _defineComponent({
  components: {
    SarUploadPreview,
    SarIcon,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "upload",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    accept: { type: [String, Array], required: false },
    multiple: { type: Boolean, required: false },
    sourceType: { type: Array, required: false },
    sizeType: { type: Array, required: false },
    maxDuration: { type: Number, required: false },
    camera: { type: String, required: false },
    modelValue: { type: Array, required: false },
    maxCount: { type: Number, required: false },
    maxSize: { type: [Number, Function], required: false },
    overSize: { type: Function, required: false },
    disabled: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false },
    beforeChoose: { type: Function, required: false },
    beforeRead: { type: Function, required: false },
    afterRead: { type: Function, required: false },
    removable: { type: Boolean, required: false },
    beforeRemove: { type: Function, required: false },
    validateEvent: { type: Boolean, required: false }
  }, defaultUploadProps),
  emits: ["update:model-value", "change", "remove", "item-click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const bem = createBem("upload");
    const formContext = useFormContext();
    const formItemContext = useFormItemContext();
    const isDisabled = computed(() => {
      return formContext?.disabled || props.disabled;
    });
    const isReadonly = computed(() => {
      return formContext?.readonly || props.readonly;
    });
    const innerValue = ref(props.modelValue || []);
    watch(
      () => props.modelValue,
      () => {
        innerValue.value = props.modelValue || [];
        if (props.validateEvent) {
          formItemContext?.onChange();
        }
      }
    );
    const limitCountNode = (files, next) => {
      const remainCount = props.maxCount - innerValue.value.length;
      if (files.length > remainCount) {
        files = files.slice(0, remainCount);
      }
      next(files);
    };
    const beforeReadNode = (files, next) => {
      Promise.allSettled(
        files.map(
          (file) => new Promise((resolve, reject) => {
            if (props.beforeRead) {
              const ret = props.beforeRead(file);
              if (!ret) {
                reject();
                return;
              }
              if (ret instanceof Promise) {
                ret.then((mayNewFile) => {
                  resolve(mayNewFile ?? file);
                }).catch(() => {
                  reject();
                });
                return;
              }
            }
            resolve(file);
          })
        )
      ).then((results) => {
        const fileList = [];
        results.forEach((result) => {
          if (result.status === "fulfilled") {
            fileList.push(result.value);
          }
        });
        next(fileList);
      });
    };
    const toUploadFileNode = (files, next) => {
      const fileList = files.map((file) => {
        return {
          file,
          name: file.name
        };
      });
      next(fileList);
    };
    const limitSizeNode = (fileList, next) => {
      const valid = [];
      const invalid = [];
      fileList.forEach((item) => {
        const file = item.file;
        if (file && (isFunction(props.maxSize) && props.maxSize(file) || file.size && typeof props.maxSize === "number" && file.size > props.maxSize)) {
          invalid.push(item);
        } else {
          valid.push(item);
        }
      });
      if (invalid.length) {
        props.overSize?.(invalid);
      }
      if (valid.length) {
        innerValue.value = [...innerValue.value, ...valid];
        emit("update:model-value", innerValue.value);
        emit("change", innerValue.value);
        next(valid);
      }
    };
    const afterReadNode = (fileList) => {
      toArray(fileList).forEach((fileItem) => {
        props.afterRead?.(fileItem);
      });
    };
    function toChain(files) {
      const chain = [
        limitCountNode,
        beforeReadNode,
        toUploadFileNode,
        limitSizeNode,
        afterReadNode
      ].reduceRight(
        (next, node) => (data) => {
          node(data, next);
        },
        () => {
        }
      );
      chain(files);
    }
    let isSelectPending = false;
    const select = () => {
      if (isSelectPending || isDisabled.value || isReadonly.value || innerValue.value.length >= props.maxCount) {
        return;
      }
      const next = (options = {}) => {
        chooseMedia({
          mediaType: props.accept,
          count: props.multiple ? 9999 : 1,
          sizeType: props.sizeType,
          sourceType: options.sourceType || props.sourceType,
          maxDuration: props.maxDuration,
          camera: props.camera,
          success(result) {
            toChain(
              result.tempFiles.map((file) => {
                return {
                  type: file.fileType,
                  size: file.size,
                  path: file.tempFilePath,
                  duration: file.duration,
                  width: file.width,
                  height: file.height,
                  name: file.name || file.tempFilePath && getFileName(file.tempFilePath)
                };
              })
            );
          },
          fail: noop
        });
      };
      if (props.beforeChoose) {
        isSelectPending = true;
        props.beforeChoose?.(innerValue.value, (allowed) => {
          isSelectPending = false;
          if (allowed) {
            next(typeof allowed === "object" ? allowed : void 0);
          }
        });
      } else {
        next();
      }
    };
    const onSelect = () => {
      select();
    };
    // # remove
    const removingSet =  new WeakSet();
    const onRemove = (index, item) => {
      if (!props.removable || isDisabled.value || isReadonly.value) return;
      if (removingSet.has(item)) {
        return;
      }
      function remove() {
        const list = innerValue.value.filter((_, i) => i !== index);
        innerValue.value = list;
        emit("update:model-value", list);
        emit("change", list);
        emit("remove", index, item);
      }
      if (props.beforeRemove) {
        const ret = props.beforeRemove(index, item);
        if (ret === false) {
          return;
        }
        if (ret instanceof Promise) {
          removingSet.add(item);
          ret.then(() => {
            remove();
          }).catch(() => {
          }).finally(() => {
            removingSet.delete(item);
          });
          return;
        }
      }
      remove();
    };
    // # preview
    const previewImage = (index) => {
      const currentFileItem = innerValue.value[index];
      const fileList = innerValue.value.filter(
        (item) => item.isImage || item.file?.type === "image" || item.url && isImageUrl(item.url)
      );
      const currentIndex = fileList.findIndex((item) => item === currentFileItem);
      const urls = fileList.map((item) => item.url || item.file?.path);
      uni.previewImage({
        urls,
        current: urls[currentIndex]
      });
    };
    const onImageClick = (index) => {
      previewImage(index);
    };
    const onItemClick = (index, fileItem) => {
      emit("item-click", fileItem, index);
    };
    __expose({
      select
    });
    // # others
    const uploadClass = computed(() => {
      return classNames(
        bem.b(),
        bem.m("disabled", isDisabled.value),
        bem.m("readonly", isReadonly.value),
        props.rootClass
      );
    });
    const uploadStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, formContext, formItemContext, isDisabled, isReadonly, innerValue, limitCountNode, beforeReadNode, toUploadFileNode, limitSizeNode, afterReadNode, toChain, get isSelectPending() {
      return isSelectPending;
    }, set isSelectPending(v) {
      isSelectPending = v;
    }, select, onSelect, removingSet, onRemove, previewImage, onImageClick, onItemClick, uploadClass, uploadStyle, SarUploadPreview, SarIcon };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>