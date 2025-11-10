/**
 * @description: 确保目标是一个数组
 * @param {any} target
 * @return {array}
 */
export declare function toArray<T>(target: T | T[]): T[];
/**
 * @description: 扩散性遍历
 * @param {any[]} array 要遍历的数组
 * @param {(el: any, spreadIndex: number, index: number) => any} callback 回调函数，接收当前元素、扩散性下标、迭代下标作为参数，
 *  如果返回true，则中止遍历
 * @param {number} currIndex 遍历开始的下标
 * @param {number} direction 开始遍历的方向
 * @return {number} 扩散性下标、或开始下标
 */
export declare function spreadEach(array: any[], callback: (el: any, spreadIndex: number, index: number) => any, startIndex?: number, direction?: number): number;
/**
 * 判断两数组是否相等，浅比较，元素个数和位置都要相等才为真。
 */
export declare function arrayEqual(arr1: any[], arr2: any[]): boolean;
/**
 * 打乱并返回数组，会修改原数组。
 */
export declare function shuffle<T>(array: T[]): T[];
/**
 * 移动数组中的元素，会返回移动后的新数组。
 */
export declare function arrayMove<T>(array: T[], fromIndex: number, toIndex: number): T[];
