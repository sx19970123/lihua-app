import { defineStore } from "pinia";
import { UserInfoType } from "@/api/system/auth/type/AuthInfoType";
import { SysRole } from "@/api/system/role/type/SysRole";
import { SysDept } from "@/api/system/dept/type/SysDept";
import { SysPost } from "@/api/system/post/type/SysPost";
import { AvatarType } from "@/api/system/profile/type/AvatarType";
import {rasEncryptPassword} from "@/utils/Crypto.ts";
import { login } from "@/api/system/login/Login";
import { setToken } from "@/utils/Token.ts";
import { ResponseError } from "@/api/global/Type";

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
		async login(username: string, password: string, captchaVerification: string) {
			// 对密码进行加密处理，获取密文和requestKey
			const {ciphertext, requestKey} = await rasEncryptPassword(password)
			// 调用登录接口
			const resp = await login({username, password: ciphertext, captchaVerification, requestKey})
			// 登录成功，设置Token
			if (resp.code === 200) {
				setToken(resp.data)
				return resp
			}
			// 否则抛出异常
			throw new ResponseError(resp.code, resp.msg);
		}
	}
})