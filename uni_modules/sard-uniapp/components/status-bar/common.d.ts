import { type StyleValue } from 'vue';
export interface StatusBarProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    height?: string;
    reverse?: boolean;
}
export declare const defaultStatusBarProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        height: string;
        reverse: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        height: string;
        reverse: boolean;
    }) => string)) | undefined;
    height?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        height: string;
        reverse: boolean;
    }) => string)) | undefined;
    reverse?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        height: string;
        reverse: boolean;
    }) => boolean)) | undefined;
};
export interface StatusBarSlots {
    default?(props: Record<string, never>): any;
}
export interface StatusBarEmits {
}
export interface StatusBarExpose {
}
