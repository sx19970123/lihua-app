import {checkUpdate} from '@/api/system/app-version/app-version'
import type {AppVersionVO} from '@/api/system/app-version/type/sys-app-version'
import {dialog} from 'sard-uniapp'
import {toast} from '@/utils/toast'
import {setAppUpdateRedDotSource} from '@/helpers/tabbar-red-dot'

/**
 * 设置页「检查更新」条目红点 storage key（处理级）：
 * 新版本未安装期间持续点亮，安装成功或检查确认无更新时熄灭
 */
const HAS_UPDATE_STORAGE_KEY = 'lihua_app_has_update'

/**
 * 导航提醒级红点（tabbar「我的」+ Profile 设置入口）：
 * 新版本「首次发现」时点亮并记录已提醒版本号（持久化——重复启动不重复骚扰），
 * 用户手动检查更新后熄灭；更高新版本再次发布会重新点亮
 */
const REMIND_STORAGE_KEY = 'lihua_app_update_remind'
const REMINDED_CODE_STORAGE_KEY = 'lihua_app_update_reminded_code'

/**
 * 全局事件名：更新包安装成功（wgt 重启前 / apk 唤起安装器后派发，预留业务侧钩子）
 */
export const APP_UPDATE_SUCCESS_EVENT = 'app:update-success'

/**
 * 更新包下载目录（按版本序号命名，已下载过同版本包直接复用秒装）
 */
const UPDATE_DIR = '_doc/update/'

/**
 * 获取当前 App 的平台标识（非 APP 环境为空串）。
 * 鸿蒙 next 无 5+ runtime（plus 不可用），APP-HARMONY 分支只能用 uni 跨端 API；
 * 鸿蒙发布走外链跳转通道（同 iOS，见后端 isLinkPlatform），无下载安装链路
 */
const getPlatform = (): 'android' | 'ios' | 'harmony' | '' => {
    // #ifdef APP-PLUS
    return plus.os.name === 'iOS' ? 'ios' : 'android'
    // #endif
    // #ifdef APP-HARMONY
    return 'harmony'
    // #endif
    // #ifndef APP
    return ''
    // #endif
}

/**
 * 获取当前 App 的版本序号：
 * Android/iOS 经 plus.runtime.getProperty 取 widgetInfo（wgt 热更后 manifest 值不再准确，以运行时实际版本为准）；
 * 鸿蒙无热更机制，uni.getAppBaseInfo 的 manifest 版本号即当前版本
 */
const getCurrentVersionCode = (): Promise<number> => {
    return new Promise((resolve) => {
        // #ifdef APP-PLUS
        plus.runtime.getProperty(plus.runtime.appid!, (widgetInfo) => {
            resolve(parseInt(widgetInfo.versionCode || '0', 10) || 0)
        })
        // #endif
        // #ifdef APP-HARMONY
        resolve(uni.getAppBaseInfo().appVersionCode || 0)
        // #endif
        // #ifndef APP
        resolve(0)
        // #endif
    })
}

/**
 * 当前版本号（manifest versionName，设置页条目展示用；非 APP 环境为空串）
 */
export const getCurrentVersionName = (): string => {
    // #ifdef APP-PLUS
    return plus.runtime.version || ''
    // #endif
    // #ifdef APP-HARMONY
    return uni.getAppBaseInfo().appVersion || ''
    // #endif
    // #ifndef APP
    return ''
    // #endif
}

/**
 * 设置页红点标志读写
 */
export const getHasUpdateFlag = (): boolean => {
    return uni.getStorageSync(HAS_UPDATE_STORAGE_KEY) === '1'
}

const setHasUpdateFlag = (on: boolean) => {
    if (on) {
        uni.setStorageSync(HAS_UPDATE_STORAGE_KEY, '1')
    } else {
        uni.removeStorageSync(HAS_UPDATE_STORAGE_KEY)
    }
}

/**
 * 导航提醒级红点读取（Profile 设置入口、AppRoot tabbar 重设消费）
 */
export const getAppUpdateRemind = (): boolean => {
    return uni.getStorageSync(REMIND_STORAGE_KEY) === '1'
}

/**
 * 导航提醒级红点写点（storage 持久化 + tabbar 红点源同步，单处收口）
 */
const setRemind = (on: boolean) => {
    if (on) {
        uni.setStorageSync(REMIND_STORAGE_KEY, '1')
    } else {
        uni.removeStorageSync(REMIND_STORAGE_KEY)
    }
    setAppUpdateRedDotSource(on)
}

