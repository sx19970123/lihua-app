/**
 * @description: 判断是否为纯对象
 * @param {any} target
 * @return {boolean}
 */
export declare function isPlainObject(target: any): target is Record<PropertyKey, any>;
/**
 * @description: 判断是否为空数组
 * @param {any} target
 * @return {boolean}
 */
export declare function isEmptyArray(target: any): target is [];
/**
 * @description: 判断是否为对象
 * @param {any} target
 * @return {boolean}
 */
export declare function isObject(target: any): target is object & {
    [key: PropertyKey]: any;
};
/**
 * @description: 判断是否为函数
 * @param {any} target
 * @return {boolean}
 */
export declare function isFunction(target: any): target is (...args: any[]) => any;
/**
 * @description: 判断是否为字符串
 * @param {any} target
 * @return {boolean}
 */
export declare function isString(target: any): target is string;
/**
 * @description: 判断是否为数值
 * @param {any} target
 * @return {boolean}
 */
export declare function isNumber(target: any): target is number;
/**
 * @description: 判断是否为布尔值
 * @param {any} target
 * @return {boolean}
 */
export declare function isBoolean(target: any): target is boolean;
/**
 * @description: 判断是否为undefined
 * @param {any} target
 * @return {boolean}
 */
export declare function isUndefined(target: any): target is undefined;
/**
 * @description: 判断是否为null或者undefined
 * @param {any} target
 * @return {boolean}
 */
export declare function isNullish(target: any): target is null | undefined;
/**
 * @description: 判断是否为原始类型
 * @param {any} target
 * @return {boolean}
 */
export declare function isPrimitive(target: any): target is string | number | boolean;
/**
 * @description: 判断是否为日期类型
 * @param {any} target
 * @return {boolean}
 */
export declare function isDate(target: any): target is Date;
