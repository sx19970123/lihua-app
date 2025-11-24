import { defineStore } from "pinia";
import type { AuthInfoType, UserInfoType } from "@/api/system/auth/type/AuthInfoType";
import type { SysRole } from "@/api/system/role/type/SysRole";
import type { SysDept } from "@/api/system/dept/type/SysDept";
import type { SysPost } from "@/api/system/post/type/SysPost";
import type { AvatarType } from "@/api/system/profile/type/AvatarType";
import {rasEncryptPassword} from "@/utils/Crypto";
import { login, logout } from "@/api/system/login/Login";
import { setToken, removeToken } from "@/utils/Token";
import { queryAuthInfo } from "@/api/system/auth/Auth";
import {publicAttachmentDownload} from "@/api/system/attachment/AttachmentStorage";
import {ResponseError, type ResponseType} from "@/api/global/Type";
import {toast} from '@/utils/Toast';
import router from "@/router/Router";
import { updatePassword } from "@/api/system/profile/Profile";


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
			defaultDeptPosts
		}
	},
	actions: {
		/**
		 * 账号密码登录
		 */
		async login(username: string, password: string, captchaVerification?: string) {
			// 对密码进行加密处理，获取密文和requestKey
			const {ciphertext, requestKey} = await rasEncryptPassword(password)
			// 调用登录接口
			const resp = await login({username, password: ciphertext, captchaVerification, requestKey})
			// 登录成功，设置Token
			if (resp.code === 200) {
				setToken(resp.data)
			}
			return resp
		},
		/**
		 * 退出登录
		 */
		async handleLogout() {
			try {
				await logout()
			} catch(err) {
				console.error(err)
			} finally {
				this.authenticationFailure()
			}
		},
		 // 修改密码
		async updatePassword({oldPassword, newPassword, confirmPassword}: {oldPassword: string, newPassword: string, confirmPassword: string}): Promise<ResponseType<string>> {
			return new Promise(async (resolve, reject) => {
				try {
					// 对旧密码进行加密处理
					const oldPasswordEncrypt = await rasEncryptPassword(oldPassword)
					// 对新密码进行加密处理
					const newPasswordEncrypt = await rasEncryptPassword(newPassword)
					// 对确认密码进行加密处理
					const confirmPasswordEncrypt = await rasEncryptPassword(confirmPassword)

					// 更新密码
					const resp = await updatePassword(
						oldPasswordEncrypt.ciphertext,
						oldPasswordEncrypt.requestKey,
						newPasswordEncrypt.ciphertext,
						newPasswordEncrypt.requestKey,
						confirmPasswordEncrypt.ciphertext,
						confirmPasswordEncrypt.requestKey)
					if (resp.code === 200) {
						resolve(resp)
					} else {
						reject(new ResponseError(resp.code, resp.msg))
					}
				} catch (error) {
					reject(error)
				}
			})
		},
		/**
		 * 认证失效
		 */
		authenticationFailure() {
			removeToken()
			this.clearUserInfo()
			router.reLaunch({
				url: "/pages/login/Login"
			})
		},
		/**
		 * 初始化用户信息
		 */
		initUserInfo(): Promise<ResponseType<AuthInfoType>> {
			return new Promise((resolve, reject) => {
				queryAuthInfo().then((resp) => {
					if (resp.code === 200) {
						const data = resp.data
						const state = this.$state

						// 用户相关赋值
						state.userInfo = data.userInfo
						state.userId = data.userInfo.id ? data.userInfo.id : ''
						state.nickname = data.userInfo.nickname ? data.userInfo.nickname : ''
						state.username = data.userInfo.username ? data.userInfo.username : ''
						state.avatar = data.userInfo.avatar ? JSON.parse(data.userInfo.avatar) : this.getDefaultAvatar()

						// 角色权限相关赋值
						state.roles = data.roles
						state.roleCodes = data.roles.filter(role => role.code).map(role => role.code) as string[]
						state.permissions = data.permissions

						// 部门相关赋值
						state.deptTrees = data.depts
						state.defaultDept = data.defaultDept
						state.defaultDeptName = data.defaultDept.name ? data.defaultDept.name : ''
						state.defaultDeptCode = data.defaultDept.code ? data.defaultDept.code : ''

						// 岗位相关赋值
						state.posts = data.posts
						state.defaultDeptPosts = data.posts.filter(post => post.deptCode === state.defaultDeptCode)

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
		handleAvatar() {
			const avatar = this.$state.avatar
			if (avatar.type === 'image') {
				// 当头像类型为 image 但 image不存在时，赋值默认头像
				if (avatar.value) {
					publicAttachmentDownload(avatar.value).then((resp: ArrayBuffer) => {
						// 将头像转为base64
						avatar.url = 'data:image/png;base64,' + uni.arrayBufferToBase64(resp)
					}).catch((e) => {
						if (e instanceof ResponseError) {
							toast(e.msg)
						} else {
							console.error(e)
						}
						this.$state.avatar = this.getDefaultAvatar()
					})
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