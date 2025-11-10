import { type StyleValue } from 'vue';
export interface TagProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    theme?: 'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
    plain?: boolean;
    round?: boolean;
    mark?: boolean | 'left' | 'right';
    size?: 'small' | 'medium' | 'large';
    color?: string;
    textColor?: string;
    closable?: boolean;
}
export declare const defaultTagProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        theme: "default" | "primary" | "secondary" | "success" | "info" | "warning" | "danger";
        plain: boolean;
        round: boolean;
        mark: boolean | "left" | "right";
        size: "small" | "medium" | "large";
        color: string;
        textColor: string;
        closable: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        theme: "default" | "primary" | "secondary" | "success" | "info" | "warning" | "danger";
        plain: boolean;
        round: boolean;
        mark: boolean | "left" | "right";
        size: "small" | "medium" | "large";
        color: string;
        textColor: string;
        closable: boolean;
    }) => string)) | undefined;
    theme?: ("success" | "default" | "primary" | "warning" | "danger" | "secondary" | "info" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        theme: "default" | "primary" | "secondary" | "success" | "info" | "warning" | "danger";
        plain: boolean;
        round: boolean;
        mark: boolean | "left" | "right";
        size: "small" | "medium" | "large";
        color: string;
        textColor: string;
        closable: boolean;
    }) => "success" | "default" | "primary" | "warning" | "danger" | "secondary" | "info")) | undefined;
    plain?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        theme: "default" | "primary" | "secondary" | "success" | "info" | "warning" | "danger";
        plain: boolean;
        round: boolean;
        mark: boolean | "left" | "right";
        size: "small" | "medium" | "large";
        color: string;
        textColor: string;
        closable: boolean;
    }) => boolean)) | undefined;
    round?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        theme: "default" | "primary" | "secondary" | "success" | "info" | "warning" | "danger";
        plain: boolean;
        round: boolean;
        mark: boolean | "left" | "right";
        size: "small" | "medium" | "large";
        color: string;
        textColor: string;
        closable: boolean;
    }) => boolean)) | undefined;
    mark?: (boolean | "left" | "right" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        theme: "default" | "primary" | "secondary" | "success" | "info" | "warning" | "danger";
        plain: boolean;
        round: boolean;
        mark: boolean | "left" | "right";
        size: "small" | "medium" | "large";
        color: string;
        textColor: string;
        closable: boolean;
    }) => boolean | "left" | "right")) | undefined;
    size?: ("small" | "medium" | "large" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        theme: "default" | "primary" | "secondary" | "success" | "info" | "warning" | "danger";
        plain: boolean;
        round: boolean;
        mark: boolean | "left" | "right";
        size: "small" | "medium" | "large";
        color: string;
        textColor: string;
        closable: boolean;
    }) => "small" | "medium" | "large")) | undefined;
    color?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        theme: "default" | "primary" | "secondary" | "success" | "info" | "warning" | "danger";
        plain: boolean;
        round: boolean;
        mark: boolean | "left" | "right";
        size: "small" | "medium" | "large";
        color: string;
        textColor: string;
        closable: boolean;
    }) => string)) | undefined;
    textColor?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        theme: "default" | "primary" | "secondary" | "success" | "info" | "warning" | "danger";
        plain: boolean;
        round: boolean;
        mark: boolean | "left" | "right";
        size: "small" | "medium" | "large";
        color: string;
        textColor: string;
        closable: boolean;
    }) => string)) | undefined;
    closable?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        theme: "default" | "primary" | "secondary" | "success" | "info" | "warning" | "danger";
        plain: boolean;
        round: boolean;
        mark: boolean | "left" | "right";
        size: "small" | "medium" | "large";
        color: string;
        textColor: string;
        closable: boolean;
    }) => boolean)) | undefined;
};
export interface TagSlots {
    default?(props: Record<string, never>): any;
}
export interface TagEmits {
    (e: 'click', event: any): void;
    (e: 'close', event: any): void;
}
