import request from "@/utils/Request";
import type {AuthInfoType} from "@/api/system/auth/type/AuthInfoType";

// 获取用户信息
export const queryAuthInfo = () => {
    return request<AuthInfoType>({
        url: 'system/info',
        method: 'GET'
    })
}
// 刷新用户数据
export const reloadData = () => {
    return request({
        url: 'system/reloadData',
        method: 'POST'
    })
}
// 获取公钥
export const getPublicKey = (requestKey: string) => {
    return request<string>({
        url: 'system/publicKey/' + requestKey,
        method: 'GET'
    })
}