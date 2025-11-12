<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
/* 全局样式 */
@import "@/uni.scss";
/* sard-uniapp组件库样式 */
@import '@/uni_modules/sard-uniapp/index.scss';
/* sard-uniapp组件库暗色模式 */
@import '@/uni_modules/sard-uniapp/dark.scss';

</style>
