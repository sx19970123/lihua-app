import { type StyleValue } from 'vue';
export interface AvatarProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    shape?: 'circle' | 'square';
    size?: string;
    iconSize?: string;
    background?: string;
    color?: string;
    src?: string;
    index?: number;
}
export declare const defaultAvatarProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        shape: "circle" | "square";
        size: string;
        iconSize: string;
        background: string;
        color: string;
        src: string;
        index: number;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        shape: "circle" | "square";
        size: string;
        iconSize: string;
        background: string;
        color: string;
        src: string;
        index: number;
    }) => string)) | undefined;
    shape?: ("circle" | "square" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        shape: "circle" | "square";
        size: string;
        iconSize: string;
        background: string;
        color: string;
        src: string;
        index: number;
    }) => "circle" | "square")) | undefined;
    size?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        shape: "circle" | "square";
        size: string;
        iconSize: string;
        background: string;
        color: string;
        src: string;
        index: number;
    }) => string)) | undefined;
    iconSize?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        shape: "circle" | "square";
        size: string;
        iconSize: string;
        background: string;
        color: string;
        src: string;
        index: number;
    }) => string)) | undefined;
    background?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        shape: "circle" | "square";
        size: string;
        iconSize: string;
        background: string;
        color: string;
        src: string;
        index: number;
    }) => string)) | undefined;
    color?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        shape: "circle" | "square";
        size: string;
        iconSize: string;
        background: string;
        color: string;
        src: string;
        index: number;
    }) => string)) | undefined;
    src?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        shape: "circle" | "square";
        size: string;
        iconSize: string;
        background: string;
        color: string;
        src: string;
        index: number;
    }) => string)) | undefined;
    index?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        shape: "circle" | "square";
        size: string;
        iconSize: string;
        background: string;
        color: string;
        src: string;
        index: number;
    }) => number)) | undefined;
};
export interface AvatarSlots {
    default?(props: Record<string, never>): any;
    extra?(props: Record<string, never>): any;
}
export interface AvatarEmits {
    (e: 'click', event: any): void;
}
