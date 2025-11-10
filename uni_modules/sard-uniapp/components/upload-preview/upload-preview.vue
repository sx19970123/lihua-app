<template>
  <view
    :class="uploadPreviewClass"
    :style="uploadPreviewStyle"
    @click="onClick"
  >
    <image
      v-if="isImage"
      :class="bem.e('image')"
      mode="aspectFill"
      :src="mediaUrl"
      @click="onImageClick"
    />
    <view v-else-if="isVideo" :class="bem.e('video-wrapper')">
      <video
        :class="bem.e('video')"
        :id="videoId"
        :src="mediaUrl"
        :controls="controlsVisible"
        :show-center-play-btn="false"
        @fullscreenchange="onFullscreenchange"
      />

      <view :class="bem.e('video-play')" @click="onPlayClick">
        <sar-icon family="sari" name="play" size="80rpx" />
      </view>
    </view>
    <view v-else :class="bem.e('file')">
      <view :class="bem.e('file-icon')">
        <sar-icon family="sari" name="file" />
      </view>
      <view :class="bem.e('file-name')">
        {{ name }}
      </view>
    </view>
    <view
      v-if="status === 'uploading' || status === 'failed'"
      :class="bem.e('status')"
    >
      <view :class="bem.e('status-icon')">
        <sar-loading v-if="status === 'uploading'" />
        <sar-icon
          v-else-if="status === 'failed'"
          family="sari"
          name="x-circle"
        />
      </view>

      <view v-if="message" :class="bem.e('status-message')">{{ message }}</view>
    </view>
    <view
      v-if="removable && !disabled && !readonly && status !== 'uploading'"
      :class="bem.e('remove')"
      @click.stop="onRemove"
    >
      <view :class="bem.e('close')">
        <sar-icon family="sari" name="close" />
      </view>
    </view>
  </view>
</template>

<script>
import { mergeDefaults as _mergeDefaults, defineComponent as _defineComponent } from "vue";
import { computed, ref, getCurrentInstance } from "vue";
import {
  classNames,
  stringifyStyle,
  createBem,
  isImageUrl,
  isVideoUrl,
  uniqid
} from "../../utils";
import SarIcon from "../icon/icon.vue";
import SarLoading from "../loading/loading.vue";
import {
  defaultUploadPreviewProps
} from "../upload/common";
export default  _defineComponent({
  components: {
    SarIcon,
    SarLoading,
  },
  ...{
    options: {
      virtualHost: true,
      styleIsolation: "shared"
    }
  },
  __name: "upload-preview",
  props:  _mergeDefaults({
    rootStyle: { type: [Boolean, null, String, Object, Array], required: false, skipCheck: true },
    rootClass: { type: String, required: false },
    file: { type: Object, required: false },
    url: { type: String, required: false },
    isImage: { type: Boolean, required: false },
    isVideo: { type: Boolean, required: false },
    status: { type: String, required: false },
    name: { type: String, required: false },
    message: { type: String, required: false },
    removable: { type: Boolean, required: false },
    index: { type: Number, required: true },
    disabled: { type: Boolean, required: false },
    readonly: { type: Boolean, required: false }
  }, defaultUploadPreviewProps),
  emits: ["image-click", "remove", "click"],
  setup(__props, { expose: __expose, emit: __emit }) {
    __expose();
    const props = __props;
    const emit = __emit;
    const bem = createBem("upload");
    const isImage = computed(() => {
      return props.isImage || props.file?.type === "image" || props.url && isImageUrl(props.url);
    });
    const isVideo = computed(() => {
      return props.isVideo || props.file?.type === "video" || props.url && isVideoUrl(props.url);
    });
    const mediaUrl = computed(() => {
      return props.url || props.file?.path || "";
    });
    const onImageClick = () => {
      emit("image-click");
    };
    const videoId = uniqid();
    const instance = getCurrentInstance();
    const controlsVisible = ref(false);
    const videoContext = uni.createVideoContext(videoId, instance);
    const onFullscreenchange = (event) => {
      if (event.detail.fullScreen) {
        videoContext.play();
        controlsVisible.value = true;
      } else {
        videoContext.pause();
        controlsVisible.value = false;
      }
    };
    const previewVideo = () => {
      videoContext.requestFullScreen({
        direction: 0
      });
    };
    const onPlayClick = () => {
      previewVideo();
    };
    const onRemove = () => {
      if (!props.removable || props.disabled || props.readonly) return;
      emit("remove");
    };
    const onClick = () => {
      emit("click");
    };
    const uploadPreviewClass = computed(() => {
      return classNames(
        bem.e("preview"),
        bem.em("preview", "is-video", isVideo.value),
        props.rootClass
      );
    });
    const uploadPreviewStyle = computed(() => {
      return stringifyStyle(props.rootStyle);
    });
    const __returned__ = { props, emit, bem, isImage, isVideo, mediaUrl, onImageClick, videoId, instance, controlsVisible, videoContext, onFullscreenchange, previewVideo, onPlayClick, onRemove, onClick, uploadPreviewClass, uploadPreviewStyle, SarIcon, SarLoading };
    return __returned__;
  }
});
</script>

<style lang="scss">
@import './index.scss';
</style>