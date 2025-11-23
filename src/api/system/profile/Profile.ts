import request from "@/utils/Request.ts";
import type {SysDept} from "@/api/system/dept/type/SysDept.ts";

/**
 * 保存基础信息
 */
export const saveBasics = (userInfo: {avatar?: string,nickname?: string,gender?:string,email?:string,phoneNumber?:string}) => {
    return request({
        url: '/system/profile/basics',
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
        url: '/system/profile/password',
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
        url: 'system/profile/default/' + deptId,
        method: 'POST',
    })
}