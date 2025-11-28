import request, {attachmentUpload} from "@/utils/Request";
import type {SysAttachment} from "@/api/system/attachment/type/SysAttachment";

// 根据路径查询文件信息，用于附件组件数据回显
export const queryAttachmentInfoByIds = (ids: string[]) => {
    return request<Array<SysAttachment>>({
        url: "app/system/attachment/storage/info",
        method: "POST",
        data: ids
    })
}

//  附件上传
export const upload = (filePath: string, businessCode: string, businessName: string) => {
	return attachmentUpload<string>({
		url: "app/system/attachment/storage/upload",
		filePath: filePath,
		name: 'file',
		formData: {
			businessCode,
			businessName,
			uploadMode: "0"
		},
		header: {'Content-Type': 'multipart/form-data'}
	})
}

// 公开附件下载
export const publicAttachmentDownload = (id: string) => {
    return request<ArrayBuffer>({
        url: `app/system/attachment/storage/download/p/${id}`,
        method: 'GET',
        responseType: 'arraybuffer'
    })
}