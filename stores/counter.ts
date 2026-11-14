import { ref } from 'vue'
import { defineStore } from 'pinia'

// P0 尖峰验证用最小 store（V1：npm pinia 在 uni-app x 蒸汽编译链跑通）
export const useCounterStore = defineStore('counter', () => {
	const count = ref(0)
	const increment = () => {
		count.value++
	}
	return { count, increment }
})
