import { type StyleValue } from 'vue';
import { type TransitionHookEmits } from '../popup/common';
export interface NotifyProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    type?: 'primary' | 'success' | 'warning' | 'error';
    message?: string;
    color?: string;
    background?: string;
    visible?: boolean;
    position?: 'top' | 'bottom';
    timeout?: number;
    duration?: number;
    statusBar?: boolean;
}
export declare const defaultNotifyProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "primary" | "success" | "warning" | "error";
        message: string;
        color: string;
        background: string;
        visible: boolean;
        position: "top" | "bottom";
        timeout: number;
        duration: number;
        statusBar: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "primary" | "success" | "warning" | "error";
        message: string;
        color: string;
        background: string;
        visible: boolean;
        position: "top" | "bottom";
        timeout: number;
        duration: number;
        statusBar: boolean;
    }) => string)) | undefined;
    type?: ("success" | "error" | "primary" | "warning" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "primary" | "success" | "warning" | "error";
        message: string;
        color: string;
        background: string;
        visible: boolean;
        position: "top" | "bottom";
        timeout: number;
        duration: number;
        statusBar: boolean;
    }) => "success" | "error" | "primary" | "warning")) | undefined;
    message?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "primary" | "success" | "warning" | "error";
        message: string;
        color: string;
        background: string;
        visible: boolean;
        position: "top" | "bottom";
        timeout: number;
        duration: number;
        statusBar: boolean;
    }) => string)) | undefined;
    color?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "primary" | "success" | "warning" | "error";
        message: string;
        color: string;
        background: string;
        visible: boolean;
        position: "top" | "bottom";
        timeout: number;
        duration: number;
        statusBar: boolean;
    }) => string)) | undefined;
    background?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "primary" | "success" | "warning" | "error";
        message: string;
        color: string;
        background: string;
        visible: boolean;
        position: "top" | "bottom";
        timeout: number;
        duration: number;
        statusBar: boolean;
    }) => string)) | undefined;
    visible?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "primary" | "success" | "warning" | "error";
        message: string;
        color: string;
        background: string;
        visible: boolean;
        position: "top" | "bottom";
        timeout: number;
        duration: number;
        statusBar: boolean;
    }) => boolean)) | undefined;
    position?: ("bottom" | "top" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "primary" | "success" | "warning" | "error";
        message: string;
        color: string;
        background: string;
        visible: boolean;
        position: "top" | "bottom";
        timeout: number;
        duration: number;
        statusBar: boolean;
    }) => "bottom" | "top")) | undefined;
    timeout?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "primary" | "success" | "warning" | "error";
        message: string;
        color: string;
        background: string;
        visible: boolean;
        position: "top" | "bottom";
        timeout: number;
        duration: number;
        statusBar: boolean;
    }) => number)) | undefined;
    duration?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "primary" | "success" | "warning" | "error";
        message: string;
        color: string;
        background: string;
        visible: boolean;
        position: "top" | "bottom";
        timeout: number;
        duration: number;
        statusBar: boolean;
    }) => number)) | undefined;
    statusBar?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "primary" | "success" | "warning" | "error";
        message: string;
        color: string;
        background: string;
        visible: boolean;
        position: "top" | "bottom";
        timeout: number;
        duration: number;
        statusBar: boolean;
    }) => boolean)) | undefined;
};
export interface NotifySlots {
    default?(props: Record<string, never>): any;
}
export interface NotifyEmits extends TransitionHookEmits {
    (e: 'click', event: any): void;
    (e: 'update:visible', event: any): void;
}
export interface NotifyExpose {
    reHideLater: () => void;
    cancelHide: () => void;
}
