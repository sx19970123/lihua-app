type FileInfoType = {
	fileName?: string,
	filePath?: string,
	size?: number,
	md5?: string
}

/**
 * 获取附件详情
 */
export const getFileInfo = async (filePath: string): Promise<FileInfoType> => {
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