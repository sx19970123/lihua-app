export interface SysAttachment {
    /** 主键 */
    id?: string;
    /** 文件存储名 */
    storageName?: string;
    /** 文件原名称 */
    originalName?: string;
    /** 文件扩展名 */
    extensionName?: string;
    /** info 场景与 url 同值为访问链，其余场景为对象键 */
    path?: string;
    /** 分片上传id */
    uploadId?: string;
    /** 业务编码（默认文件上传时所在的路由名称） */
    businessCode?: string;
    /** 业务名称（默认文件上传时所在的菜单名称） */
    businessName?: string;
    /** 文件大小 */
    size?: string;
    /** 文件类型 */
    type?: string;
    /** 上传方式 */
    uploadMode?: string;
    /** 上传状态 上传成功、上传失败 */
    status?: string;
    /** 文件存储位置 如：本地、云存储等 */
    storageLocation?: string;
    /** md5 */
    md5?: string;
    /** 上传人id */
    createId?: string;
    /** 上传时间 */
    createTime?: Date;
    /** 上传失败原因 */
    errorMsg?: string;
    /** 访问链（公开附件为 download?fullPath= 链，私密附件为 download?key= 签名链） */
    url?: string;
}

/** 上传/秒传接口响应：id 供 v-model 持久化，path 为对象键，url 为首次访问链 */
export interface AttachmentUploadVO {
    id?: string;
    path?: string;
    isPublic?: boolean;
    url?: string;
    originalName?: string;
    type?: string;
}

/** 秒传响应：uploaded 为 false 表示 md5 未命中需走普通上传 */
export interface FastUploadResultVO extends AttachmentUploadVO {
    uploaded?: boolean;
}
