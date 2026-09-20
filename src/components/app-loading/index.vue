<template>
  <view
    class="app-loading"
    :class="[
      rootClass,
      { 'app-loading--vertical': vertical },
    ]"
    :style="loadingStyle"
  >
    <view class="app-loading__spinner">
      <view class="app-loading__track" />
      <view class="app-loading__indicator" />
    </view>
    <text v-if="text" class="app-loading__text">{{ text }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** 圆环尺寸。 */
  size?: string
  /** 圆环描边宽度。 */
  strokeWidth?: string
  /** 圆环与默认文字颜色。 */
  color?: string
  /** 轨道透明度。 */
  trackOpacity?: number
  /** 可选加载文案。 */
  text?: string
  /** 文案颜色；默认跟随圆环。 */
  textColor?: string
  /** 文案字号。 */
  textSize?: string
  /** 是否纵向排列圆环和文案。 */
  vertical?: boolean
  /** 根节点附加类名。 */
  rootClass?: string
  /** 根节点附加样式。 */
  rootStyle?: string | Record<string, string | number>
}

const props = withDefaults(defineProps<Props>(), {
  size: '44rpx',
  strokeWidth: '4rpx',
  color: 'var(--sar-secondary-color)',
  trackOpacity: 0.28,
  text: '',
  textColor: '',
  textSize: '26rpx',
  vertical: false,
  rootClass: '',
  rootStyle: '',
})

const loadingStyle = computed(() => [
  props.rootStyle,
  {
    '--app-loading-size': props.size,
    '--app-loading-stroke-width': props.strokeWidth,
    '--app-loading-color': props.color,
    '--app-loading-track-opacity': String(props.trackOpacity),
    '--app-loading-text-color': props.textColor || props.color,
    '--app-loading-text-size': props.textSize,
  },
])
</script>

<style scoped>
.app-loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--app-loading-color);
}

.app-loading--vertical {
  flex-direction: column;
}

.app-loading__spinner {
  position: relative;
  width: var(--app-loading-size);
  height: var(--app-loading-size);
  flex: none;
}

.app-loading__track,
.app-loading__indicator {
  position: absolute;
  inset: 0;
  box-sizing: border-box;
  border-width: var(--app-loading-stroke-width);
  border-style: solid;
  border-radius: 50%;
}

.app-loading__track {
  border-color: currentColor;
  opacity: var(--app-loading-track-opacity);
}

.app-loading__indicator {
  border-color: transparent;
  border-top-color: currentColor;
  animation: app-loading-rotate 720ms linear infinite;
}

.app-loading__text {
  margin-left: 14rpx;
  color: var(--app-loading-text-color);
  font-size: var(--app-loading-text-size);
  line-height: 1.4;
}

.app-loading--vertical .app-loading__text {
  margin-top: 16rpx;
  margin-left: 0;
}

@keyframes app-loading-rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
