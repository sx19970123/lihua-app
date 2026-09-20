<template>
	<view style="width: fit-content">
		<sar-tag :style="style" :theme="differenceAdapt(targetDict.tagStyle)" :color="targetDict.tagStyle"
			:plain="props.plain">
			{{ targetDict.label }}
		</sar-tag>
	</view>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import type { SysDictDataType } from "@/api/system/dict/type/sys-dict-data-type"
import { traverseWithPath } from "@/utils/tree"
const props = withDefaults(
	defineProps<{
		// 字典选项
		dictDataOption : SysDictDataType[],
		// 字典值
		dictDataValue : string,
		// 是否镂空
		plain ?: boolean,
		// 自定义样式
		style ?: Record<string, any>,
		// 是否展示树形节点全路径
		fullTreeNode ?: boolean,
		// 树形节点分隔符
		fullTreeSeparator ?: string,
		// 树形节点前缀
		rootTreeNodePrefix ?: string
	}>(),
	{
		plain: false,
		style: () => ({ "margin-right": 0 }),
		fullTreeNode: false,
		fullTreeSeparator: "/",
		rootTreeNodePrefix: ""
	}
)

// 目标字典
const targetDict = ref<SysDictDataType>({})

const initTargetDict = () => {
	const option = props.dictDataOption
	const value = props.dictDataValue
	// option 和 value 全部存在时才进行处理
	if (option && option.length > 0 && value) {
		// 遍历树形所有节点，命中则浅拷贝节点组装 label（拷贝后再改写，避免污染 store 中的字典源数据）
		traverseWithPath(option, (dictDataList : SysDictDataType[]) => {
			if (!props.fullTreeSeparator) {
				return
			}
			const targetIndex = dictDataList.findIndex(item => item.value === value)
			if (targetIndex === -1) {
				return
			}
			const dict = dictDataList[targetIndex]
			const label = props.fullTreeNode
				? dictDataList.slice(0, targetIndex + 1).map(item => item.label).join(props.fullTreeSeparator)
				: dict.label
			targetDict.value = {
				...dict,
				label: props.rootTreeNodePrefix !== "" ? props.rootTreeNodePrefix + props.fullTreeSeparator + label : label
			}
		})
	}
}

// 特殊主题ant design 和 sard 命名不同，进行转化
const differenceAdapt = (theme ?: string) => {
	switch (theme) {
		case 'processing': {
			return 'primary'
		}
		case 'default': {
			return 'secondary'
		}
		case 'success': {
			return 'success'
		}
		case 'warning': {
			return 'warning'
		}
		case 'error': {
			return 'danger'
		}
		default: {
			return 'default'
		}
	}
}

// 监听字典 option 与值变化（合并单 watch，避免双 immediate 同 tick 重复初始化）
watch([() => props.dictDataOption, () => props.dictDataValue], () => {
	initTargetDict()
}, { immediate: true })

// 校验必填 prop（仅开发期提示）
if (import.meta.env.DEV) {
	if (!props.dictDataValue) {
		console.error("dict-tag 组件中 dictDataValue 值不存在")
	}
	if (!props.dictDataOption) {
		console.error("dict-tag 组件中 dictDataOption 值不存在")
	}
}
</script>