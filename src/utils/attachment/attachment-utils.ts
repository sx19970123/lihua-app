import * as h5 from './platform/h5'
import * as app from './platform/app'
import * as mp from './platform/mp'

type FileInfoType = {
	fileName?: string,
	filePath?: string,
	size?: number,
	md5?: string
}

/**
 * attachment 域入口：通用逻辑与跨平台分发集中于此（业务只 import 本文件，
 * platform/ 伴随文件不直接引用——同签名导出缺项会被本文件的 import 即时暴露）
 */
export type {FileInfoType}

/**
 * 获取附件详情
 */
export const getFileInfo = async (filePath?: string): Promise<FileInfoType> => {
	if (!filePath) {
		return {}
	}
	// 从路径中截取文件名（H5 的 blob URL 截出的是无后缀 UUID，真实文件名由调用方以 file.name 覆盖）
	const fileName = filePath.split('/').pop()
	// 守卫收窄后的路径：const 固化 string 类型（条件编译的互斥分支对 TS 均可见，参数收窄不保持）
	const path: string = filePath

	// #ifdef H5
	return {fileName, filePath, ...await h5.getFileInfo(path)}
	// #endif
	// #ifdef APP-PLUS
	return {fileName, filePath, ...await app.getFileInfo(path)}
	// #endif
	// #ifndef APP-PLUS || H5
	return {fileName, filePath, ...await mp.getFileInfo(path)}
	// #endif
}

/**
 * 上传请求头（multipart 的 Content-Type 组装方式各平台不同，平台文件内说明）
 */
export const getUploadHeader = (): Record<string, string> => {
	// #ifdef H5
	return h5.getUploadHeader()
	// #endif
	// #ifdef APP-PLUS
	return app.getUploadHeader()
	// #endif
	// #ifndef APP-PLUS || H5
	return mp.getUploadHeader()
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