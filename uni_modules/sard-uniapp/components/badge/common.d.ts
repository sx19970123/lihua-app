import { type StyleValue } from 'vue';
export interface BadgeProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    value?: number | string;
    max?: number;
    showZero?: boolean;
    color?: string;
    textColor?: string;
    dot?: boolean;
    fixed?: boolean;
}
export declare const defaultBadgeProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        value: number | string;
        max: number;
        showZero: boolean;
        color: string;
        textColor: string;
        dot: boolean;
        fixed: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        value: number | string;
        max: number;
        showZero: boolean;
        color: string;
        textColor: string;
        dot: boolean;
        fixed: boolean;
    }) => string)) | undefined;
    value?: (string | number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        value: number | string;
        max: number;
        showZero: boolean;
        color: string;
        textColor: string;
        dot: boolean;
        fixed: boolean;
    }) => string | number)) | undefined;
    max?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        value: number | string;
        max: number;
        showZero: boolean;
        color: string;
        textColor: string;
        dot: boolean;
        fixed: boolean;
    }) => number)) | undefined;
    showZero?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        value: number | string;
        max: number;
        showZero: boolean;
        color: string;
        textColor: string;
        dot: boolean;
        fixed: boolean;
    }) => boolean)) | undefined;
    color?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        value: number | string;
        max: number;
        showZero: boolean;
        color: string;
        textColor: string;
        dot: boolean;
        fixed: boolean;
    }) => string)) | undefined;
    textColor?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        value: number | string;
        max: number;
        showZero: boolean;
        color: string;
        textColor: string;
        dot: boolean;
        fixed: boolean;
    }) => string)) | undefined;
    dot?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        value: number | string;
        max: number;
        showZero: boolean;
        color: string;
        textColor: string;
        dot: boolean;
        fixed: boolean;
    }) => boolean)) | undefined;
    fixed?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        value: number | string;
        max: number;
        showZero: boolean;
        color: string;
        textColor: string;
        dot: boolean;
        fixed: boolean;
    }) => boolean)) | undefined;
};
export interface BadgeSlots {
    default?(props: Record<string, never>): any;
    value?(props: Record<string, never>): any;
}
