// 使用 renderjs 直接操作 window 对象，实现动态控制 app 和 h5 的 bounce
// bounce: iOS 橡皮筋、Android 半月弧、H5 浏览器下拉背景等效果（下拉刷新时需禁止）
// 参考自 mescroll-uni 的 renderjs.js，仅保留 preventDefault 核心逻辑。
// renderjs 运行在 webview 视图层，能在原生滚动提交之前同步执行 preventDefault，
// 这是 App 端下拉阻尼能正常工作的关键（逻辑层 @touchmove 跨 bridge 时已被原生滚动接管）。

var me = {}

// 标记类名：组件根元素带此类，renderjs 才会在其上下拉时 preventDefault
var TOUCH_CLASS = 'ptr-render-touch'
// 标记类名：侧滑区域带此类，横向滑动时锁定页面纵向滚动（防侧滑与上下滚手势冲突）
var SWIPE_LOCK_CLASS = 'ptr-swipe-lock'
// 横向手势触发阈值（px）：横向位移超过此值且大于纵向位移时，判定为横向滑动
var SWIPE_LOCK_THRESHOLD = 6

// 初始化 window 对象的 touch 事件（仅初始化一次）
if (window && !window.$ptrRenderInit) {
	window.$ptrRenderInit = true

	window.addEventListener('touchstart', function (e) {
		// 无条件记录起点：横向锁定逻辑独立于下拉刷新，下拉禁用的页面也需记录
		me.startPoint = me.getPoint(e)
		if (me.disabled()) return
	}, { passive: true })

	window.addEventListener('touchmove', function (e) {
		// 侧滑锁定：横向滑动时立即锁定页面纵向滚动（不依赖下拉刷新状态，独立判定）
		if (me.startPoint && e.cancelable && !e.defaultPrevented) {
			var cur = me.getPoint(e)
			var moveX = cur.x - me.startPoint.x
			var moveY = cur.y - me.startPoint.y
			// 横向手势：横向位移超阈值且不小于纵向位移
			if (Math.abs(moveX) > SWIPE_LOCK_THRESHOLD && Math.abs(moveX) >= Math.abs(moveY)) {
				// 仅当触点位于侧滑区域（带 ptr-swipe-lock 标记）时锁定
				if (isInMarkedArea(e.target, SWIPE_LOCK_CLASS)) {
					e.preventDefault() // 阻止页面纵向滚动与 iOS 橡皮筋
				}
			}
		}

		if (me.disabled()) return
		if (me.getScrollTop() > 0) return // 需在顶部下拉，才禁止 bounce

		var curPoint = me.getPoint(e) // 当前点
		var moveY = curPoint.y - me.startPoint.y // 大于 0 向下拉，小于 0 向上拉
		if (moveY > 0) {
			// 可下拉的条件：非下拉刷新中、非上拉加载中
			if (!me.isDownScrolling && (!me.isUpScrolling || (me.isUpScrolling && me.isUpBoth))) {
				// 只有 touch 在本组件的 view 上面，才禁止 bounce
				var isPtrTouch = isInMarkedArea(e.target, TOUCH_CLASS)
				// 禁止 bounce（不会对 swiper 和 iOS 侧滑返回造成影响）
				if (isPtrTouch && e.cancelable && !e.defaultPrevented) e.preventDefault()
			}
		}
	}, { passive: false })
}

/**
 * 判断触点是否位于带指定标记 class 的 view 内（向上遍历 DOM 到 page-body/body 为止）
 * 用于下拉刷新（ptr-render-touch）与侧滑锁定（ptr-swipe-lock）的区域识别。
 */
function isInMarkedArea(target, className) {
	var el = target
	while (el && el.tagName && el.tagName !== 'UNI-PAGE-BODY' && el.tagName != 'BODY') {
		var cls = el.classList
		if (cls && cls.contains(className)) {
			return true
		}
		el = el.parentNode
	}
	return false
}

/* 获取滚动条位置 */
me.getScrollTop = function () {
	return me.scrollTop || document.documentElement.scrollTop || document.body.scrollTop || 0
}

/* 是否禁用下拉刷新 */
me.disabled = function () {
	return !me.optDown || me.optDown.use === false
}

/* 获取第一个手指坐标 */
me.getPoint = function (e) {
	if (!e) {
		return { x: 0, y: 0 }
	}
	if (e.touches && e.touches[0]) {
		return { x: e.touches[0].pageX, y: e.touches[0].pageY }
	} else if (e.changedTouches && e.changedTouches[0]) {
		return { x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY }
	} else {
		return { x: e.clientX, y: e.clientY }
	}
}

/**
 * 监听逻辑层数据变化（实时更新视图层状态）
 */
function propObserver(wxsProp) {
	me.optDown = wxsProp.optDown
	me.scrollTop = wxsProp.scrollTop
	me.isDownScrolling = wxsProp.isDownScrolling
	me.isUpScrolling = wxsProp.isUpScrolling
	me.isUpBoth = wxsProp.isUpBoth
}

/* 导出模块 */
const renderBiz = {
	data() {
		return {
			propObserver: propObserver,
		}
	},
}

export default renderBiz
