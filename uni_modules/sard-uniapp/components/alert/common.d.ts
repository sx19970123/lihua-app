import { type StyleValue } from 'vue';
export interface AlertProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    showIcon?: boolean;
    closable?: boolean;
    type?: 'primary' | 'success' | 'warning' | 'danger';
    color?: string;
    background?: string;
}
export declare const defaultAlertProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        showIcon: boolean;
        closable: boolean;
        type: "primary" | "success" | "warning" | "danger";
        color: string;
        background: string;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        showIcon: boolean;
        closable: boolean;
        type: "primary" | "success" | "warning" | "danger";
        color: string;
        background: string;
    }) => string)) | undefined;
    showIcon?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        showIcon: boolean;
        closable: boolean;
        type: "primary" | "success" | "warning" | "danger";
        color: string;
        background: string;
    }) => boolean)) | undefined;
    closable?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        showIcon: boolean;
        closable: boolean;
        type: "primary" | "success" | "warning" | "danger";
        color: string;
        background: string;
    }) => boolean)) | undefined;
    type?: ("success" | "primary" | "warning" | "danger" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        showIcon: boolean;
        closable: boolean;
        type: "primary" | "success" | "warning" | "danger";
        color: string;
        background: string;
    }) => "success" | "primary" | "warning" | "danger")) | undefined;
    color?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        showIcon: boolean;
        closable: boolean;
        type: "primary" | "success" | "warning" | "danger";
        color: string;
        background: string;
    }) => string)) | undefined;
    background?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        showIcon: boolean;
        closable: boolean;
        type: "primary" | "success" | "warning" | "danger";
        color: string;
        background: string;
    }) => string)) | undefined;
};
export interface AlertSlots {
    default?(props: Record<string, never>): any;
    icon?(props: Record<string, never>): any;
}
export interface AlertEmits {
    (e: 'close'): void;
}
export declare const mapTypeIcon: {
    primary: string;
    success: string;
    warning: string;
    danger: string;
};
