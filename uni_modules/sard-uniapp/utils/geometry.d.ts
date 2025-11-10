export type ScrollIntoViewPosition = 'start' | 'center' | 'end' | 'nearest';
export interface ScrollIntoViewOptions {
    position?: ScrollIntoViewPosition;
    startOffset?: number;
    endOffset?: number;
    duration?: number;
}
/**
 * 根据最后位置计算 page 滚动到顶部的值。
 *
 * 也可计算水平方向的滚动值。
 *
 *                      page
 *                     ╱
 *    ╭───────────────╮    viewport
 *  ╭─│─ ─ ─ ─ ─ ─ ─ ─│─╮ ╱
 *  │ │ ╭───────────╮ │ │
 *  │ │ │  element  │ │ │
 *  │ │ ╰───────────╯ │ │
 *  ╰─│─ ─ ─ ─ ─ ─ ─ ─│─╯
 *    │               │
 *    │               │
 *    ╰───────────────╯
 *
 * @param {number} viewportHeight viewport 高度
 * @param {number} viewportScrollTop viewport 垂直滚动值
 * @param {number} elementHeight element 高度
 * @param {number} elementOffsetTop element 距离页面顶部距离
 * @param {string} options.position element 在 viewport 中的位置，可选：'start' | 'center' | 'end' | 'nearest'
 * @param {number} options.startOffset element 距离视窗顶部的偏移量
 * @param {number} options.endOffset element 距离视窗底部的偏移量
 * @return {number} viewport 新的垂直滚动值
 */
export declare function getScrollIntoViewValue(viewportHeight: number, viewportScrollTop: number, elementHeight: number, elementOffsetTop: number, options?: ScrollIntoViewOptions): number;
export interface NodeRect {
    top: number;
    right: number;
    bottom: number;
    left: number;
    height: number;
    width: number;
}
export interface MatchScrollVisibleOptions {
    offset?: number;
    errorValue?: number;
}
/**
 * 匹配元素列表中第一个位于滚动盒子可视区域的元素
 *
 * @param {array} rects NodeRect 类型数组
 * @param {function} callback 匹配成功时调用，会接收匹配的元素的下标
 * @param {number} options.offset 偏移量
 * @param {number} options.errorValue 容错值
 */
export declare function matchScrollVisible(rects: NodeRect[], callback: (index: number) => unknown, options?: MatchScrollVisibleOptions): Promise<unknown>;
/**
 * 保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
 */
export declare function getAspectFillSize(origWidth: number, origHeight: number, containerWidth: number, containerHeight: number): [number, number];
/**
 * 保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
 */
export declare function getAspectFitSize(origWidth: number, origHeight: number, containerWidth: number, containerHeight: number): [number, number];
export interface Point {
    x: number;
    y: number;
}
/**
 * 获取两点间的距离
 */
export declare function getTwoPointsDistance(p1: Point, p2: Point): number;
interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}
/**
 * @description: 根据原始坐标尺寸和缩放后的坐标尺寸算出转换的原点
 * @param {Rect} rect
 * @param {Rect} scaleRect
 * @return {[number, number]}
 */
export declare function getTransformOrigin(rect: Rect, scaleRect: Rect): [number, number];
/**
 * 获取一个矩形以中心点为原点旋转一定角度后的矩形
 */
export declare function getRotatedRect(width: number, height: number, rotate: number): {
    w1: number;
    w2: number;
    h1: number;
    h2: number;
    width: number;
    height: number;
};
export {};