const getRemindedCode = (): number => {
    return parseInt(uni.getStorageSync(REMINDED_CODE_STORAGE_KEY) || '0', 10) || 0
}

/**
 * 手动检查更新时清除导航提醒（tabbar 与 Profile 设置入口红点熄灭）；
 * 「检查更新」条目红点不受影响，仅在更新安装完成后熄灭
 */
export const clearAppUpdateRemind = () => {
    setRemind(false)
}

/**
 * 检查更新结果实体：后台 check 接口（传入当前版本号）返回内容的扁平化封装，
 * 下载方式/地址已由后台权威判定（wgt 连续性检查）并按热更优先解析
 */
export type AppUpdateInfo = {
    /** 是否有更新（恒为 true；无更新时 checkAppUpdate 返回 null） */
    hasUpdate: boolean
    /** 新版本序号（下载文件命名与已下载判存用） */
    versionCode: number
    /** 新版本名称（弹窗标题展示） */
    versionName: string
    /** 新版本更新日志（弹窗内容展示） */
    updateContent?: string
    /** 更新方式：wgt 热更新 / apk 整包安装器 / link 外链跳转（iOS/鸿蒙） */
    downloadType: 'wgt' | 'apk' | 'link'
    /** 下载或跳转地址（附件相对链已补全当前环境 baseURL） */
    downloadUrl: string
}

/**
 * 检查更新主入口：向后台传入当前版本号，有更新返回更新实体，无更新返回 null；
 * 网络/环境异常抛出——静默检查（启动时）自行吞掉，手动检查由调用方提示失败
 */
export const checkAppUpdate = async (): Promise<AppUpdateInfo | null> => {
    // #ifndef APP
    return null
    // #endif

    // #ifdef APP
    const platform = getPlatform()
    const currentVersionCode = await getCurrentVersionCode()

    if (!platform || !currentVersionCode) {
        throw new Error('获取当前版本信息失败')
    }

    let resp
    try {
        resp = await checkUpdate(platform, currentVersionCode)
    } catch (e) {
        console.error('[AppUpdate] 检查更新接口异常', e)
        throw new Error('检查更新失败')
    }

    if (!resp || resp.code !== 200) {
        throw new Error(resp?.msg ?? '检查更新失败')
    }

    const version = resp.data
    // 无更新（data 为空）：处理级红点与导航提醒一并熄灭（本地版本号追上或版本已下线的自愈）
    if (!version || !version.versionCode || !version.effectiveDownloadUrl) {
        setHasUpdateFlag(false)
        setRemind(false)
        return null
    }

    setHasUpdateFlag(true)
    // 导航提醒：该版本「首次发现」才点亮（持久化），重复启动不重复骚扰，更高新版本会重新点亮
    if (version.versionCode > getRemindedCode()) {
        uni.setStorageSync(REMINDED_CODE_STORAGE_KEY, String(version.versionCode))
        setRemind(true)
    }
    return {
        hasUpdate: true,
        versionCode: version.versionCode,
        versionName: version.versionName ?? '',
        updateContent: version.updateContent,
        downloadType: version.effectiveType ?? 'apk',
        downloadUrl: resolveDownloadUrl(version)
    }
    // #endif
}

/**
 * 解析实际下载地址：HTTP(S) 直链原样返回；附件下载相对链（后端经 AttachmentUrlUtils 统一组装，
 * 恒以 / 开头）去除 baseURL 尾斜杠后补全当前环境前缀
 */
const resolveDownloadUrl = (version: AppVersionVO): string => {
	const url = version.effectiveDownloadUrl || ''
	if (/^https?:\/\//i.test(url)) {
		return url
	}
	const baseURL = (import.meta.env.VITE_APP_BASE_API ?? '').replace(/\/+$/, '')
	return baseURL + url
}

/**
 * 执行外链跳转型更新（iOS/鸿蒙：跳应用市场或分发页）。
 * Android/iOS 走 plus.runtime.openURL；鸿蒙 next 无 plus 且 uni 官方未提供跨端 openURL
 * （原生 openLink 需 UTS 插件，专项落地前以轻提示引导）
 */
export const openLinkUpdate = (url: string) => {
    // #ifdef APP-PLUS
    plus.runtime.openURL(url)
    // #endif
    // #ifdef APP-HARMONY
    console.log('[AppUpdate] harmony market url:', url)
    toast('请前往应用市场搜索更新')
    // #endif
}

/**
 * 检查更新包文件是否已存在（按版本序号 + 更新方式命名）
 * @returns 文件本地绝对路径，不存在则返回 null
 */
