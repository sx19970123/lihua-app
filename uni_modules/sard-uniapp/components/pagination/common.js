import { defaultConfig } from '../config';
export const defaultPaginationProps = defaultConfig.pagination;
/**
 * @description: 获取页面范围
 * @param {number} current 当前页码
 * @param {number} pageCount 总页数
 * @param {number} pageItemCount 要展示的页数
 * @return {[number, number]}
 */
export function getPageRange(current, pageCount, pageItemCount) {
    let min = current - Math.ceil((pageItemCount - 1) / 2);
    let max = current + Math.floor((pageItemCount - 1) / 2);
    const minLack = 1 - min;
    const maxLack = max - pageCount;
    if (maxLack > 0) {
        min -= maxLack;
    }
    if (min < 1) {
        min = 1;
    }
    if (minLack > 0) {
        max += minLack;
    }
    if (max > pageCount) {
        max = pageCount;
    }
    return [min, max];
}
