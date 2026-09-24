/**
 * App 版本检查更新返回（无更新时接口 data 为 null）
 */
export interface AppVersionVO {
    /** 主键 */
    id?: string
    /** 版本名称（与 manifest.json versionName 一致，如 1.2.0） */
    versionName?: string
    /** 版本序号（与 manifest.json versionCode 一致，整数，如 10200） */
    versionCode?: number
    /** 平台（android/ios） */
    platform?: string
    /** 主包地址（android=apk 附件 path 或 HTTP(S) 直链；ios=外部跳转链接） */
    downloadUrl?: string
    /** 是否支持 wgt 热更新（0 否 / 1 是） */
    enableWgt?: string
    /** 热更新地址 */
    wgtDownloadUrl?: string
    /** 更新说明（纯文本多行） */
    updateContent?: string
    /** 状态（0 草稿 / 1 已发布 / 2 已下线） */
    status?: string
    /** 发布时间 */
    publishTime?: string
    /**
     * 实际生效的下载地址：HTTP(S) 直链原样返回；
     * 附件 path 由后端组装为公开附件下载相对链，使用前经 resolveDownloadUrl 补全 baseURL
     */
    effectiveDownloadUrl?: string
    /** 实际更新方式：apk（整包）/ wgt（热更新）/ link（外部跳转，iOS） */
    effectiveType?: 'apk' | 'wgt' | 'link'
}
