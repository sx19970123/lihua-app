<template>
	<view class="content">
		<sar-space direction="vertical">
			<sar-list card>
				<sar-list-item arrow hover>
					<template #title>
						<sar-space align="center">
							<sar-avatar size="96rpx" background="var(--sar-primary)">
								<sar-icon name="StarOutlined" family="outlined" size="64rpx" color="#fff"/>
							</sar-avatar>
							<view>标星通知</view>
						</sar-space>
					</template>
				</sar-list-item>
			</sar-list>
			<sar-list card>
				<sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item>
				
				
				
				<sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item><sar-list-item style="padding: 1px 0 0 0">
					<sar-swipe-action @update:visible="(value: 'left' | 'right' | false) => handleVisible(value, 1)">
						<sar-list-item arrow hover>
							<template #title>
								<sar-space align="center">
									<sar-avatar size="96rpx" background="var(--sar-primary)">
										<sar-icon name="SoundOutlined" family="outlined" size="64rpx" color="#fff"/>
									</sar-avatar>
									<sar-space direction="vertical" size="small">
										<view style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 50vw;">系统公告系统公告系统公告系统公告系统公告</view>
										<sar-space style="font-size: var(--sar-text-sm); color: var(--sar-secondary);">
											<view>admin</view>
											<view>2015-11-23 23:23:12</view>
										</sar-space>
									</sar-space>
								</sar-space>
							</template>
							<template #value>
								<dict-tag dict-data-value="1" :dict-data-option="sys_notice_priority"></dict-tag>
							</template>
						</sar-list-item>
						<template #right="{ hide }">
							<sar-button
						            theme="danger"
						            square
						            inline
						            style="height: 100%"
							>
						            删除
							</sar-button>
						</template>
					</sar-swipe-action>
				</sar-list-item>
			</sar-list>
		</sar-space>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {initDict} from '@/utils/dict'
import DictTag from "@/components/dict-tag/index.vue"
import { nextTick } from 'vue';
const {sys_notice_priority} = initDict('sys_notice_priority')
const current = ref<string>("0")

const handleVisible = (value: 'left' | 'right' | false, index: number) => {
	console.log("val", value);
}


</script>
