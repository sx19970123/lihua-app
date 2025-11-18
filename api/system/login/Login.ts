import request from "@/utils/Request.ts";
import type { LoginType } from "@/api/system/login/type/LoginType"; 
import type { RegisterType } from "@/api/system/login/type/RegisterType"; 

// 用户登录
export const login = (data: LoginType) => {
    return request<string>({
        url: '/system/login',
        method: 'POST',
        data: data
    })
}

// 退出登录
export const logout = () => {
    return request({
        url: "/logout",
        method: 'POST'
    })
}

// 是否开启用户注册功能
export const enableRegister = () => {
    return request<boolean>({
        url: '/system/enableRegister',
        method: 'GET'
    })
}

// 检查用户名是否可用
export const checkUserName = (username: string) => {
    return request<boolean>({
        url: '/system/checkUserName/' + username,
        method: 'POST'
    })
}

// 用户注册
export const register = (data: RegisterType) => {
    return request<string>({
        url: '/system/register',
        method: 'POST',
        data: data
    })
}

// 登录后必要信息校验
export const getLoginSetting = () => {
    return request<string[]>({
        url: '/system/checkLoginSetting',
        method: 'GET',
    })
}
