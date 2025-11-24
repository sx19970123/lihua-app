<template>
  <template v-for="item in dictDataOption" :key="item.value">
    <!-- label标签 -->
    <sar-tag
      v-if="isDictData(item) && item.value === dictDataValue"
      style="width: fit-content"
      :style="style"
      :theme="differenceAdapt(item.tagStyle)"
	  :color="item.tagStyle"
      :plain="props.plain"
    >
      <template v-if="fullTreeNode">
        <!-- rootTreeNodePrefix 以分割符开头情况下，去除首位分割符 -->
        <template v-if="rootTreeNodePrefix.startsWith(fullTreeSeparator)">
          {{ getFullLabel(item) }}
        </template>
        <template v-else>
          {{ getFullLabel(item) }}
        </template>
      </template>
      <template v-else>
        {{ item.label }}
      </template>
    </sar-tag>

    <!-- 递归调用组件 -->
    <DictTag
      v-else-if="isDictData(item) && item.children?.length"
      style="width: fit-content"
      :dict-data-value="dictDataValue"
      :dict-data-option="item.children"
      :plain="props.plain"
      :full-tree-node="fullTreeNode"
      :root-tree-node-prefix="getChildPrefix(item)"
    />
  </template>
</template>

<script setup lang="ts">
import { watch } from "vue"
import type { SysDictDataType } from "@/api/system/dict/type/SysDictDataType"

// 给组件命名，递归调用自己
defineOptions({
  name: "DictTag"
})

const props = withDefaults(
  defineProps<{
    dictDataOption: SysDictDataType[],
    dictDataValue: string,
    plain?: boolean,
    style?: Record<string, any>,
    fullTreeNode?: boolean,
    fullTreeSeparator?: string,
    rootTreeNodePrefix?: string
  }>(),
  {
    plain: false,
    style: () => ({ "margin-right": 0 }),
    fullTreeNode: false,
    fullTreeSeparator: "/",
    rootTreeNodePrefix: ""
  }
)

// 类型守卫函数
const isDictData = (item: SysDictDataType | SysDictDataType[]): item is SysDictDataType => {
  return (item as SysDictDataType).value !== undefined
}

// 获取全路径 label
const  getFullLabel = (item: SysDictDataType) => {
  if (props.rootTreeNodePrefix.startsWith(props.fullTreeSeparator)) {
    return props.rootTreeNodePrefix.substring(props.fullTreeSeparator.length) + props.fullTreeSeparator + item.label
  }
  return props.rootTreeNodePrefix + props.fullTreeSeparator + item.label
}

// 递归子节点的 rootTreeNodePrefix
const getChildPrefix = (item: SysDictDataType) => {
  return props.rootTreeNodePrefix === ""
    ? props.fullTreeSeparator + item.label
    : props.rootTreeNodePrefix + props.fullTreeSeparator + item.label
}

// 特殊主题ant design 和 sard 命名不同，进行转化
const differenceAdapt = (theme?: string) => {
	switch(theme) {
		case 'processing':  {
			return 'primary'
		}
		case 'default':  {
			return 'secondary'
		}
		case 'success':  {
			return 'success'
		}
		case 'warning':  {
			return 'warning'
		}
		case 'error':  {
			return 'danger'
		}
	}
}


// 校验必填 prop
if (!props.dictDataValue) {
  console.error("dict-tag/DictTag 组件中 dictDataValue 值不存在")
}
if (!props.dictDataOption) {
  console.error("dict-tag/DictTag 组件中 dictDataOption 值不存在")
}
</script>
