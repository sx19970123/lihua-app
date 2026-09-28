import request from "@/utils/request"
import type {AppVersionVO} from "@/api/system/app-version/type/sys-app-version"

/**
 * 检查更新（匿名接口；无更新时 data 为 null）
 * @param platform 平台标识：android / ios
 * @param versionCode 当前客户端版本序号（manifest.json versionCode）
 */
export const checkUpdate = (platform: string, versionCode: number) => {
    return request<AppVersionVO | null>({
        url: 'app/system/app-version/check',
        method: 'GET',
        data: {platform, versionCode}
    })
}