export const checkPackageExists = (versionCode: number, effectiveType: string): Promise<string | null> => {
    return new Promise((resolve) => {
        // #ifdef APP-PLUS
        const filePath = UPDATE_DIR + versionCode + '.' + effectiveType
        plus.io.resolveLocalFileSystemURL(filePath, () => {
            // 文件存在，返回完整绝对路径供 install 使用
            resolve(plus.io.convertLocalFileSystemURL(filePath))
        }, () => {
            resolve(null)
        })
        // #endif
        // #ifndef APP-PLUS
        resolve(null)
        // #endif
    })
}

/**
 * 安装更新包（wgt 热更新：安装后提示重启；apk 整包：唤起系统安装器）。
 * 安装失败常见原因（plus err.message 会透出）：wgt 包 appid 与本应用不一致、
 * wgt 包 manifest versionCode 不大于当前版本、包文件不完整或非有效安装包
 */
export const installPackage = (filename: string, effectiveType: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        // #ifdef APP-PLUS
        const onInstallError = (err?: { code?: number, message?: string }) => {
            console.error('[AppUpdate] 安装失败', effectiveType, filename, err)
            reject(new Error(err?.message ?? '安装失败'))
        }
        if (effectiveType === 'wgt') {
            // 热更新：安装 wgt 资源包，安装成功必须重启才能加载新资源
            plus.runtime.install(filename, { force: true }, () => {
                uni.$emit(APP_UPDATE_SUCCESS_EVENT)
                setHasUpdateFlag(false)
                setRemind(false)
                dialog.alert({
                    title: '更新成功',
                    message: '更新完成，应用即将重启',
                    buttonType: 'round',
                    confirmText: '确定',
                    onConfirm: () => {
                        plus.runtime.restart()
                    }
                })
                resolve(true)
            }, onInstallError)
        } else {
            // 整包：安装 apk（系统会唤起安装器）；导航提醒熄灭（处理级红点待重启后版本追上自愈）
            plus.runtime.install(filename, {}, () => {
                uni.$emit(APP_UPDATE_SUCCESS_EVENT)
                setRemind(false)
                resolve(true)
            }, onInstallError)
        }
        // #endif
        // #ifndef APP-PLUS
        reject(new Error('当前环境不支持自动更新'))
        // #endif
    })
}

/**
 * 确保更新包下载目录存在（plus.downloader 的 filename 子目录不会自动创建）
 */
const ensureUpdateDir = (): Promise<void> => {
    return new Promise((resolve) => {
        // #ifdef APP-PLUS
        plus.io.resolveLocalFileSystemURL(UPDATE_DIR, () => resolve(), () => {
            // update 子目录不存在：在 _doc 根下创建（失败不阻断下载，由下载环节报错）
            plus.io.resolveLocalFileSystemURL('_doc/', (entry) => {
                (entry as unknown as { getDirectory: (name: string, option: { create: boolean }, ok: () => void, fail: () => void) => void })
                    .getDirectory('update', { create: true }, () => resolve(), () => resolve())
            }, () => resolve())
        })
        // #endif
        // #ifndef APP-PLUS
        resolve()
        // #endif
    })
}

/**
 * 下载更新包（不安装，仅下载）
 * @param versionCode 版本序号（用于文件命名）
 * @param url 下载地址（经 resolveDownloadUrl 补全后的完整地址）
 * @param effectiveType 更新方式：apk（整包）/ wgt（热更新）
 * @param onProgress 下载进度回调（0-100）
 * @returns 下载完成后的本地文件路径
 */
export const downloadPackage = async (
    versionCode: number,
    url: string,
    effectiveType: string,
    onProgress?: (percent: number) => void
): Promise<string> => {
    await ensureUpdateDir()
    return new Promise((resolve, reject) => {
        // #ifdef APP-PLUS
        const fileName = versionCode + '.' + effectiveType

        const task = plus.downloader.createDownload(url, {
            filename: UPDATE_DIR + fileName
        }, (download, status) => {
            if (status === 200) {
                resolve(download.filename!)
            } else {
                console.error('[AppUpdate] 下载失败', status, url)
                reject(new Error('下载失败，状态码：' + status))
            }
        })

        // 监听下载进度
        task.addEventListener('statechanged', (download) => {
            if (download.downloadedSize > 0 && download.totalSize > 0) {
                onProgress?.(Math.floor((download.downloadedSize / download.totalSize) * 100))
            }
        })

        task.start()
        // #endif

        // #ifndef APP-PLUS
        reject(new Error('当前环境不支持自动更新'))
        // #endif
    })
}
