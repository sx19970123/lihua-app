// #ifdef APP
import * as app from './platform/app'
// #endif
// #ifdef WEB
import * as web from './platform/web'
// #endif
// #ifdef MP-WEIXIN
import * as mp from './platform/mp'
// #endif

type FileInfoType = {
	fileName?: string,
	filePath?: string,
	size?: number,
	md5?: string
}

/**
 * attachment 域入口：通用逻辑与跨平台分发集中于此（业务只 import 本文件，
 * platform/ 伴随文件不直接引用——同签名导出缺项会被本文件的 import 即时暴露）。
 * 平台 import 随条件编译进出，未用平台文件及其依赖（如 crypto-js）不进对应端包
 */
export type {FileInfoType}

/**
 * 获取附件详情
 */
export const getFileInfo = async (filePath?: string): Promise<FileInfoType> => {
	if (!filePath) {
		return {}
	}
	// 从路径中截取文件名（WEB 的 blob URL 截出的是无后缀 UUID，真实文件名由调用方以 file.name 覆盖）
	const fileName = filePath.split('/').pop()
	// 守卫收窄后的路径：const 固化 string 类型（条件编译的互斥分支对 TS 均可见，参数收窄不保持）
	const path: string = filePath

	// #ifdef APP
	return {fileName, filePath, ...await app.getFileInfo(path)}
	// #endif
	// #ifdef WEB
	return {fileName, filePath, ...await web.getFileInfo(path)}
	// #endif
	// #ifndef APP || WEB
	return {fileName, filePath, ...await mp.getFileInfo(path)}
	// #endif
}

/**
 * url转临时地址
 */
export const getFileTempPath = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('附件输入为空'))
      return
    }

    // 网络地址
    if (/^https?:\/\//i.test(url)) {
      uni.downloadFile({
        url: url,
        success: (resp) => {
          if (resp.tempFilePath) {
            resolve(resp.tempFilePath)
          } else {
            reject(new Error('下载失败'))
          }
        },
        fail: reject
      })
      return
    }

    reject(new Error('路径错误'))
  })
}
