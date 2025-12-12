type FileInfoType = {
	fileName?: string,
	filePath?: string,
	size?: number,
	md5?: string
}

/**
 * 获取附件详情
 */
export const getFileInfo = async (filePath?: string): Promise<FileInfoType> => {
	if (!filePath) {
		return {}
	}
	// 从路径中截取文件名
	const fileName = filePath.split('/').pop();
	
	return new Promise<FileInfoType>((resolve, reject) => {
		// #ifdef APP-PLUS
			uni.getFileInfo({
				filePath: filePath,
				success: (resp) => {
					resolve({fileName, filePath, size: resp.size, md5: resp.digest})
				},
				fail: (err) => {
					reject(err)
				}
			})
		// #endif
		
		// #ifndef APP-PLUS
			const fileManager = uni.getFileSystemManager()
			fileManager.getFileInfo({
				filePath: filePath,
				success: (resp) => {
					resolve({fileName, filePath, size: resp.size, md5: resp.digest})
				},
				fail: (err) => {
					reject(err)
				}
			})
		// #endif
	})
}

/**
 * 缓存文件，返回路径
 */
export const cacheFile = (url: string) => {
	return new Promise((resolve, reject) => {
		// 下载文件
		uni.downloadFile({
			url: url,
			success: (resp) => {
				uni.saveFile({
					tempFilePath: resp.tempFilePath,
					success: (saveResp) => {
						resolve(saveResp.savedFilePath)
					},
					fail: (err) => reject(err)
				})
			},
			fail: (err) => reject(err)
		})
	})
}