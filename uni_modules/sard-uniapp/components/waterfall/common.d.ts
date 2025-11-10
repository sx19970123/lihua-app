import { InjectionKey, type StyleValue } from 'vue';
import { type WaterfallItemInfo } from '../waterfall-item/common';
export interface WaterfallProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    columns?: number;
    columnGap?: number;
    rowGap?: number;
}
export declare const defaultWaterfallProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        columns: number;
        columnGap: number;
        rowGap: number;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        columns: number;
        columnGap: number;
        rowGap: number;
    }) => string)) | undefined;
    columns?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        columns: number;
        columnGap: number;
        rowGap: number;
    }) => number)) | undefined;
    columnGap?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        columns: number;
        columnGap: number;
        rowGap: number;
    }) => number)) | undefined;
    rowGap?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        columns: number;
        columnGap: number;
        rowGap: number;
    }) => number)) | undefined;
};
export interface WaterfallSlots {
    default?(props: Record<string, never>): any;
}
export interface WaterfallEmits {
    (e: 'load'): void;
    (e: 'loadstart'): void;
}
export interface WaterfallExpose {
    reflow: () => void;
    onLoad: (handler: () => void) => void;
}
export interface WaterfallContext {
    columnWidth: number;
    addItem: (item: WaterfallItemInfo) => void;
    removeItem: (item: WaterfallItemInfo) => void;
    onItemLoad: () => void;
}
export declare const waterfallContextKey: InjectionKey<WaterfallContext>;
