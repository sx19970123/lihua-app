import { type StyleValue } from 'vue';
import { type TransitionHookEmits } from '../popup/common';
export interface ToastProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    type?: 'text' | 'loading' | 'success' | 'fail';
    title?: string | number;
    visible?: boolean;
    position?: 'top' | 'center' | 'bottom';
    overlay?: boolean;
    transparent?: boolean;
    timeout?: number;
    duration?: number;
}
export declare const defaultToastProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "text" | "loading" | "success" | "fail";
        title: string | number;
        visible: boolean;
        position: "top" | "center" | "bottom";
        overlay: boolean;
        transparent: boolean;
        timeout: number;
        duration: number;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "text" | "loading" | "success" | "fail";
        title: string | number;
        visible: boolean;
        position: "top" | "center" | "bottom";
        overlay: boolean;
        transparent: boolean;
        timeout: number;
        duration: number;
    }) => string)) | undefined;
    type?: ("text" | "success" | "fail" | "loading" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "text" | "loading" | "success" | "fail";
        title: string | number;
        visible: boolean;
        position: "top" | "center" | "bottom";
        overlay: boolean;
        transparent: boolean;
        timeout: number;
        duration: number;
    }) => "text" | "success" | "fail" | "loading")) | undefined;
    title?: (string | number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "text" | "loading" | "success" | "fail";
        title: string | number;
        visible: boolean;
        position: "top" | "center" | "bottom";
        overlay: boolean;
        transparent: boolean;
        timeout: number;
        duration: number;
    }) => string | number)) | undefined;
    visible?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "text" | "loading" | "success" | "fail";
        title: string | number;
        visible: boolean;
        position: "top" | "center" | "bottom";
        overlay: boolean;
        transparent: boolean;
        timeout: number;
        duration: number;
    }) => boolean)) | undefined;
    position?: ("center" | "bottom" | "top" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "text" | "loading" | "success" | "fail";
        title: string | number;
        visible: boolean;
        position: "top" | "center" | "bottom";
        overlay: boolean;
        transparent: boolean;
        timeout: number;
        duration: number;
    }) => "center" | "bottom" | "top")) | undefined;
    overlay?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "text" | "loading" | "success" | "fail";
        title: string | number;
        visible: boolean;
        position: "top" | "center" | "bottom";
        overlay: boolean;
        transparent: boolean;
        timeout: number;
        duration: number;
    }) => boolean)) | undefined;
    transparent?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "text" | "loading" | "success" | "fail";
        title: string | number;
        visible: boolean;
        position: "top" | "center" | "bottom";
        overlay: boolean;
        transparent: boolean;
        timeout: number;
        duration: number;
    }) => boolean)) | undefined;
    timeout?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "text" | "loading" | "success" | "fail";
        title: string | number;
        visible: boolean;
        position: "top" | "center" | "bottom";
        overlay: boolean;
        transparent: boolean;
        timeout: number;
        duration: number;
    }) => number)) | undefined;
    duration?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "text" | "loading" | "success" | "fail";
        title: string | number;
        visible: boolean;
        position: "top" | "center" | "bottom";
        overlay: boolean;
        transparent: boolean;
        timeout: number;
        duration: number;
    }) => number)) | undefined;
};
export interface ToastEmits extends TransitionHookEmits {
    (e: 'update:visible', visible: boolean): void;
}
export interface ToastExpose {
    reHideLater: () => void;
    cancelHide: () => void;
}
