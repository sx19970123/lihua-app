interface UploadFileOptionFiles {
    /**
     * multipart 提交时，表单的项目名，默认为 file，如果 name 不填或填的值相同，可能导致服务端读取文件时只能读取到一个文件。
     */
    name?: string;
    /**
     * 要上传的文件对象
     */
    file?: File;
    /**
     * 要上传文件资源的路径
     */
    uri?: string;
}
export interface RequestConfig<D extends string | AnyObject | ArrayBuffer = any, E extends Record<string, any> = any, Task extends UniApp.RequestTask | UniApp.UploadTask | UniApp.DownloadTask = UniApp.RequestTask> {
    /**
     * 自动加在 `url` 前面，除非 `url` 是一个绝对 URL
     */
    baseURL?: string;
    /**
     * 与请求一起发送的 URL 参数
     */
    params?: AnyObject;
    /**
     * 获取 uni.request 返回值，可用于中断请求
     */
    getTask?: (task: Task, config: RequestConfig<D, E>) => void;
    /**
     * 请求的参数
     */
    data?: D;
    /**
     * 额外的请求参数，用于实现自定义的行为
     */
    extra?: E;
    /**
     * 资源url
     */
    url?: string;
    /**
     * 设置请求的 header，header 中不能设置 Referer。
     */
    header?: any;
    /**
     * 默认为 GET
     * 可以是：OPTIONS，GET，HEAD，POST，PUT，DELETE，TRACE，CONNECT
     */
    method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | 'DOWNLOAD' | 'UPLOAD';
    /**
     * 超时时间
     */
    timeout?: number;
    /**
     * 如果设为json，会尝试对返回的数据做一次 JSON.parse
     */
    dataType?: string;
    /**
     * 设置响应的数据类型。合法值：text、arraybuffer
     */
    responseType?: string;
    /**
     * 验证 ssl 证书
     */
    sslVerify?: boolean;
    /**
     * 跨域请求时是否携带凭证
     */
    withCredentials?: boolean;
    /**
     * DNS解析时优先使用 ipv4
     */
    firstIpv4?: boolean;
    /**
     * 开启 http2
     */
    enableHttp2?: boolean;
    /**
     * 开启 quic
     */
    enableQuic?: boolean;
    /**
     * 开启 cache
     */
    enableCache?: boolean;
    /**
     * 是否开启 HttpDNS 服务。如开启，需要同时填入 httpDNSServiceId 。 HttpDNS 用法详见 [移动解析HttpDNS](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/HTTPDNS.html)
     */
    enableHttpDNS?: boolean;
    /**
     * HttpDNS 服务商 Id。 HttpDNS 用法详见 [移动解析HttpDNS](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/HTTPDNS.html)
     */
    httpDNSServiceId?: boolean;
    /**
     * 开启 transfer-encoding chunked
     */
    enableChunked?: boolean;
    /**
     * wifi下使用移动网络发送请求
     */
    forceCellularNetwork?: boolean;
    /**
     * 默认 false，开启后可在headers中编辑cookie（支付宝小程序10.2.33版本开始支持）
     */
    enableCookie?: boolean;
    /**
     * 是否开启云加速（详见[云加速服务](https://smartprogram.baidu.com/docs/develop/extended/component-codeless/cloud-speed/introduction/)）
     */
    cloudCache?: object | boolean;
    /**
     * 控制当前请求是否延时至首屏内容渲染后发送
     */
    defer?: boolean;
    /**
     * 需要上传的文件列表。App、H5（ 2.6.15+）
     */
    files?: UploadFileOptionFiles[];
    /**
     * 文件类型，image/video/audio，仅支付宝小程序，且必填。
     * - image: 图像
     * - video: 视频
     * - audio: 音频
     */
    fileType?: 'image' | 'video' | 'audio';
    /**
     * 要上传的文件对象。	仅H5（2.6.15+）支持
     */
    file?: File;
    /**
     * 要上传/下载文件资源的路径
     */
    filePath?: string;
    /**
     * 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
     */
    name?: string;
    /**
     * HTTP 请求中其他额外的 form data
     */
    formData?: AnyObject;
}
export interface Response<T = any, D extends string | AnyObject | ArrayBuffer = any> {
    /**
     * 开发者服务器返回的数据
     */
    data: T;
    /**
     * 开发者服务器返回的 HTTP 状态码
     */
    statusCode: number;
    /**
     * 开发者服务器返回的 HTTP Response Header
     */
    header: any;
    /**
     * 开发者服务器返回的 cookies，格式为字符串数组
     */
    cookies: string[];
    /**
     * 请求的配置信息
     */
    config: RequestConfig<D>;
    /**
     * 错误信息
     */
    errMsg: string;
    /**
     * 临时文件路径，下载后的文件会存储到一个临时文件。微信小程序、支付宝小程序、百度小程序、抖音小程序、飞书小程序
     */
    tempFilePath: string;
    /**
     * 下载文件保存的路径（本地临时文件）。入参未指定 filePath 的情况下可用。支付宝小程序
     */
    apFilePath: string;
    /**
     * 用户文件路径 (本地路径)。传入 filePath 时会返回，跟传入的 filePath 一致。微信小程序、支付宝小程序、抖音小程序、飞书小程序
     */
    filePath: string;
    /**
     * 文件内容。QQ小程序
     */
    fileContent?: any;
    /**
     * 需要基础库： `2.10.4`
     *
     * 网络请求过程中一些调试信息，[查看详细说明](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/network.html)
     */
    profile?: UniApp.RequestProfile;
}
export interface ErrorResponse<D extends string | AnyObject | ArrayBuffer = any> {
    /**
     * 请求的配置信息
     */
    config: RequestConfig<D>;
    /**
     * 错误信息
     */
    errMsg: string;
}
declare function createInterceptors<T, U, E>(): {
    request: {
        use: (onFulfilled: (value: T) => T | Promise<T>, onRejected?: ((error: E) => any) | null | undefined) => void;
        resolve: (data: T) => Promise<T>;
        reject: (error: any) => Promise<any>;
    };
    response: {
        use: (onFulfilled: (value: U) => U | Promise<U>, onRejected?: ((error: E) => any) | null | undefined) => void;
        resolve: (data: U) => Promise<U>;
        reject: (error: any) => Promise<any>;
    };
};
export declare class Request<E extends Record<string, any> = any> {
    readonly interceptors: ReturnType<typeof createInterceptors<RequestConfig<any, E, any>, Response, ErrorResponse>>;
    protected defaultConfig: RequestConfig;
    constructor(defaultConfig?: RequestConfig);
    request<T = any, R = Response<T>, D extends string | AnyObject | ArrayBuffer = any, Task extends UniApp.RequestTask | UniApp.UploadTask | UniApp.DownloadTask = UniApp.RequestTask>(config: RequestConfig<D, E, Task>): Promise<R>;
    get<T = any, R = Response<T>, D extends string | AnyObject | ArrayBuffer = any>(url: string, config?: RequestConfig<D, E>): Promise<R>;
    head<T = any, R = Response<T>, D extends string | AnyObject | ArrayBuffer = any>(url: string, config?: RequestConfig<D, E>): Promise<R>;
    connect<T = any, R = Response<T>, D extends string | AnyObject | ArrayBuffer = any>(url: string, config?: RequestConfig<D, E>): Promise<R>;
    trace<T = any, R = Response<T>, D extends string | AnyObject | ArrayBuffer = any>(url: string, config?: RequestConfig<D, E>): Promise<R>;
    post<T = any, R = Response<T>, D extends string | AnyObject | ArrayBuffer = any>(url: string, data?: D, config?: RequestConfig<D, E>): Promise<R>;
    put<T = any, R = Response<T>, D extends string | AnyObject | ArrayBuffer = any>(url: string, data?: D, config?: RequestConfig<D, E>): Promise<R>;
    delete<T = any, R = Response<T>, D extends string | AnyObject | ArrayBuffer = any>(url: string, data?: D, config?: RequestConfig<D, E>): Promise<R>;
    options<T = any, R = Response<T>, D extends string | AnyObject | ArrayBuffer = any>(url: string, data?: D, config?: RequestConfig<D, E>): Promise<R>;
    upload<T = any, R = Response<T>, D extends string | AnyObject | ArrayBuffer = any>(url: string, config?: RequestConfig<D, E, UniApp.UploadTask>): Promise<R>;
    download<T = any, R = Response<T>, D extends string | AnyObject | ArrayBuffer = any>(url: string, config?: RequestConfig<D, E, UniApp.DownloadTask>): Promise<R>;
}
export {};
