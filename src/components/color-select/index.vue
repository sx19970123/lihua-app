<template>
	<sar-space>
		<view v-for="item in props.dataSource" :key="item.key || item.color" class="color-item"
			:style="{ backgroundColor: item.color, boxShadow: boxShadowFor(item.color) }" @click="selectedColor(item)">
			<!-- 选中图标 -->
			<sar-icon name="check" v-if="isSelected(item)" class="check-icon" size="var(--sar-text-xl)"
				:color="checkColorFor(item.color)" />
		</view>
		<!-- 自定义颜色入口（仅 v-model:color 模式）三态：未自定义=透明底+A 标记（任意色入口，不用彩色
			占位——与预置渐变块如头像「跟随系统」视觉打架）；自定义过但当前选的是预置色=常显记忆色（可点击快捷重选）；
			当前即自定义色=显示该色并打勾。点击行为：仅抽屉打开起步于当前色，应用记忆色只发生在非自定义选中态 -->
		<view v-if="props.allowCustom" class="color-item custom-item"
			:style="{ backgroundColor: customBackground, boxShadow: boxShadowFor(customBackground) }"
			@click="handleCustomSwatchClick">
			<sar-icon name="check" v-if="isCustomActive" size="var(--sar-text-xl)"
				:color="checkColorFor(customBackground)" />
			<text v-else-if="!storedCustomColor" class="custom-auto-a">A</text>
		</view>
	</sar-space>
	<!-- 自定义取色抽屉：确认（change）才写记忆并对外应用，取消/点遮罩只关闭不生效；
		resettable 让关闭后丢弃未确认草稿，起步色每次打开按当前色/记忆重算 -->
	<sar-color-picker-popout v-if="props.allowCustom" v-model:visible="pickerVisible" v-model="pickerColor"
		title="自定义颜色" format="hex" resettable @change="handleCustomChange" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type ColorSelectItem = {
	name : string
	color : string
	key ?: string
}

const props = defineProps<{
	dataSource : Array<ColorSelectItem>,
	color ?: string,
	value ?: string,
	// 自定义颜色入口开关（仅 v-model:color 模式生效）：开启后尾部追加取色器项
	allowCustom ?: boolean,
	// 自定义色记忆的 storage 键（开启 allowCustom 时必传——共享键会跨场景相互覆盖，如头像与主题）
	customColorStorageKey ?: string,
}>()

const emits = defineEmits(['update:color', 'update:value', 'click'])

// 加载检查：开启自定义颜色却未指定记忆键——多场景共用单键会相互覆盖，必须显式传入
if (props.allowCustom && !props.customColorStorageKey) {
	console.error('[color-select] 开启 allowCustom 时必须指定 customColorStorageKey（自定义色记忆的 storage 键），多场景共享键会相互覆盖')
}

// 运行时兜底键（仅漏传检查失效时兜住读写，勿作为不传键的理由）
const storageKey = () => props.customColorStorageKey ?? 'colorSelectCustomColor'

/** 判断是否选中 */
const isSelected = (item : ColorSelectItem) => {
	if (props.color) {
		return item.color === props.color
	}
	if (props.value) {
		return item.key === props.value
	}
	return false
}

const selectedColor = ({ color, name, key } : ColorSelectItem) => {
	emits('update:color', color)
	emits('update:value', key)
	emits('click', { color, name, key })
}

// ---------- 自定义颜色（allowCustom） ----------
// 合法 3/6 位 hex（自定义色的持久化与抽屉起步判定共用）
const HEX_COLOR_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

// 上次确认的自定义色记忆（uni storage，本机维度跨会话保留；键由 customColorStorageKey 按场景隔离）
const readStoredCustomColor = () => {
	const stored = uni.getStorageSync(storageKey()) as string
	return stored && HEX_COLOR_PATTERN.test(stored) ? stored : undefined
}

const storedCustomColor = ref<string | undefined>(readStoredCustomColor())

// 选中态（仅 allowCustom 场景有意义）：当前颜色不在预置候选中即为自定义选中
// （含跨设备/清记忆场景——同色换机器也正确回显勾），不依赖本机记忆色比对；
// 按字符串等值判定——候选项 color 需与 v-model 值同形（同色不同写法会被判为自定义）
const isCustomActive = computed(() => !!props.allowCustom && !!props.color && !props.dataSource.some(item => item.color === props.color))

// 块底色：当前选中即自定义色时直接显示该色（与勾同源，跨设备/无记忆也正确显色）；
// 否则自定义过常显记忆色，都没有则透明（A 标记见模板——不用彩色占位，避免与预置渐变块打架）
const customBackground = computed(() => {
	if (isCustomActive.value && props.color) {
		return props.color
	}
	return storedCustomColor.value ?? 'transparent'
})

