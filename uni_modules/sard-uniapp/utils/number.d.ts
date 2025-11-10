/**
 * 限定数值范围
 */
export declare function clamp(n: number, min: number, max: number): number;
/**
 * 把一个数四舍五入到指定位数小数。
 */
export declare function round(n: number, precision?: number): number;
/**
 * 获取小数位数
 */
export declare function getDecimalsLength(n: number | string): number;
/**
 * 把一个数舍入到指定数的倍数
 */
export declare function mround(n: number, m: number): number;
/**
 * 生成两数间的一个随机整数
 */
export declare function random(min: number, max: number): number;
/**
 * 判断一个数是否在指定范围内。
 */
export declare function inRange(n: number, min: number, max: number): boolean;
