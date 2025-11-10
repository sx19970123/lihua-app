import { type StyleValue } from 'vue';
export interface IconProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    name?: string;
    family?: string;
    size?: string;
    color?: string;
    separate?: boolean;
}
export declare const defaultIconProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        name: string;
        family: string;
        size: string;
        color: string;
        separate: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        name: string;
        family: string;
        size: string;
        color: string;
        separate: boolean;
    }) => string)) | undefined;
    name?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        name: string;
        family: string;
        size: string;
        color: string;
        separate: boolean;
    }) => string)) | undefined;
    family?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        name: string;
        family: string;
        size: string;
        color: string;
        separate: boolean;
    }) => string)) | undefined;
    size?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        name: string;
        family: string;
        size: string;
        color: string;
        separate: boolean;
    }) => string)) | undefined;
    color?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        name: string;
        family: string;
        size: string;
        color: string;
        separate: boolean;
    }) => string)) | undefined;
    separate?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        name: string;
        family: string;
        size: string;
        color: string;
        separate: boolean;
    }) => boolean)) | undefined;
};
export interface IconEmits {
    (e: 'click', event: any): void;
}
