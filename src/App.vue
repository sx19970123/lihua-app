<script setup lang="ts">
import {onLaunch, onShow, onHide} from "@dcloudio/uni-app"

onLaunch(() => {
	console.log("app launch")
})
onShow(() => {
	console.log("app show");
})
onHide(() => {
	console.log("app hide");
})
</script>

<style lang="scss">
/* 全局样式 */
@import "@/uni.scss";
/* sard-uniapp组件库样式 */
@import 'sard-uniapp/index.scss';
/* sard-uniapp组件库暗色模式 */
@import 'sard-uniapp/dark.scss';
@import '@/assets/icons/icons.css';

page {
	background-color: var(--sar-body-bg);
}
text {
	color: var(--sar-secondary-color);
}
</style>
