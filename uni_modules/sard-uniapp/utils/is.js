/**
 * @description: 判断是否为纯对象
 * @param {any} target
 * @return {boolean}
 */
export function isPlainObject(target) {
    return Object.prototype.toString.call(target) === '[object Object]';
}
/**
 * @description: 判断是否为空数组
 * @param {any} target
 * @return {boolean}
 */
export function isEmptyArray(target) {
    return Array.isArray(target) && target.length === 0;
}
/**
 * @description: 判断是否为对象
 * @param {any} target
 * @return {boolean}
 */
export function isObject(target) {
    return target !== null && typeof target === 'object';
}
/**
 * @description: 判断是否为函数
 * @param {any} target
 * @return {boolean}
 */
export function isFunction(target) {
    return typeof target === 'function';
}
/**
 * @description: 判断是否为字符串
 * @param {any} target
 * @return {boolean}
 */
export function isString(target) {
    return typeof target === 'string';
}
/**
 * @description: 判断是否为数值
 * @param {any} target
 * @return {boolean}
 */
export function isNumber(target) {
    return typeof target === 'number';
}
/**
 * @description: 判断是否为布尔值
 * @param {any} target
 * @return {boolean}
 */
export function isBoolean(target) {
    return typeof target === 'boolean';
}
/**
 * @description: 判断是否为undefined
 * @param {any} target
 * @return {boolean}
 */
export function isUndefined(target) {
    return target === undefined;
}
/**
 * @description: 判断是否为null或者undefined
 * @param {any} target
 * @return {boolean}
 */
export function isNullish(target) {
    return target === null || target === undefined;
}
/**
 * @description: 判断是否为原始类型
 * @param {any} target
 * @return {boolean}
 */
export function isPrimitive(target) {
    return isString(target) || isNumber(target) || isBoolean(target);
}
/**
 * @description: 判断是否为日期类型
 * @param {any} target
 * @return {boolean}
 */
export function isDate(target) {
    return target instanceof Date;
}
