import { type StyleValue } from 'vue';
import { type NodeRect } from '../../utils';
export interface TabOption {
    rootStyle?: StyleValue;
    rootClass?: string;
    title?: string;
    name?: string | number | boolean;
    disabled?: boolean;
}
export interface TabsProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    current?: string | number | boolean;
    list?: TabOption[];
    type?: 'line' | 'pill' | 'card';
    scrollable?: boolean;
}
export declare const defaultTabsProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        current: string | number | boolean;
        list: TabOption[];
        type: "line" | "pill" | "card";
        scrollable: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        current: string | number | boolean;
        list: TabOption[];
        type: "line" | "pill" | "card";
        scrollable: boolean;
    }) => string)) | undefined;
    current?: (string | number | boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        current: string | number | boolean;
        list: TabOption[];
        type: "line" | "pill" | "card";
        scrollable: boolean;
    }) => string | number | boolean)) | undefined;
    list?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        current: string | number | boolean;
        list: TabOption[];
        type: "line" | "pill" | "card";
        scrollable: boolean;
    }) => TabOption[]) | undefined;
    type?: ("line" | "card" | "pill" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        current: string | number | boolean;
        list: TabOption[];
        type: "line" | "pill" | "card";
        scrollable: boolean;
    }) => "line" | "card" | "pill")) | undefined;
    scrollable?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        current: string | number | boolean;
        list: TabOption[];
        type: "line" | "pill" | "card";
        scrollable: boolean;
    }) => boolean)) | undefined;
};
export interface TabsSlots {
    default?(props: Record<string, never>): any;
    line?(props: Record<string, never>): any;
}
export interface TabsEmits {
    (e: 'update:current', name: string | number | boolean): void;
    (e: 'change', name: string | number | boolean): void;
}
export interface TabProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    title?: string;
    name: string | number | boolean;
    disabled?: boolean;
}
export interface TabSlots {
    default?(props: Record<string, never>): any;
}
export interface TabEmits {
    (e: 'click', event: any): void;
}
export interface TabContext {
    current: any;
    select: (name: string | number | boolean, initial?: boolean) => void;
    register: (name: string | number | boolean, expose: {
        getRect: () => Promise<NodeRect>;
    }) => void;
    unregister: (name: string | number | boolean) => void;
}
export declare const tabContextSymbol: unique symbol;
