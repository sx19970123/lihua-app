import { URLQuery } from './url-query';
function reducerFactory() {
    const handlers = [];
    function use(onFulfilled, onRejected) {
        handlers.push({
            fulfilled: onFulfilled,
            rejected: onRejected,
        });
    }
    async function resolve(data) {
        for (const { fulfilled } of handlers) {
            try {
                data = await fulfilled(data);
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
        return Promise.resolve(data);
    }
    async function reject(error) {
        for (const { rejected } of handlers) {
            try {
                if (rejected) {
                    const data = await rejected(error);
                    return Promise.resolve(data);
                }
            }
            catch (newError) {
                error = newError;
            }
        }
        return Promise.reject(error);
    }
    return {
        use,
        resolve,
        reject,
    };
}
function createInterceptors() {
    return {
        request: reducerFactory(),
        response: reducerFactory(),
    };
}
const defaultRequestConfig = {};
function mergeConfig(...configs) {
    return configs.reduce((result, config) => {
        return {
            ...result,
            ...config,
            header: {
                ...result.header,
                ...config.header,
            },
            params: {
                ...result.params,
                ...config.params,
            },
            extra: {
                ...result.extra,
                ...config.extra,
            },
        };
    }, {});
}
function mergeUrl(options) {
    const { baseURL = '', url = '', params } = options;
    let mergedUrl = '';
    if (/^(https?:)?\/\//.test(url)) {
        mergedUrl = url;
    }
    else if (baseURL && url) {
        mergedUrl = baseURL.replace(/\/*$/, '') + '/' + url.replace(/^\/*/, '');
    }
    else if (baseURL) {
        mergedUrl = baseURL;
    }
    else if (url) {
        mergedUrl = url;
    }
    if (params) {
        const query = new URLQuery(params);
        const index = mergedUrl.indexOf('?');
        if (index !== -1) {
            const originPath = mergedUrl.slice(0, index);
            const search = mergedUrl.slice(index);
            mergedUrl =
                originPath +
                    '?' +
                    new URLQuery([...new URLQuery(search), ...query]).toString();
        }
        else {
            mergedUrl += '?' + query.toString();
        }
    }
    return mergedUrl;
}
export class Request {
    interceptors;
    defaultConfig;
    constructor(defaultConfig = {}) {
        this.defaultConfig = mergeConfig(defaultRequestConfig, defaultConfig);
        this.interceptors = createInterceptors();
    }
    request(config) {
        return new Promise((resolve, reject) => {
            const interceptors = this.interceptors;
            config = mergeConfig(this.defaultConfig, config);
            interceptors.request
                .resolve(config)
                .then((config) => {
                const { baseURL, params, getTask, url, extra, ...rest } = config;
                void extra;
                const mergedUrl = mergeUrl({ baseURL, url, params });
                const mergedConfig = {
                    ...rest,
                    url: mergedUrl,
                    success(result) {
                        const { data, statusCode, header = {}, cookies = [], errMsg = '', tempFilePath = '', apFilePath = '', filePath = '', fileContent, profile, } = result;
                        let parsedData = data;
                        if (typeof data === 'string') {
                            try {
                                parsedData = JSON.parse(data);
                            }
                            catch {
                                void 0;
                            }
                        }
                        interceptors.response
                            .resolve({
                            data: parsedData,
                            statusCode,
                            header,
                            cookies,
                            errMsg,
                            tempFilePath,
                            apFilePath,
                            filePath,
                            fileContent,
                            profile,
                            config,
                        })
                            .then(resolve, reject);
                    },
                    fail(result) {
                        interceptors.response
                            .reject({
                            ...result,
                            config,
                        })
                            .then(resolve, reject);
                    },
                };
                let task;
                switch (config.method) {
                    case 'DOWNLOAD':
                        task = uni.downloadFile(mergedConfig);
                        break;
                    case 'UPLOAD':
                        task = uni.uploadFile(mergedConfig);
                        break;
                    default:
                        task = uni.request(mergedConfig);
                        break;
                }
                if (getTask) {
                    getTask(task, config);
                }
            })
                .catch(reject);
        });
    }
    get(url, config) {
        return this.request({
            ...config,
            url,
            method: 'GET',
        });
    }
    head(url, config) {
        return this.request({
            ...config,
            url,
            method: 'HEAD',
        });
    }
    connect(url, config) {
        return this.request({
            ...config,
            url,
            method: 'CONNECT',
        });
    }
    trace(url, config) {
        return this.request({
            ...config,
            url,
            method: 'TRACE',
        });
    }
    post(url, data, config) {
        return this.request({
            ...config,
            url,
            data,
            method: 'POST',
        });
    }
    put(url, data, config) {
        return this.request({
            ...config,
            url,
            data,
            method: 'PUT',
        });
    }
    delete(url, data, config) {
        return this.request({
            ...config,
            url,
            data,
            method: 'DELETE',
        });
    }
    options(url, data, config) {
        return this.request({
            ...config,
            url,
            data,
            method: 'OPTIONS',
        });
    }
    upload(url, config) {
        return this.request({
            ...config,
            url,
            method: 'UPLOAD',
        });
    }
    download(url, config) {
        return this.request({
            ...config,
            url,
            method: 'DOWNLOAD',
        });
    }
}
