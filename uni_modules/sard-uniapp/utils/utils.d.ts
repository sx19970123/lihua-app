/**
 * @description: 判断一个对象是否为看得到的空
 * @param {any} target
 * @return {boolean}
 */
export declare function isVisibleEmpty(target: any): boolean;
/**
 * @description: 判断一个值是否为空
 * @param {any} value
 * @return {boolean}
 */
export declare function isEmptyValue(value: any, whitespace?: boolean): boolean;
/**
 * @description: 判断一个值渲染到DOM中时是否可见
 * @param {any} value
 * @return {boolean}
 */
export declare function isRenderVisible(value: any): boolean;
/**
 * @description: 判断是否绑定为空值
 * @param {any} target
 * @return {boolean}
 */
export declare function isEmptyBinding(target: any): target is '' | null | undefined;
export interface DebounceOptions {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
}
export declare function debounce(func: (...args: any[]) => any, wait: any, options?: DebounceOptions): {
    (this: any, ...args: any[]): any;
    cancel: () => void;
    flush: () => any;
    pending: () => boolean;
};
export declare function throttle(func: (...args: any[]) => any, wait: any, options?: DebounceOptions): {
    (this: any, ...args: any[]): any;
    cancel: () => void;
    flush: () => any;
    pending: () => boolean;
};
/**
 * @description: 获取页面范围
 * @param {number} current 当前页码
 * @param {number} pageCount 总页数
 * @param {number} pageItemCount 要展示的页数
 * @return {[number, number]}
 */
export declare function getPageRange(current: number, pageCount: number, pageItemCount: number): number[];
/**
 * @description: 将一个可选单位的字符串或数值拆分为数值和单位组成的数组
 * @param {number | string} target
 * @return {[number, string]}
 */
export declare function splitUnit(target: number | string): [number, string];
export declare const noop: () => void;
export declare function getMayPrimitiveOption(option: string | number | boolean | {
    [key: PropertyKey]: any;
}, key: string): any;
export declare function sleep(time: number): Promise<void>;
