/**
 * 文本头像背景色板（color-select 组件数据源，修改头像页与组件演示页共用）
 */
export interface AvatarColorOption {
	name: string
	color: string
	key: string
}

export const AVATAR_COLOR_SOURCE: AvatarColorOption[] = [
	{
		name: '拂晓蓝',
		color: 'rgb(22, 119, 255)',
		key: '1'
	},
	{
		name: '薄暮',
		color: 'rgb(245, 34, 45)',
		key: '2'
	},
	{
		name: '火山',
		color: 'rgb(250, 84, 28)',
		key: '3'
	},
	{
		name: '日暮',
		color: 'rgb(250, 173, 20)',
		key: '4'
	},
	{
		name: '明青',
		color: 'rgb(19, 194, 194)',
		key: '5'
	},
	{
		name: '极光绿',
		color: 'rgb(82, 196, 26)',
		key: '6'
	},
	{
		name: '极客蓝',
		color: 'rgb(47, 84, 235)',
		key: '7'
	},
	{
		name: '酱紫',
		color: 'rgb(114, 46, 209)',
		key: '8'
	}
]

/**
 * 色板首色：Web 端存量头像的 conic-gradient 渐变背景在 App 端的降级替换色
 */
export const AVATAR_DEFAULT_COLOR = AVATAR_COLOR_SOURCE[0].color
