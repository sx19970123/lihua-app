// 验证码·流程：取码与滑切换码、校验提交与结果编排、刷新
import { nextTick } from 'vue'
import { getCaptchaData, check } from '@/api/system/captcha/captcha'
import type { CaptchaRequestData } from '@/api/system/captcha/type/captcha-type'
import type { CaptchaContext } from './captcha-context'

export type CaptchaFlow = {
	// slide=true 走滑切流：旧内容右滑出与请求并行 → 换数据（:key 重建容器）→ 新内容从左滑入；false 走全卡 loading
	getCaptcha : (slide ?: boolean) => Promise<void>
	// 提交校验并编排结果：成功先出结果态再带 id 关闭，失败停留后刷新重取
	submitCaptcha : (id : string, data : CaptchaRequestData['data'], durationMs : number, isPow : boolean) => void
	// 刷新：清掉在途任务；已有内容时走滑切流，首开/错误重试走全卡 loading
	refresh : (isClose : boolean) => void
}

export const createCaptchaFlow = (ctx : CaptchaContext) : CaptchaFlow => {
	const sleep = (ms : number) : Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

	// slide=true 走滑切流：旧内容右滑出与请求并行 → 换数据（:key 重建容器）→ 新内容从左滑入
	const getCaptcha = async (slide : boolean = false) => {
		const prevHeight = (ctx.captchaLoading.value || ctx.loadingError.value) ? 298 : (ctx.type.value === 'POW' ? 136 : 298)
		ctx.optsHold.value = true
		if (slide) {
			ctx.slidePhase.value = 'out'
			ctx.platform.slideOut()
			// 新容器以无动画 class 出生（渲染稳定后滑切尾再放行）
			ctx.contentAnim.value = false
		} else {
			ctx.captchaLoading.value = true
		}
		ctx.loadingError.value = undefined
		try {
			const job = getCaptchaData()
			let resp
			if (slide) {
				// 滑出动画（300ms）与请求竞速：响应先到=无 loading；滑出先完成=waiting 相位显示 loading
				const slideDone = sleep(300)
				const first = await Promise.race([job.then(() => 'job'), slideDone.then(() => 'slide')])
				if (first === 'slide') {
					ctx.slidePhase.value = 'waiting'
					await slideDone
				} else {
					await slideDone
				}
				resp = await job
			} else {
				resp = await job
			}
			if (resp.code !== 200 || !resp.data) {
				throw new Error(`code=${resp.code}`)
			}
			const d = resp.data
			// POW↔图形跨高：高度动画在空窗期独占播放（a/b 交替 class），播完摘除；滑入期间 card 须无活跃 animation
			const targetHeight = (d.type === 'POW') ? 136 : 298
			const crossHeight = slide && targetHeight !== prevHeight
			if (crossHeight) {
				ctx.heightFlip.value = !ctx.heightFlip.value
				ctx.heightAnim.value = targetHeight > prevHeight
					? (ctx.heightFlip.value ? 'lh-cap-h-grow-a' : 'lh-cap-h-grow-b')
					: (ctx.heightFlip.value ? 'lh-cap-h-shrink-a' : 'lh-cap-h-shrink-b')
				await sleep(120)
			}
			// 赋值前切 in：容器首渲染即 prep 左外态，统一左滑入场
			ctx.slidePhase.value = 'in'
			ctx.type.value = d.type
			if (crossHeight) {
				await nextTick()
				ctx.heightAnim.value = ''
			}
			ctx.captchaId.value = d.id
			ctx.backgroundImage.value = d.backgroundImage ?? ''
			ctx.sliderImage.value = d.templateImage ?? ''
			ctx.powParam.value = d.type === 'POW' ? d.data?.POW : undefined
			// CONCAT 窗口高 =（原图高 - randomY）/ 原图高 × 图区高
			if (d.type === 'CONCAT' && d.backgroundImageHeight && d.data?.randomY != null) {
				ctx.concatHeight.value = Math.round((d.backgroundImageHeight - d.data.randomY) / d.backgroundImageHeight * ctx.IMAGE_HEIGHT)
			} else {
				ctx.concatHeight.value = 0
			}
			ctx.pieceWidth.value = d.templateImageWidth && d.templateImageHeight
				? Math.round(ctx.IMAGE_HEIGHT * d.templateImageWidth / d.templateImageHeight) : 0
			ctx.startTime.value = Date.now()
			ctx.trackArr.value = []
			ctx.clickCount.value = 0
			ctx.dragX.value = 0
			ctx.powX.value = 0
			ctx.powPhase.value = 'slide'
			ctx.powProgress.value = 0
			ctx.powShowProgress.value = false
			ctx.showResult.value = false
			ctx.resultOk.value = false
			ctx.resultMsg.value = ''
			ctx.powFailMsg.value = '验证失败，请重试'
			ctx.verifying.value = false
		} catch (err) {
			console.error('验证码取码失败', err)
			ctx.loadingError.value = '验证码加载失败'
		} finally {
			ctx.captchaLoading.value = false
		}
		// 同类型刷新时轨道节点不重建，直驱位移显式归位
		ctx.drag.resetVisual()
		if (slide) {
			// 失败直接回 idle 露错误态（error 分支替换容器，无过渡残留）
			if (ctx.loadingError.value) {
				ctx.slidePhase.value = 'idle'
				return
			}
			// 滑入：容器以静态起点渲染稳定后，再挂动画 class 播放；idle 沿用不摘（forwards 终态 0）。勿换 requestAnimationFrame
			if (ctx.platform.delaysSlideIn()) {
				await nextTick()
				await sleep(32)
				ctx.contentAnim.value = true
			}
			ctx.slidePhase.value = 'idle'
			await sleep(300)
			ctx.optsHold.value = false
			// 点选：滑入静止后量蒙层（动画中量绝对坐标带偏移必错）
			if (ctx.type.value === 'WORD_IMAGE_CLICK') {
				await nextTick()
				await ctx.measure.measureMask()
			}
			return
		}
		// 打开流：内容左滑入场，静止后补点选量测
		if (!ctx.loadingError.value) {
			// 滑入：容器以静态起点渲染稳定后，再挂动画 class 播放；idle 沿用不摘（forwards 终态 0）。勿换 requestAnimationFrame
			if (ctx.platform.delaysSlideIn()) {
				await nextTick()
				await sleep(32)
				ctx.contentAnim.value = true
			}
			ctx.slidePhase.value = 'idle'
			await sleep(300)
			ctx.optsHold.value = false
		}
		// 点选：内容渲染完成后量蒙层绝对位置（轨迹换算基准），失败按 0 兜底（轨迹偏移可容忍一次刷新）
		if (!ctx.loadingError.value && ctx.type.value === 'WORD_IMAGE_CLICK') {
			await nextTick()
			await ctx.measure.measureMask()
		}
	}

	const submitCaptcha = (id : string, data : CaptchaRequestData['data'], durationMs : number, isPow : boolean) => {
		ctx.verifying.value = true
		check({ id, data }).then(resp => {
			if (resp.code === 200 && resp.success) {
				if (isPow) {
					ctx.powSuccessMsg.value = `验证成功，耗时${(durationMs / 1000).toFixed(1)}秒`
					ctx.powPhase.value = 'success'
					// 驻留 1000ms 后关闭（各类型一致）
					ctx.verifyTimer = setTimeout(() => {
						ctx.verifyTimer = undefined
						ctx.card.close(resp.data?.id ?? id)
					}, 1000)
				} else {
					ctx.showResult.value = true
					ctx.resultOk.value = true
					ctx.resultMsg.value = `验证成功，耗时${(durationMs / 1000).toFixed(1)}秒`
					// 驻留 1000ms 后关闭（各类型一致）
					ctx.verifyTimer = setTimeout(() => {
						ctx.verifyTimer = undefined
						ctx.card.close(resp.data?.id ?? id)
					}, 1000)
				}
			} else {
				const msg = resp.code === 4001 ? '验证失败，请重新尝试！' : resp.code === 4000 ? '验证码被黑洞吸走了！' : resp.msg
				if (isPow) {
					ctx.powFailMsg.value = msg ?? '验证失败，请重试'
					ctx.powPhase.value = 'fail'
					// 驻留 1200ms 后刷新（各类型一致；短文案可读的下限）
					ctx.verifyTimer = setTimeout(() => {
						ctx.verifyTimer = undefined
						refresh(false)
					}, 1200)
				} else {
					ctx.showResult.value = true
					ctx.resultOk.value = false
					ctx.resultMsg.value = msg ?? '验证失败'
					// 驻留 1200ms 后刷新（各类型一致；短文案可读的下限）
					ctx.verifyTimer = setTimeout(() => {
						ctx.verifyTimer = undefined
						refresh(false)
					}, 1200)
				}
			}
		}).catch(err => {
			console.error(err)
			ctx.verifying.value = false
			refresh(false)
		})
	}

	const refresh = (isClose : boolean) => {
		ctx.card.stopJobs()
		ctx.verifying.value = false
		// 视觉态不清：失败红态保持滑出，由 getCaptcha 换码赋值段统一清；
		// 切换动画进行中不重入；已有内容时走滑切流，首开/错误重试走全卡 loading
		if (!isClose && !ctx.captchaLoading.value && ctx.slidePhase.value === 'idle') {
			getCaptcha(ctx.type.value !== undefined && !ctx.loadingError.value)
		}
	}

	return { getCaptcha, submitCaptcha, refresh }
}
