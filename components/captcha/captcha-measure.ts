// 验证码·量测：点选题蒙层位置、图块宽度兜底
import type { CaptchaContext } from './captcha-context'

export type CaptchaMeasure = {
	// 量点选蒙层的绝对位置，写进 maskRect（轨迹换算基准）
	measureMask : () => Promise<void>
	// 图块宽度兜底：响应缺 templateImageWidth/Height 时（部分类型不返回），用加载后自然比例算
	onPieceLoad : (e : any) => void
}

export const createCaptchaMeasure = (ctx : CaptchaContext) : CaptchaMeasure => {
	// 图块宽度兜底：响应缺 templateImageWidth/Height 时（部分类型不返回），用加载后自然比例算
	const onPieceLoad = (e : any) => {
		if (ctx.pieceWidth.value > 0) {
			return
		}
		const d = e.detail
		if (d && d.width > 0 && d.height > 0) {
			ctx.pieceWidth.value = Math.round(ctx.IMAGE_HEIGHT * d.width / d.height)
		}
	}

	const measureMask = () : Promise<void> => {
		return new Promise(resolve => {
			// App/Web 经缓存的页面实例 getElementById 取；微信端回退 selectorQuery
			const el = ctx.ownerPage?.getElementById('lh-cap-click-mask')
			if (el) {
				// Async 版跨端（MP 端无同步 getBoundingClientRect）
				el.getBoundingClientRectAsync().then((rect : any) => {
					ctx.maskRect.left = rect.left
					ctx.maskRect.top = rect.top
					resolve()
				})
				return
			}
			uni.createSelectorQuery().in(ctx.ownerInstance).select('.lh-cap-click-mask').boundingClientRect().exec(ret => {
				const r = ret[0] as { left : number, top : number } | null
				if (r) {
					ctx.maskRect.left = r.left
					ctx.maskRect.top = r.top
				}
				resolve()
			})
		})
	}

	return { measureMask, onPieceLoad }
}
