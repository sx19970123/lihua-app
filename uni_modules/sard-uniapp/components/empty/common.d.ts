import { type StyleValue } from 'vue';
export interface EmptyProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    description?: string;
    icon?: string;
    iconFamily?: string;
    iconSize?: string;
}
export declare const defaultEmptyProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        description: string;
        icon: string;
        iconFamily: string;
        iconSize: string;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        description: string;
        icon: string;
        iconFamily: string;
        iconSize: string;
    }) => string)) | undefined;
    description?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        description: string;
        icon: string;
        iconFamily: string;
        iconSize: string;
    }) => string)) | undefined;
    icon?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        description: string;
        icon: string;
        iconFamily: string;
        iconSize: string;
    }) => string)) | undefined;
    iconFamily?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        description: string;
        icon: string;
        iconFamily: string;
        iconSize: string;
    }) => string)) | undefined;
    iconSize?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        description: string;
        icon: string;
        iconFamily: string;
        iconSize: string;
    }) => string)) | undefined;
};
export interface EmptySlots {
    default?(props: Record<string, never>): any;
    icon?(props: Record<string, never>): any;
    description?(props: Record<string, never>): any;
}
