import { InjectionKey, type StyleValue } from 'vue';
export interface ListProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    title?: string | number;
    description?: string | number;
    inlaid?: boolean;
    card?: boolean;
    hideBorder?: boolean;
}
export interface ListSlots {
    default?(props: Record<string, never>): any;
    title?(props: Record<string, never>): any;
    description?(props: Record<string, never>): any;
}
export interface ListItemProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    title?: string | number;
    description?: string | number;
    value?: string | number;
    hover?: boolean;
    arrow?: boolean;
    arrowDirection?: 'up' | 'right' | 'down';
    icon?: string;
    iconSize?: string;
    iconColor?: string;
    iconFamily?: string;
}
export declare const defaultListItemProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        title: string | number;
        description: string | number;
        value: string | number;
        hover: boolean;
        arrow: boolean;
        arrowDirection: "up" | "right" | "down";
        icon: string;
        iconSize: string;
        iconColor: string;
        iconFamily: string;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        title: string | number;
        description: string | number;
        value: string | number;
        hover: boolean;
        arrow: boolean;
        arrowDirection: "up" | "right" | "down";
        icon: string;
        iconSize: string;
        iconColor: string;
        iconFamily: string;
    }) => string)) | undefined;
    title?: (string | number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        title: string | number;
        description: string | number;
        value: string | number;
        hover: boolean;
        arrow: boolean;
        arrowDirection: "up" | "right" | "down";
        icon: string;
        iconSize: string;
        iconColor: string;
        iconFamily: string;
    }) => string | number)) | undefined;
    description?: (string | number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        title: string | number;
        description: string | number;
        value: string | number;
        hover: boolean;
        arrow: boolean;
        arrowDirection: "up" | "right" | "down";
        icon: string;
        iconSize: string;
        iconColor: string;
        iconFamily: string;
    }) => string | number)) | undefined;
    value?: (string | number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        title: string | number;
        description: string | number;
        value: string | number;
        hover: boolean;
        arrow: boolean;
        arrowDirection: "up" | "right" | "down";
        icon: string;
        iconSize: string;
        iconColor: string;
        iconFamily: string;
    }) => string | number)) | undefined;
    hover?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        title: string | number;
        description: string | number;
        value: string | number;
        hover: boolean;
        arrow: boolean;
        arrowDirection: "up" | "right" | "down";
        icon: string;
        iconSize: string;
        iconColor: string;
        iconFamily: string;
    }) => boolean)) | undefined;
    arrow?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        title: string | number;
        description: string | number;
        value: string | number;
        hover: boolean;
        arrow: boolean;
        arrowDirection: "up" | "right" | "down";
        icon: string;
        iconSize: string;
        iconColor: string;
        iconFamily: string;
    }) => boolean)) | undefined;
    arrowDirection?: ("right" | "down" | "up" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        title: string | number;
        description: string | number;
        value: string | number;
        hover: boolean;
        arrow: boolean;
        arrowDirection: "up" | "right" | "down";
        icon: string;
        iconSize: string;
        iconColor: string;
        iconFamily: string;
    }) => "right" | "down" | "up")) | undefined;
    icon?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        title: string | number;
        description: string | number;
        value: string | number;
        hover: boolean;
        arrow: boolean;
        arrowDirection: "up" | "right" | "down";
        icon: string;
        iconSize: string;
        iconColor: string;
        iconFamily: string;
    }) => string)) | undefined;
    iconSize?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        title: string | number;
        description: string | number;
        value: string | number;
        hover: boolean;
        arrow: boolean;
        arrowDirection: "up" | "right" | "down";
        icon: string;
        iconSize: string;
        iconColor: string;
        iconFamily: string;
    }) => string)) | undefined;
    iconColor?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        title: string | number;
        description: string | number;
        value: string | number;
        hover: boolean;
        arrow: boolean;
        arrowDirection: "up" | "right" | "down";
        icon: string;
        iconSize: string;
        iconColor: string;
        iconFamily: string;
    }) => string)) | undefined;
    iconFamily?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        title: string | number;
        description: string | number;
        value: string | number;
        hover: boolean;
        arrow: boolean;
        arrowDirection: "up" | "right" | "down";
        icon: string;
        iconSize: string;
        iconColor: string;
        iconFamily: string;
    }) => string)) | undefined;
};
export interface ListItemEmits {
    (e: 'click', event: any): void;
}
export interface ListItemSlots {
    default?(props: Record<string, never>): any;
    title?(props: Record<string, never>): any;
    description?(props: Record<string, never>): any;
    value?(props: Record<string, never>): any;
    arrow?(props: Record<string, never>): any;
    icon?(props: Record<string, never>): any;
}
export interface ListContext {
    hideBorder?: boolean;
}
export declare const listContextKey: InjectionKey<ListContext>;
