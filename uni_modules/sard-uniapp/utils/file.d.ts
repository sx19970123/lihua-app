/**
 * @description: 判断url是否为图片url
 * @param {string} url
 * @return {boolean}
 */
export declare function isImageUrl(url: string): boolean;
/**
 * @description: 判断url是否为视频url
 * @param {string} url
 * @return {boolean}
 */
export declare function isVideoUrl(url: string): boolean;
/**
 * @description: 判断url是否为文件url
 * @param {string} url
 * @return {boolean}
 */
export declare function isFileUrl(url: string): boolean;
export type FileReaderResultType = 'file' | 'dataUrl' | 'text';
/**
 * @description: 读取文件内容
 * @param {File} file
 * @param {ResultType} resultType
 * @return {Promise<void | string>}
 */
export declare function readFileContent(file: File, resultType: FileReaderResultType): Promise<string | void>;
/**
 * @description: 从路径中获取文件名
 * @param {string} path
 * @param {boolean} ext 是否包含扩展名
 * @return {string}
 */
export declare function getFileName(path: string, ext?: boolean): string;
export declare function plusToDataURL(filePath: string): Promise<string>;
