<template>
	<view class="content">
		<sar-space direction="vertical">
			<sar-list card v-if="!isStarList && noticeDataList.length > 0">
				<sar-list-item arrow hover @click="toStarPage">
					<template #title>
						<sar-space align="center">
							<sar-avatar size="96rpx" background="var(--sar-warning)">
								<sar-icon name="StarOutlined" family="outlined" size="64rpx" color="#fff"/>
							</sar-avatar>
							<view>标星通知</view>
						</sar-space>
					</template>
				</sar-list-item>
			</sar-list>
			<!-- 消息列表 -->
			<notice-list :notice-data="noticeDataList" :load-status="status" @clickItem="handleClickItem" @clickStar="handleStar" ref="noticeListRef"/>
			<!-- 加载更多 -->
			<sar-load-more v-if="status === 'loading' || noticeDataList.length > 0" :status="status" @load-more="loadMore" @reload="reload"/>
		</sar-space>
	</view>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import NoticeList from '@/subpackages/system/notice/components/NoticeList.vue';
import {userMessageList, star, read} from '@/api/system/notice/Notice';
import type {SysUserNoticeVO} from "@/api/system/notice/type/SysUserNotice"
import type { SysNoticeDTO } from '@/api/system/notice/type/SysNotice';
import { onLoad, onReachBottom, onShow } from '@dcloudio/uni-app';
import { toast } from '@/utils/Toast';
import type { LoadMoreStatus } from 'sard-uniapp';
import { ResponseError } from '@/api/global/Type';
import router from "@/router/Router";
import {useNoticeStore} from "@/stores/notice"

const noticeStore = useNoticeStore()
const noticeListRef = ref<InstanceType<typeof NoticeList>>()
// 是否为star页面
const isStarList = ref<boolean>(false)
/**
 * 初始化加载列表
 */
const initList = () => {
	const status = ref<LoadMoreStatus>('incomplete')
	
	// 查询条件
	const query = ref<SysNoticeDTO>({pageNum: 1, pageSize: 10})
	
	// 列表数据
	const noticeDataList = ref<SysUserNoticeVO[]>([])
	
	// 加载更多
	const loadMore = () => {
		query.value.pageNum = query.value.pageNum + 1
		queryList()
	}
	
	// 重新加载
	const reload = () => {
		noticeDataList.value = []
		query.value.pageNum = 1
		queryList()
	}
	
	// 数据查询
	const queryList = async () => {
		status.value = "loading"
		try {
			// star 页面增加查询条件
			if (isStarList.value) {
				query.value.star = "1"
			}
			const resp = await userMessageList(query.value)
			if (resp.code === 200) {
				const records = resp.data.records
				
				// 向数组中添加元素
				noticeDataList.value.push(...records)
				
				// 判断是否全部加载完成
				if (noticeDataList.value.length >= resp.data.total) {
					status.value = "complete"
				} else {
					status.value = "incomplete"
				}
			}
		} catch(err) {
			if (err instanceof ResponseError) {
				toast((err as unknown as ResponseError).msg)
			} else {
				console.error(err)
			}
			status.value = "error"
		}
	}
	
	return {
		status,
		query,
		noticeDataList,
		reload,
		loadMore
	}
}

const {status, query, noticeDataList, reload, loadMore} = initList()

/**
 * 处理标星
 */
const handleStar = async (data: SysUserNoticeVO, index: number, hide: () => {}) => {
	if (data.noticeId && data.starFlag) {
		try {
			data.starFlag = data.starFlag === '0' ? '1' : '0'
			const resp = await star(data.noticeId, data.starFlag)
			if (resp.code === 200) {
				hide()
				// 处理关闭Swipe
				noticeListRef.value?.closeSwipe(index)
			} else {
				toast(resp.msg)
			}
		} catch(err) {
			if (err instanceof ResponseError) {
				toast((err as unknown as ResponseError).msg)
			} else {
				console.error(err)
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
		read(noticeId)
		.then(resp => {
			// 已读成功去掉红点
			if (resp.code === 200) {
				const item = noticeDataList.value.find(item => item.noticeId === noticeId)
				noticeStore.getUnreadCount()
				if (item) {
				  item.readFlag = "1"
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
 * 触底加载
 */
onReachBottom(() => {
	if (status.value === "incomplete") {
		loadMore()
	}
})

/**
 * 获取page中的参数
 */
onLoad((option) => {
	const type = option?.type
	// 从query中根据参数判断是否为star页面
	if (type === 'star') {
		initStarPage()
	}
})

/**
 * 显示页面时加载数据
 */
onShow(() => {
	reload()
	noticeStore.getUnreadCount()
})
</script>
