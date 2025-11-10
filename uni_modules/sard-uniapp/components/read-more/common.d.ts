import { type StyleValue } from 'vue';
export interface ReadMoreProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    maxHeight?: number;
    hideClose?: boolean;
    openText?: string;
    closeText?: string;
    visible?: boolean;
    keepLocation?: boolean;
}
export declare const defaultReadMoreProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        maxHeight: number;
        hideClose: boolean;
        openText: string;
        closeText: string;
        visible: boolean;
        keepLocation: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        maxHeight: number;
        hideClose: boolean;
        openText: string;
        closeText: string;
        visible: boolean;
        keepLocation: boolean;
    }) => string)) | undefined;
    maxHeight?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        maxHeight: number;
        hideClose: boolean;
        openText: string;
        closeText: string;
        visible: boolean;
        keepLocation: boolean;
    }) => number)) | undefined;
    hideClose?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        maxHeight: number;
        hideClose: boolean;
        openText: string;
        closeText: string;
        visible: boolean;
        keepLocation: boolean;
    }) => boolean)) | undefined;
    openText?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        maxHeight: number;
        hideClose: boolean;
        openText: string;
        closeText: string;
        visible: boolean;
        keepLocation: boolean;
    }) => string)) | undefined;
    closeText?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        maxHeight: number;
        hideClose: boolean;
        openText: string;
        closeText: string;
        visible: boolean;
        keepLocation: boolean;
    }) => string)) | undefined;
    visible?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        maxHeight: number;
        hideClose: boolean;
        openText: string;
        closeText: string;
        visible: boolean;
        keepLocation: boolean;
    }) => boolean)) | undefined;
    keepLocation?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        maxHeight: number;
        hideClose: boolean;
        openText: string;
        closeText: string;
        visible: boolean;
        keepLocation: boolean;
    }) => boolean)) | undefined;
};
export interface ReadMoreSlots {
    default?(props: Record<string, never>): any;
}
export interface ReadMoreEmits {
    (e: 'update:visible', visible: boolean): void;
    (e: 'open'): void;
    (e: 'close'): void;
}
export interface ReadMoreExpose {
}
