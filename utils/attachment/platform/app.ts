import type {FileInfoType} from '../attachment-utils'

/**
 * attachment 域 APP 平台实现（经 attachment-utils 域入口分发，业务不直接引用）
 */
export const getFileInfo = (filePath: string): Promise<Pick<FileInfoType, 'size' | 'md5'>> => {
	return new Promise((resolve, reject) => {
		// uni-app x 无全局 uni.getFileInfo，统一走 fsm（默认 digestAlgorithm=md5）
		uni.getFileSystemManager().getFileInfo({
			filePath: filePath,
			success: (resp) => {
				resolve({size: resp.size, md5: resp.digest})
			},
			fail: reject
		})
	})
}
