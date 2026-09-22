import type {NoticeMessage} from '@/api/system/notice/type/notice-message'

// #ifdef APP-PLUS
import router from '@/router/router'
import MessageNotify from '@/utils/message-notify'
import { initDict, getDictLabel } from '@/helpers/dict'
import { useNoticeStore } from '@/stores/notice'
import { useRootRefStore } from '@/stores/root'
// #endif

/**
 * WS_NOTICE 推送的原生横幅编排：弹横幅、点击进详情并标记已读、下滑打开轻量抽屉。
 * 平台分叉在函数体内条件编译——仅原生 APP 有实际逻辑，其余平台编译为空实现，调用点无需条件编译。
 */
export const showNoticePush = (data: NoticeMessage) => {
	// #ifdef APP-PLUS
	const noticeStore = useNoticeStore()
	const rootRefStore = useRootRefStore()
	// 消息/公告标识
	const pngName = data.type === '0' ? 'MessageOutlined.png' : 'NotificationOutlined.png'
	// 获取字典
	const {sys_notice_type} = initDict("sys_notice_type")
	// 全局消息提醒
	MessageNotify.show({title: '收到一条新' + getDictLabel(sys_notice_type.value, data.type), content: data.title, image: '_www/static/notice/' + pngName}, () => {
		// 跳转到详情页
		router.navigateTo({
			url: "/subpackages/system/notice/Detail",
			query: {
				id: data.id,
				title: data.title
			},
			success: () => noticeStore.markAsRead(data.id).catch((err) => console.error("标记已读失败", err))
		})
	}, (direction) => {
		// 向下拖动打开抽屉预览，以根节点为媒介，拿到保存到rootStore中的根节点实例，调用通知方法
		if (direction === 'bottom') {
			const ref = rootRefStore.getRootRef()
			if (ref && ref.showNoticeLite) {
				ref.showNoticeLite(data.id)
			}
			// 向下拖动需要手动关闭通知
			MessageNotify.hide()
		}
	})
	// #endif
}
