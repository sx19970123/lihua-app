<template>
	<view class="notice-page">
		<RefreshContent
			:down="{ use: true }"
			:up="{ use: true, auto: false }"
			:loading="!loaded"
			:empty="loaded && noticeDataList.length === 0"
			@init="onInit"
			@refresh="onRefresh"
			@load-more="onLoadMore"
		>
			<template #empty>
				<sar-empty :description="isStarList ? '暂无标星通知' : '暂无通知'"/>
			</template>

			<sar-space direction="vertical">
				<sar-list card v-if="!isStarList && noticeDataList.length > 0">
					<sar-list-item arrow hover @click="toStarPage">
						<template #title>
							<sar-space align="center">
								<sar-avatar size="96rpx" background="var(--sar-warning)">
									<sar-icon name="star" size="64rpx" color="#fff"/>
								</sar-avatar>
								<view>标星通知</view>
							</sar-space>
						</template>
					</sar-list-item>
				</sar-list>
				<!-- 消息列表 -->
				<notice-list :notice-data="noticeDataList" @clickItem="handleClickItem" @clickStar="handleStar"/>
			</sar-space>
		</RefreshContent>
	</view>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import NoticeList from '@/subpackages/system/notice/components/NoticeList.vue';
import RefreshContent from '@/components/refresh-content/index.vue';
import type { MescrollInstance } from '@/components/refresh-content/type';
import {userMessageList, star} from '@/api/system/notice/notice';
import type {SysUserNoticeVO} from "@/api/system/notice/type/sys-user-notice"
import type { SysNoticeDTO } from '@/api/system/notice/type/sys-notice';
import { onLoad } from '@dcloudio/uni-app';
import { toast } from '@/utils/toast';
import { ResponseError } from '@/api/global/type';
import router from "@/router/router";
import {useNoticeStore} from "@/stores/notice"

const noticeStore = useNoticeStore()

const PAGE_SIZE = 10

// 是否为star页面
const isStarList = ref<boolean>(false)

// 首屏是否加载完成（驱动 :loading 首屏占位与 :empty 空态）
const loaded = ref(false)

// 列表数据与当前页码（页码成功才推进，失败经 endErr 回退保证重试不跳页）
const noticeDataList = ref<SysUserNoticeVO[]>([])
const pageNum = ref(1)

/**
 * 组件初始化：转入首次刷新（静默加载，不走下拉动画）
 */
const onInit = (mescroll: MescrollInstance) => {
	onRefresh(mescroll)
}

/**
 * 下拉刷新（首次进入亦走此入口，同步未读数）
 */
const onRefresh = (mescroll: MescrollInstance) => {
	noticeStore.getUnreadCount()
	queryList(mescroll, 1)
}

/**
 * 上拉加载下一页
 */
const onLoadMore = (mescroll: MescrollInstance) => {
	queryList(mescroll, pageNum.value + 1)
}

/**
 * 数据查询：page 为本次请求页码
 */
const queryList = async (mescroll: MescrollInstance, page: number) => {
	const query: SysNoticeDTO = {pageNum: page, pageSize: PAGE_SIZE}
	// star 页面增加查询条件
	if (isStarList.value) {
		query.star = "1"
	}
	try {
		const resp = await userMessageList(query)
		if (resp.code === 200) {
			const records = resp.data.records
			pageNum.value = page
			noticeDataList.value = page === 1 ? records : noticeDataList.value.concat(records)
			loaded.value = true
			mescroll.endSuccess(records.length, noticeDataList.value.length < resp.data.total)
		} else {
			mescroll.endErr()
			toast(resp.msg)
		}
	} catch (err) {
		mescroll.endErr()
		if (err instanceof ResponseError) {
			toast(err.msg)
		} else {
			toast("加载失败")
		}
	}
}

/**
 * 处理标星
 */
const handleStar = async (data: SysUserNoticeVO, index: number, hide: () => {}) => {
	if (data.noticeId && data.starFlag) {
		// 乐观更新：先翻转本地状态，请求失败时回滚
		const prevStarFlag = data.starFlag
    data.starFlag = data.starFlag === '0' ? '1' : '0'
    try {
      const resp = await star(data.noticeId, data.starFlag)
      if (resp.code === 200) {
        hide()
        // star页面记录操作数据
        if (isStarList.value) {
          uni.$emit("changeNoticeMeta", data)
        }
      } else {
        data.starFlag = prevStarFlag
        toast(resp.msg)
      }
    } catch (err) {
      data.starFlag = prevStarFlag
      if (err instanceof ResponseError) {
        toast(err.msg)
      } else {
        toast("标星失败")
      }
    }
	}
}

/**
 * 处理已读
 */
const handleRead = (noticeId: string, readFlag?: string) => {
	// 未读时发送已读标记
	if (readFlag === "0") {
		noticeStore.markAsRead(noticeId)
		.then((resp) => {
			if (resp.code === 200) {
				const item = noticeDataList.value.find(item => item.noticeId === noticeId)
				if (item) {
				  item.readFlag = "1"
				}
				// star页面记录操作数据
				if (isStarList.value && item) {
					uni.$emit("changeNoticeMeta", item)
				}
			} else {
				toast(resp.msg)
			}
		})
		.catch(err => {
			if (err instanceof ResponseError) {
				toast(err.msg)
			} else {
				console.error(err)
			}
		})
	}
}

// star页面点击已读｜标星操作
const handelChangeNoticeMeta = (data: SysUserNoticeVO) => {
	const item = noticeDataList.value.find(item => item.noticeId === data.noticeId)
	if (item) {
		item.starFlag = data.starFlag
		item.readFlag = data.readFlag
	}
}

/**
 * 处理点击消息
 */
const handleClickItem = (data: SysUserNoticeVO) => {
	const noticeId = data.noticeId
	if (!noticeId) {
		toast("参数错误")
		return
	}
	// 处理已读
	handleRead(noticeId, data.readFlag)
	// 跳转到详情页
	router.navigateTo({
		url: "/subpackages/system/notice/Detail",
		query: {
			id: noticeId,
			title: data.title
		}
	})
}

/**
 * 前往star页面
 * 其实是跳转本页面，携带参数进行判断
 */
const toStarPage = () => {
	router.navigateTo({
		url: "/subpackages/system/notice/index",
		query: {
			type: "star"
		}
	})
}

/**
 * 针对star页面的初始化
 */
const initStarPage = () => {
	isStarList.value = true
	uni.setNavigationBarTitle({
		title: "标星通知"
	})
}

/**
 * 获取page中的参数
 */
onLoad((option) => {
	const type = option?.type
	// 从query中根据参数判断是否为star页面
	if (type === 'star') {
		initStarPage()
	} else {
		// 非star页面，监听 changeNoticeMeta 事件
		uni.$on('changeNoticeMeta', handelChangeNoticeMeta)
	}
})

/**
 * 退出通知公告后关闭监听
 */
onUnmounted(() => {
	if (!isStarList.value) {
		uni.$off('changeNoticeMeta', handelChangeNoticeMeta)
	}
})

</script>

<style scoped lang="scss">
/* 文档地板：吸收 absolute 定位下拉指示器的溢出（RefreshContent 样式契约）；
   必须 height 而非 min-height——组件根 min-height:100% 需父级确定高度才可解析，
   否则列表不满屏时组件根只有内容高，下方空白区域无下拉手势；
   padding 对齐全局 .content 惯例，border-box 保证 100vh 不因 padding 溢出 */
.notice-page {
	box-sizing: border-box;
	height: 100vh;
	padding: 16rpx;
}
</style>
