import { type StyleValue } from 'vue';
export interface TabbarProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    current?: number | string;
    color?: string;
    activeColor?: string;
    bordered?: boolean;
    fixed?: boolean;
    safeAreaInsetBottom?: boolean;
}
export declare const defaultTabbarProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        current: number | string;
        color: string;
        activeColor: string;
        bordered: boolean;
        fixed: boolean;
        safeAreaInsetBottom: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        current: number | string;
        color: string;
        activeColor: string;
        bordered: boolean;
        fixed: boolean;
        safeAreaInsetBottom: boolean;
    }) => string)) | undefined;
    current?: (string | number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        current: number | string;
        color: string;
        activeColor: string;
        bordered: boolean;
        fixed: boolean;
        safeAreaInsetBottom: boolean;
    }) => string | number)) | undefined;
    color?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        current: number | string;
        color: string;
        activeColor: string;
        bordered: boolean;
        fixed: boolean;
        safeAreaInsetBottom: boolean;
    }) => string)) | undefined;
    activeColor?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        current: number | string;
        color: string;
        activeColor: string;
        bordered: boolean;
        fixed: boolean;
        safeAreaInsetBottom: boolean;
    }) => string)) | undefined;
    bordered?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        current: number | string;
        color: string;
        activeColor: string;
        bordered: boolean;
        fixed: boolean;
        safeAreaInsetBottom: boolean;
    }) => boolean)) | undefined;
    fixed?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        current: number | string;
        color: string;
        activeColor: string;
        bordered: boolean;
        fixed: boolean;
        safeAreaInsetBottom: boolean;
    }) => boolean)) | undefined;
    safeAreaInsetBottom?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        current: number | string;
        color: string;
        activeColor: string;
        bordered: boolean;
        fixed: boolean;
        safeAreaInsetBottom: boolean;
    }) => boolean)) | undefined;
};
export interface TabbarSlots {
    default?(props: Record<string, never>): any;
}
export interface TabbarEmits {
    (e: 'update:current', current: number | string): void;
    (e: 'change', current: number | string): void;
}
export interface TabbarItemProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    name?: string | number;
    icon?: string;
    iconFamily?: string;
    iconSize?: string;
    badge?: number | string;
    dot?: boolean;
    text?: string;
}
export interface TabbarItemSlots {
    default?(props: Record<string, never>): any;
    icon?(props: {
        active: boolean;
    }): any;
}
export interface TabbarItemEmits {
    (e: 'click', event: any): void;
}
export interface TabbarContext {
    color: TabbarProps['color'];
    activeColor: TabbarProps['activeColor'];
    current: any;
    select: (name: string | number) => void;
}
export declare const tabbarContextSymbol: unique symbol;
