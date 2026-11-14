import CryptoJS from 'crypto-js'
import type {FileInfoType} from '../attachment-utils'

/**
 * attachment 域 WEB 平台实现（经 attachment-utils 域入口分发，业务不直接引用）：
 * x 端 WEB 平台无 uni.getFileSystemManager，临时路径为 blob/data URL，经 fetch 取 Blob 获取大小，
 * md5 以 crypto-js 计算（既有依赖，秒传链路可用）
 */
export const getFileInfo = async (filePath: string): Promise<Pick<FileInfoType, 'size' | 'md5'>> => {
	const blob = await fetch(filePath).then((resp) => {
		if (!resp.ok) {
			throw new Error(`读取文件失败：HTTP ${resp.status}`)
		}
		return resp.blob()
	})
	const wordArray = CryptoJS.lib.WordArray.create(await blob.arrayBuffer())
	return {size: blob.size, md5: CryptoJS.MD5(wordArray).toString()}
}
