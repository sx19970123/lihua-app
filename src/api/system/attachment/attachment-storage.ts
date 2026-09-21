import request, {attachmentUpload} from "@/utils/request";
import {getUploadHeader} from "@/utils/attachment/attachment-utils";
import type {AttachmentUploadVO, FastUploadResultVO, SysAttachment} from "@/api/system/attachment/type/sys-attachment";

// 后端下发的附件访问链为相对链（如 /system/attachment/storage/download?fullPath=...），
// App 端经 /app 网关前缀访问；已是完整地址（OSS 直链等）则原样使用
export const resolveAttachmentEntryUrl = (entryUrl: string) => {
    return /^https?:\/\//i.test(entryUrl) ? entryUrl : `${import.meta.env.VITE_APP_BASE_API}/app${entryUrl}`
}

// 根据路径查询文件信息，用于附件组件数据回显
export const queryAttachmentInfoByIds = (ids: string[]) => {
    return request<Array<SysAttachment>>({
        url: "app/system/attachment/storage/info",
        method: "POST",
        data: ids
    })
}

//  附件上传，返回 AttachmentUploadVO（id 供 v-model 持久化，path 为对象键，url 为首次访问链）
export const upload = (filePath: string, options: {businessCode: string, businessName?: string, public?: boolean}) => {
	// formData 值必须为字符串（undefined 会被序列化为 "undefined"），可选字段按需拼入
	const formData: Record<string, string> = {businessCode: options.businessCode}
	if (options.businessName) {
		formData.businessName = options.businessName
	}
	if (options.public) {
		formData.public = "true"
	}
    return attachmentUpload<AttachmentUploadVO>({
        url: "app/system/attachment/storage/upload",
        filePath: filePath,
        name: 'file',
        formData,
        header: getUploadHeader()
    })
}

// 文件秒传；uploaded 为 false 表示未命中（附件在 exists 与秒传之间被移除的竞态）
export const fastUpload = (data: {originalName: string, md5: string, businessCode: string, businessName?: string, public?: boolean}) => {
    return request<FastUploadResultVO>({
        url: "app/system/attachment/storage/fast/upload",
        method: "POST",
        data
    })
}

// 根据md5查询附件是否存在
export const existsAttachmentByMd5 = (md5: string) => {
    return request<boolean>({
        url: `app/system/attachment/storage/exists/${md5}`,
        method: "GET"
    })
}

// 附件业务删除
export const deleteFromBusiness = (ids: string[]) => {
    return request({
        url: `app/system/attachment/storage/business`,
        method: "DELETE",
		data: ids
    })
}