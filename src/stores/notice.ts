import { defineStore } from 'pinia'
import { queryUnReadCount } from '@/api/system/notice/notice'
import {read} from '@/api/system/notice/notice'
import type {PreviewNotice} from '@/api/system/notice/type/preview-notice'
import { preview } from '@/api/system/notice/notice'
import {ResponseError, type ResponseType} from '@/api/global/type'
import dayjs from 'dayjs'
import { setNoticeRedDotSource } from '@/helpers/tabbar-red-dot'


/**
 * 消息通知
 */
export const useNoticeStore = defineStore('notice', {
	state: () => {
		// 未读数量
		const unreadCount: number = 0
		// 已经显示tabbar红点
		const isShowTabBarRedDot: boolean = false
		return {
			unreadCount,
			isShowTabBarRedDot
		}
	},
	actions: {
		// 获取未读数量（红点数据尽力更新：失败保持现值不向调用方抛错；unreadCount 变化由 App 级 watch 驱动红点）
		async getUnreadCount(): Promise<number> {
			try {
				const resp = await queryUnReadCount()
				if (resp.code === 200) {
					this.unreadCount = resp.data
				} else {
					console.error("获取未读数量失败", resp.msg)
				}
			} catch (err) {
				console.error("获取未读数量失败", err)
			}
			return this.unreadCount
		},
		// 预览
		previewNotice(noticeId: string): Promise<PreviewNotice> {
			return new Promise((resolve, reject) => {
				preview(noticeId).then((resp) => {
					if (resp.code === 200) {
						const data = resp.data
						resolve({
							title: data.title,
							content: data.content,
							releaseUser: data.releaseUser,
							releaseTime: dayjs(data.releaseTime).format('YYYY-MM-DD HH:mm')
						})
					} else {
						// 统一 reject ResponseError，消费方可经 instanceof / toastRequestError 取真实 msg
						reject(new ResponseError(resp.code, resp.msg))
					}
				}).catch(err => reject(err))
			})
		},
		// 标记为已读，并重新查询未读数量（红点更新由 unreadCount 变化驱动）
		markAsRead(noticeId: string): Promise<ResponseType<string>> {
			return new Promise((resolve, reject) => {
				read(noticeId).then((resp) => {
					this.getUnreadCount()
					resolve(resp)
				}).catch(err => reject(err))
			})
		},
		// 处理底部导航栏红点（通知来源；槽位与权限待更新红点共享，亮/灭统一经 tabbar-red-dot 收敛判定，
		// 该 API 仅 tabbar 页面生效，切回页面由 AppRoot onShow 重设）
		setTabbarRedDot() {
			setNoticeRedDotSource(this.unreadCount > 0)
			this.isShowTabBarRedDot = this.unreadCount > 0
		}
	}
})
