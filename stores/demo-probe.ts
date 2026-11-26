import { ref } from 'vue'
import { defineStore } from 'pinia'

// 组件 demo 的 tab 页自检开关：demo 页置位后 switchTab，tab 页据此显示对应组件的自检面板，离开 tab 页即清空
export const useDemoProbeStore = defineStore('demo-probe', () => {
	// 正在自检的组件名，空串=无
	const tabProbe = ref('')
	const enterTabProbe = (name : string) => {
		tabProbe.value = name
	}
	const leaveTabProbe = () => {
		tabProbe.value = ''
	}
	return { tabProbe, enterTabProbe, leaveTabProbe }
})
