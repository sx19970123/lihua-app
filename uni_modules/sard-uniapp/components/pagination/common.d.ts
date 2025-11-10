import { type StyleValue } from 'vue';
export interface PaginationProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    total?: number;
    pageSize?: number;
    current?: number;
    pageCount?: number;
    pageButtonCount?: number;
    hideOnSinglePage?: boolean;
    type?: 'simple' | 'multi';
    ellipsis?: boolean;
    multiCount?: number;
}
export declare const defaultPaginationProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        total: number;
        pageSize: number;
        current: number;
        pageCount: number;
        pageButtonCount: number;
        hideOnSinglePage: boolean;
        type: "simple" | "multi";
        ellipsis: boolean;
        multiCount: number;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        total: number;
        pageSize: number;
        current: number;
        pageCount: number;
        pageButtonCount: number;
        hideOnSinglePage: boolean;
        type: "simple" | "multi";
        ellipsis: boolean;
        multiCount: number;
    }) => string)) | undefined;
    total?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        total: number;
        pageSize: number;
        current: number;
        pageCount: number;
        pageButtonCount: number;
        hideOnSinglePage: boolean;
        type: "simple" | "multi";
        ellipsis: boolean;
        multiCount: number;
    }) => number)) | undefined;
    pageSize?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        total: number;
        pageSize: number;
        current: number;
        pageCount: number;
        pageButtonCount: number;
        hideOnSinglePage: boolean;
        type: "simple" | "multi";
        ellipsis: boolean;
        multiCount: number;
    }) => number)) | undefined;
    current?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        total: number;
        pageSize: number;
        current: number;
        pageCount: number;
        pageButtonCount: number;
        hideOnSinglePage: boolean;
        type: "simple" | "multi";
        ellipsis: boolean;
        multiCount: number;
    }) => number)) | undefined;
    pageCount?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        total: number;
        pageSize: number;
        current: number;
        pageCount: number;
        pageButtonCount: number;
        hideOnSinglePage: boolean;
        type: "simple" | "multi";
        ellipsis: boolean;
        multiCount: number;
    }) => number)) | undefined;
    pageButtonCount?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        total: number;
        pageSize: number;
        current: number;
        pageCount: number;
        pageButtonCount: number;
        hideOnSinglePage: boolean;
        type: "simple" | "multi";
        ellipsis: boolean;
        multiCount: number;
    }) => number)) | undefined;
    hideOnSinglePage?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        total: number;
        pageSize: number;
        current: number;
        pageCount: number;
        pageButtonCount: number;
        hideOnSinglePage: boolean;
        type: "simple" | "multi";
        ellipsis: boolean;
        multiCount: number;
    }) => boolean)) | undefined;
    type?: ("multi" | "simple" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        total: number;
        pageSize: number;
        current: number;
        pageCount: number;
        pageButtonCount: number;
        hideOnSinglePage: boolean;
        type: "simple" | "multi";
        ellipsis: boolean;
        multiCount: number;
    }) => "multi" | "simple")) | undefined;
    ellipsis?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        total: number;
        pageSize: number;
        current: number;
        pageCount: number;
        pageButtonCount: number;
        hideOnSinglePage: boolean;
        type: "simple" | "multi";
        ellipsis: boolean;
        multiCount: number;
    }) => boolean)) | undefined;
    multiCount?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        total: number;
        pageSize: number;
        current: number;
        pageCount: number;
        pageButtonCount: number;
        hideOnSinglePage: boolean;
        type: "simple" | "multi";
        ellipsis: boolean;
        multiCount: number;
    }) => number)) | undefined;
};
export interface PaginationSlots {
    prev?(props: Record<string, never>): any;
    next?(props: Record<string, never>): any;
}
export interface PaginationEmits {
    (e: 'update:current', page: number): void;
    (e: 'change', page: number): void;
}
/**
 * @description: 获取页面范围
 * @param {number} current 当前页码
 * @param {number} pageCount 总页数
 * @param {number} pageItemCount 要展示的页数
 * @return {[number, number]}
 */
export declare function getPageRange(current: number, pageCount: number, pageItemCount: number): number[];
