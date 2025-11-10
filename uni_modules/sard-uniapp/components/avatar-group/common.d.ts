import { type StyleValue } from 'vue';
export interface AvatarGroupProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    max: number;
    total: number;
    coverage?: number;
    showRemain?: boolean;
    remainText?: string | number;
}
export declare const defaultAvatarGroupProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        max: number;
        total: number;
        coverage: number;
        showRemain: boolean;
        remainText: string | number;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        max: number;
        total: number;
        coverage: number;
        showRemain: boolean;
        remainText: string | number;
    }) => string)) | undefined;
    max?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        max: number;
        total: number;
        coverage: number;
        showRemain: boolean;
        remainText: string | number;
    }) => number)) | undefined;
    total?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        max: number;
        total: number;
        coverage: number;
        showRemain: boolean;
        remainText: string | number;
    }) => number)) | undefined;
    coverage?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        max: number;
        total: number;
        coverage: number;
        showRemain: boolean;
        remainText: string | number;
    }) => number)) | undefined;
    showRemain?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        max: number;
        total: number;
        coverage: number;
        showRemain: boolean;
        remainText: string | number;
    }) => boolean)) | undefined;
    remainText?: (string | number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        max: number;
        total: number;
        coverage: number;
        showRemain: boolean;
        remainText: string | number;
    }) => string | number)) | undefined;
};
export interface AvatarGroupSlots {
    default?(props: Record<string, never>): any;
}
export interface AvatarGroupEmits {
    (e: 'remain-click', event: any): void;
}
export interface AvatarGroupExpose {
}
export interface AvatarGroupContext {
    total: number;
    max: number;
    showRemain: boolean;
    remainText?: string | number;
    coverage: number;
    onRemainClick: (event: any) => void;
}
export declare const avatarGroupContextSymbol: unique symbol;
