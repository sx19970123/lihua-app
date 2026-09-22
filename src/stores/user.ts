import { defineStore } from "pinia";
import type { AuthInfoType, UserInfoType } from "@/api/system/profile/type/auth-info-type";
import type { SysRole } from "@/api/system/role/type/sys-role";
import type { SysDept } from "@/api/system/dept/type/sys-dept";
import type { SysPost } from "@/api/system/post/type/sys-post";
import type { AvatarType } from "@/api/system/profile/type/avatar-type";
import { logout } from "@/api/system/authentication/authentication";
import { removeToken } from "@/helpers/token";
import { queryAuthInfo } from "@/api/system/profile/profile";
import {ResponseError, type ResponseType} from "@/api/global/type";
import {getFileTempPath} from "@/utils/attachment/attachment-utils";
import {resolveAttachmentEntryUrl} from "@/api/system/attachment/attachment-storage";
import { setDefaultDept } from "@/api/system/profile/profile";
import { webSocket } from '@/utils/web-socket'

// 用户信息初始化在途请求（非响应式）：路由守卫每次导航都可能触发，去重防止冷启动连续导航并发重复请求
let initUserInfoPromise: Promise<ResponseType<AuthInfoType>> | null = null

export const useUserStore = defineStore('user', {
	state: () => {
		// 用户相关数据
		const userInfo: UserInfoType = {}
		const userId: string = ''
		const nickname: string = ''
		const username: string = ''
		const avatar: AvatarType = {}

		// 角色权限相关数据
		const roles: SysRole[] = []
		const roleCodes: string[] = []
		const permissions: string[] = []
		
		// 部门相关数据
		const deptTrees:SysDept[] = []
		const defaultDept: SysDept = {}
		const defaultDeptName: string = ''
		const defaultDeptCode: string = ''
		
		// 岗位相关数据
		const posts: SysPost[] = []
		const defaultDeptPosts: SysPost[] = []
		// 权限数据已变更标志（tabBar/头像红点数据源）：登录/静默刷新后由 info 重算，WS 推送在线即时置位
		const permissionUpdate: boolean = false
		
		return {
			userInfo,
			userId,
			nickname,
			username,
			avatar,
			roles,
			roleCodes,
			permissions,
			deptTrees,
			defaultDept,
			defaultDeptName,
			defaultDeptCode,
			posts,
			defaultDeptPosts,
			permissionUpdate
		}
	},
	actions: {
		/**
		 * 退出登录
		 */
		async handleLogout() {
			try {
				await logout()
			} catch (err) {
				// 401 已由请求拦截器完成清态+重登跳转（登录页外的 401 拦截器必处理），再调一次会双 reLaunch 竞争
				if (err instanceof ResponseError && err.code === 401) {
					return
				}
				console.error("退出登录失败，本地登出兜底", err)
			}
			this.authenticationFailure()
		},
		/**
		 * 认证失效
		 */
		authenticationFailure() {
			removeToken()
			this.clearUserInfo()
			webSocket.closeConnect()
			uni.reLaunch({
				url: "/pages/login/Login"
			})
		},
		/**
		 * 初始化用户信息（在途去重：并发调用复用同一请求，终态后清除允许重试）
		 */
		initUserInfo(): Promise<ResponseType<AuthInfoType>> {
			if (initUserInfoPromise) {
				return initUserInfoPromise
			}
			const request = new Promise<ResponseType<AuthInfoType>>((resolve, reject) => {
				queryAuthInfo().then((resp) => {
					if (resp.code === 200) {
						const data = resp.data
						const state = this.$state

						// 用户相关赋值
						state.userInfo = data.userInfo
						state.userId = data.userInfo.id ? data.userInfo.id : ''
						state.nickname = data.userInfo.nickname ? data.userInfo.nickname : ''
						state.username = data.userInfo.username ? data.userInfo.username : ''
						// avatar 为 JSON 字符串，脏数据降级默认头像，不阻断整个初始化
						try {
							state.avatar = data.userInfo.avatar ? JSON.parse(data.userInfo.avatar) : this.getDefaultAvatar()
						} catch {
							state.avatar = this.getDefaultAvatar()
						}

						// 角色权限相关赋值（后端集合字段无空值兜底，null 时降级空集合防止初始化抛错）
						state.roles = data.roles ?? []
						state.roleCodes = state.roles.map(role => role.code).filter((code): code is string => !!code)
						state.permissions = data.permissions ?? []

						// 部门相关赋值
						state.deptTrees = data.depts ?? []
						state.defaultDept = data.defaultDept
						state.defaultDeptName = data.defaultDept?.name || ''
						state.defaultDeptCode = data.defaultDept?.code || ''

						// 岗位相关赋值
						state.posts = data.posts ?? []
						state.defaultDeptPosts = data.posts.filter(post => post.deptCode === state.defaultDeptCode)

						// 权限数据已变更标志（红点数据源）：服务端标记比对结果
						state.permissionUpdate = data.permissionUpdate ?? false

						// 处理头像
						this.handleAvatar()
						resolve(resp)
					} else {
						reject(new ResponseError(resp.code,resp.msg))
					}
				}).catch(err => {
					reject(err)
				})
			})
			initUserInfoPromise = request
			// 终态清除在途标记（失败后下次导航可重试）；本链吞掉 rejection，失败由调用方处理
			request.finally(() => {
				initUserInfoPromise = null
			}).catch(() => undefined)
			return request
		},
		/**
		 * 更新默认部门
		 */
		async updateDefaultDept(defaultDept: SysDept) {
			return new Promise(async (resolve, reject) => {
				if (defaultDept.id) {
					try {
						const resp = await setDefaultDept(defaultDept.id)
						if (resp.code === 200) {
							const state = this.$state
							state.defaultDept = defaultDept
							state.defaultDeptName = defaultDept.name ? defaultDept.name : ''
							state.defaultDeptCode = defaultDept.code ? defaultDept.code : ''
							// 更新默认部门后更新部门下岗位
							state.defaultDeptPosts = state.posts.filter(post => post.deptCode === state.defaultDeptCode)
							resolve(resp)
						} else {
							reject(new ResponseError(resp.code,resp.msg))
						}
					} catch(err) {
						console.error(err)
						reject(err)
					}
				} else {
					reject()
				}
			})
		},
		/**
		 * 清空用户信息
		 */
		clearUserInfo() {
			const userState = this.$state

			// 用户相关赋值
			userState.userInfo = {}
			userState.userId = ''
			userState.nickname = ''
			userState.username = ''
			userState.avatar = this.getDefaultAvatar()

			// 角色权限相关赋值
			userState.roles = []
			userState.roleCodes = []
			userState.permissions = []

			// 部门相关赋值
			userState.deptTrees = []
			userState.defaultDept = {}
			userState.defaultDeptName = ''
			userState.defaultDeptCode = ''

			// 岗位相关赋值
			userState.posts = []
			userState.defaultDeptPosts = []
		},
		/**
		 * 处理头像
		 */
		async handleAvatar() {
			const avatar = this.$state.avatar
			if (avatar.type === 'image') {
				// 当头像类型为 image 但 image不存在时，赋值默认头像
				if (avatar.value) {
					// 后端下发前已把头像 value 换算为完整访问链，这里仅补网关前缀并下载临时文件
					avatar.url = await getFileTempPath(resolveAttachmentEntryUrl(avatar.value))
				} else {
					this.$state.avatar = this.getDefaultAvatar()
				}
			}
		},
		/**
		 * 默认头像
		 */
		getDefaultAvatar() {
			return {type: 'text', backgroundColor: 'rgb(191, 191, 191)', value: 'lihua', url: ''}
		}
	}
})