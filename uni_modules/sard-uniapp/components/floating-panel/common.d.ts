import { type StyleValue } from 'vue';
export interface FloatingPanelProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    height?: number;
    anchors?: number[];
    duration?: number;
    contentDraggable?: boolean;
    safeAreaInsetBottom?: boolean;
}
export declare const defaultFloatingPanelProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        height: number;
        anchors: number[];
        duration: number;
        contentDraggable: boolean;
        safeAreaInsetBottom: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        height: number;
        anchors: number[];
        duration: number;
        contentDraggable: boolean;
        safeAreaInsetBottom: boolean;
    }) => string)) | undefined;
    height?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        height: number;
        anchors: number[];
        duration: number;
        contentDraggable: boolean;
        safeAreaInsetBottom: boolean;
    }) => number)) | undefined;
    anchors?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        height: number;
        anchors: number[];
        duration: number;
        contentDraggable: boolean;
        safeAreaInsetBottom: boolean;
    }) => number[]) | undefined;
    duration?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        height: number;
        anchors: number[];
        duration: number;
        contentDraggable: boolean;
        safeAreaInsetBottom: boolean;
    }) => number)) | undefined;
    contentDraggable?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        height: number;
        anchors: number[];
        duration: number;
        contentDraggable: boolean;
        safeAreaInsetBottom: boolean;
    }) => boolean)) | undefined;
    safeAreaInsetBottom?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        height: number;
        anchors: number[];
        duration: number;
        contentDraggable: boolean;
        safeAreaInsetBottom: boolean;
    }) => boolean)) | undefined;
};
export interface FloatingPanelSlots {
    default?(props: Record<string, never>): any;
}
export interface FloatingPanelEmits {
    (e: 'update:height', value: number): void;
    (e: 'height-change', value: number): void;
}
export interface FloatingPanelExpose {
}
