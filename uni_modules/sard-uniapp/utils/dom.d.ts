import { ComponentInternalInstance } from 'vue';
import { type NodeRect } from './geometry';
/**
 * uni boundingClientRect的 Promise 版本
 * @param selector 组件选择器
 * @param instance 父组件实例
 * @returns Promise<NodeRect>
 */
export declare function getBoundingClientRect(selector: string, instance?: ComponentInternalInstance | null): Promise<NodeRect>;
/**
 * 获取可使用窗口尺寸
 */
export declare function getWindowInfo(): UniNamespace.GetWindowInfoResult;
export interface ViewportScrollInfo {
    scrollLeft: number;
    scrollTop: number;
}
/**
 * 获取可使用窗口尺寸、滚动信息
 */
export declare function getViewportScrollInfo(): Promise<ViewportScrollInfo>;
export declare function toTouchEvent(event: MouseEvent | TouchEvent): TouchEvent;
export declare function getNode<T = any>(selector: string, instance: ComponentInternalInstance | null): Promise<T>;
