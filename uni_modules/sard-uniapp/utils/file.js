/**
 * @description: 判断url是否为图片url
 * @param {string} url
 * @return {boolean}
 */
export function isImageUrl(url) {
    const rPicMime = /\.(?:jpg|jpeg|png|gif|svg|bmp|webp|tiff|tif|heic|heif)$/i;
    return (typeof url === 'string' &&
        (rPicMime.test(url) || url.indexOf('data:image') === 0));
}
/**
 * @description: 判断url是否为视频url
 * @param {string} url
 * @return {boolean}
 */
export function isVideoUrl(url) {
    const rVideoMime = /\.(avi|mp4|mov|wmv|flv|mkv|mpeg|mpg|3gp|webm|swf|rmvb|vob|ts|mts|m2ts|divx|asf|ogv|f4v)$/i;
    return (typeof url === 'string' &&
        (rVideoMime.test(url) || url.indexOf('data:video') === 0));
}
/**
 * @description: 判断url是否为文件url
 * @param {string} url
 * @return {boolean}
 */
export function isFileUrl(url) {
    return url.includes('/');
}
/**
 * @description: 读取文件内容
 * @param {File} file
 * @param {ResultType} resultType
 * @return {Promise<void | string>}
 */
export function readFileContent(file, resultType) {
    return new Promise((resolve) => {
        if (resultType === 'file') {
            resolve();
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        if (resultType === 'dataUrl') {
            reader.readAsDataURL(file);
        }
        else if (resultType === 'text') {
            reader.readAsText(file);
        }
    });
}
/**
 * @description: 从路径中获取文件名
 * @param {string} path
 * @param {boolean} ext 是否包含扩展名
 * @return {string}
 */
export function getFileName(path, ext = true) {
    const name = path.match(/\/([^/]+)$/)?.[1] || '';
    return ext ? name : name.replace(/\.[^.]+$/, '');
}
export async function plusToDataURL(filePath) {
    return new Promise((resolve) => {
        plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
            ;
            entry.file((file) => {
                const fileReader = new plus.io.FileReader();
                fileReader.readAsDataURL(file, 'utf-8');
                fileReader.onloadend = (evt) => {
                    resolve(evt.target.result);
                };
            });
        });
    });
}