// ---------- 颜色解析与视觉（移植自 web 端；阴影用 rgba 替代 color-mix，兼容小程序/老 webview） ----------
// 解析 rgb()/rgba()/#hex 为 [r,g,b]；渐变/var 等运行时颜色返回 undefined
const parseColor = (color : string) : [number, number, number] | undefined => {
	const rgb = color.match(/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/)
	if (rgb) return [+rgb[1], +rgb[2], +rgb[3]]
	const hex = color.match(HEX_COLOR_PATTERN)
	if (hex) {
		const expanded = hex[1].length === 3 ? hex[1].split('').map(c => c + c).join('') : hex[1]
		return [0, 2, 4].map(i => parseInt(expanded.slice(i, i + 2), 16)) as [number, number, number]
	}
	return undefined
}

// 仅 rgb()/rgba()/#hex 可解析；var()/渐变等运行时颜色返回 false，走中性阴影
const isNearWhite = (color : string) => {
	const rgb = parseColor(color)
	return !!rgb && rgb.every(v => v >= 235)
}

// 色块带同色柔光阴影；接近白的浅色块同色光晕在浅底上不可见，回退中性阴影；
// 渐变色（如头像的"跟随系统"块）与透明占位无法解析混色，跳过
const boxShadowFor = (color : string) => {
	if (color.includes('gradient') || color === 'transparent') return undefined
	if (isNearWhite(color)) return '0 2px 6px rgba(0, 0, 0, 0.25)'
	const rgb = parseColor(color)
	if (!rgb) return undefined
	return `0 2px 6px rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.4)`
}

// 勾形颜色按底色亮度动态取黑/白（WCAG 相对亮度；gamma 校正后合成）。
// 阈值取 0.6（刻意克制）：仅接近白的很浅底色用黑勾，彩色与深色一律白勾——
// 白勾视觉更协调，不按对比度最优切换，避免中等亮度的彩色也被判黑
const checkColorFor = (background : string) => {
	const rgb = parseColor(background)
	if (!rgb) {
		return '#fff'
	}
	const channel = (v : number) => {
		const s = v / 255
		return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
	}
	const luminance = 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2])
	return luminance > 0.6 ? 'rgba(0, 0, 0, 0.88)' : '#fff'
}

// ---------- 取色抽屉（sar-color-picker-popout：底部抽屉 + 确定/取消） ----------
const pickerVisible = ref(false)
// 抽屉面板色（每次打开前按下方优先级赋起步值；确认 change 才对外应用）
const pickerColor = ref<string>('#1989FA')

// 点击自定义入口：有记忆且当前非自定义选中态时快捷应用记忆色（快速重选上次的色，抽屉仍打开可继续微调）；
// 当前已是自定义色（带值来修改）：仅打开抽屉起步于当前色，不应用记忆（多账号同机时记忆是他人的）
const handleCustomSwatchClick = () => {
	if (storedCustomColor.value && !isCustomActive.value) {
		emits('update:color', storedCustomColor.value)
		emits('click', { color: storedCustomColor.value, name: '自定义' })
	}
	// 起步色优先当前 v-model 色——多账号同机时各自的当前色才是修改起点（记忆是上一用户的会错意）；
	// v-model 非合法 hex（预置 rgb()/'auto' 等非自定义形态）时回退本机记忆色，再无则交面板默认
	pickerColor.value = props.color && HEX_COLOR_PATTERN.test(props.color)
		? props.color
		: storedCustomColor.value ?? pickerColor.value
	pickerVisible.value = true
}

// 抽屉确认（sard 仅在面板色与当前值不同时触发 change）：sard 输出大写 hex，
// 统一小写与 web 端存储格式对齐；先存记忆再对外应用
const handleCustomChange = (value : string) => {
	const hex = value.toLowerCase()
	storedCustomColor.value = hex
	uni.setStorageSync(storageKey(), hex)
	pickerColor.value = hex
	emits('update:color', hex)
	emits('click', { color: hex, name: '自定义' })
}
</script>

<style scoped>
.color-item {
	width: var(--sar-text-2xl);
	height: var(--sar-text-2xl);
	border-radius: var(--sar-rounded-lg);
	display: flex;
	justify-content: center;
	align-items: center;
}

/* 自定义入口色块：透明态靠背景区分不了边界，加中性描边标识可点击区域 */
.custom-item {
	border: 1px solid var(--sar-border-color);
}

/* 未自定义态的 A 标记（任意色入口）：弱化文字色，与勾形区分 */
.custom-auto-a {
	font-size: var(--sar-text-sm);
	line-height: 1;
	color: var(--sar-tertiary-color);
}
</style>
