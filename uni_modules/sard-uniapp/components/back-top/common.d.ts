import { type StyleValue } from 'vue';
export interface BackTopProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    scrollTop?: number;
    visibleHeight?: number;
    right?: string;
    bottom?: string;
}
export declare const defaultBackTopProps: () => {
    scrollTop: number;
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        scrollTop: number;
        visibleHeight: number;
        right: string;
        bottom: string;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        scrollTop: number;
        visibleHeight: number;
        right: string;
        bottom: string;
    }) => string)) | undefined;
    visibleHeight?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        scrollTop: number;
        visibleHeight: number;
        right: string;
        bottom: string;
    }) => number)) | undefined;
    right?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        scrollTop: number;
        visibleHeight: number;
        right: string;
        bottom: string;
    }) => string)) | undefined;
    bottom?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        scrollTop: number;
        visibleHeight: number;
        right: string;
        bottom: string;
    }) => string)) | undefined;
};
export interface BackTopSlots {
    default?(props: Record<string, never>): any;
}
export interface BackTopEmits {
    (e: 'click', event: any): void;
}
