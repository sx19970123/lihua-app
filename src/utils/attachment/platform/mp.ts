import type {FileInfoType} from '../attachment-utils'

/**
 * attachment 域小程序平台实现（经 attachment-utils 域入口分发，业务不直接引用）
 */
export const getFileInfo = (filePath: string): Promise<Pick<FileInfoType, 'size' | 'md5'>> => {
	return new Promise((resolve, reject) => {
		const fileManager = uni.getFileSystemManager()
		fileManager.getFileInfo({
			filePath: filePath,
			success: (resp) => {
				resolve({size: resp.size, md5: resp.digest})
			},
			fail: reject
		})
	})
}

/**
 * 上传请求头：小程序端维持 multipart 手动声明
 */
export const getUploadHeader = (): Record<string, string> => {
	return {'Content-Type': 'multipart/form-data'}
}
