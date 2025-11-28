import request from "@/utils/Request";
import type {SysDept} from "@/api/system/dept/type/SysDept";

/**
 * 保存基础信息
 */
export const saveBasics = (userInfo: {avatar?: string,nickname?: string,gender?:string,email?:string,phoneNumber?:string}) => {
    return request({
        url: 'app/system/profile/basics',
        data: userInfo,
        method: 'POST'
    })
}

/**
 * 修改密码
 */
export const updatePassword = (oldPassword: string,
                               oldPasswordRequestKey: string,
                               newPassword: string,
                               newPasswordRequestKey: string,
                               confirmPassword: string,
                               confirmPasswordRequestKey: string
                               ) => {
    return request<string>({
        url: 'app/system/profile/password',
        data: {
            oldPassword,
            oldPasswordRequestKey,
            newPassword,
            newPasswordRequestKey,
            confirmPassword,
            confirmPasswordRequestKey
        },
        method: 'POST'
    })
}

/**
 * 设置默认部门
 */
export const setDefaultDept = (deptId: string) => {
    return request<SysDept>({
        url: 'app/system/profile/default/' + deptId,
        method: 'POST',
    })
}

/**
 * 用户注销
 */
export const accountDeactivate = () => {
	return request<string>({
		url: 'app/system/profile/deactivate',
		method: "DELETE"
	})
}

/**
 * 检查密码
 */
export const checkPassword = (password: string, passwordRequestKey: string) => {
	return request<boolean>({
		url: 'app/system/profile/checkPassword',
		method: "POST",
		data: {
			password,
			passwordRequestKey
		}
	})
}