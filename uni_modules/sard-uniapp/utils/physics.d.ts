/**
 * @description: 获取阻尼值
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @param {number} damping
 * @return {number}
 */
export declare function getDampingValue(value: number, min: number, max: number, damping: number): number;
/**
 * @description: 获取矩形阻尼值
 * @param {number} offset 当前的偏移量
 * @param {number} areaSize 范围值
 * @param {number} viewSize 范围内某个视图尺寸值
 * @param {number} damping 阻尼系数
 * @return {number}
 */
export declare function getRectDampingValue(offset: number, areaSize: number, viewSize: number, damping: number): number;
/**
 * @description: 获取范围值
 * @param {number} offset 当前的偏移量
 * @param {number} areaSize 范围值
 * @param {number} viewSize 范围内某个视图尺寸值
 * @return {number}
 */
export declare function getInBoundValue(offset: number, areaSize: number, viewSize: number): number;
/**
 * @description: 获取溢出值范围
 * @param {number} overflow 最大溢出值
 * @param {number} areaSize 范围值
 * @param {number} viewSize 范围内某个视图尺寸值
 * @return {*}
 */
export declare function getOverflowRangeInArea(overflow: number, areaSize: number, viewSize: number): [number, number];
