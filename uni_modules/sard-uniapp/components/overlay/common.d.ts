import { type StyleValue } from 'vue';
export interface OverlayProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    visible?: boolean;
    zIndex?: number;
    duration?: number;
    background?: string;
    transparent?: boolean;
}
export declare const defaultOverlayProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        zIndex: number;
        duration: number;
        background: string;
        transparent: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        zIndex: number;
        duration: number;
        background: string;
        transparent: boolean;
    }) => string)) | undefined;
    visible?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        zIndex: number;
        duration: number;
        background: string;
        transparent: boolean;
    }) => boolean)) | undefined;
    zIndex?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        zIndex: number;
        duration: number;
        background: string;
        transparent: boolean;
    }) => number)) | undefined;
    duration?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        zIndex: number;
        duration: number;
        background: string;
        transparent: boolean;
    }) => number)) | undefined;
    background?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        zIndex: number;
        duration: number;
        background: string;
        transparent: boolean;
    }) => string)) | undefined;
    transparent?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        visible: boolean;
        zIndex: number;
        duration: number;
        background: string;
        transparent: boolean;
    }) => boolean)) | undefined;
};
export interface OverlaySlots {
    default?(props: Record<string, never>): any;
}
export interface OverlayEmits {
    (e: 'click', event: any): void;
}
