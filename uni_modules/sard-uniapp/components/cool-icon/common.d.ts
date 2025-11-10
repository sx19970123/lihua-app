import { type StyleValue } from 'vue';
export interface CoolIconProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    shape?: 'circle' | 'square' | 'oval' | 'triangle' | 'flower';
    size?: string;
    iconSize?: string;
    color?: string;
    background?: string;
}
export declare const defaultCoolIconProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        shape: "circle" | "square" | "oval" | "triangle" | "flower";
        size: string;
        iconSize: string;
        color: string;
        background: string;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        shape: "circle" | "square" | "oval" | "triangle" | "flower";
        size: string;
        iconSize: string;
        color: string;
        background: string;
    }) => string)) | undefined;
    shape?: ("circle" | "square" | "oval" | "triangle" | "flower" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        shape: "circle" | "square" | "oval" | "triangle" | "flower";
        size: string;
        iconSize: string;
        color: string;
        background: string;
    }) => "circle" | "square" | "oval" | "triangle" | "flower")) | undefined;
    size?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        shape: "circle" | "square" | "oval" | "triangle" | "flower";
        size: string;
        iconSize: string;
        color: string;
        background: string;
    }) => string)) | undefined;
    iconSize?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        shape: "circle" | "square" | "oval" | "triangle" | "flower";
        size: string;
        iconSize: string;
        color: string;
        background: string;
    }) => string)) | undefined;
    color?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        shape: "circle" | "square" | "oval" | "triangle" | "flower";
        size: string;
        iconSize: string;
        color: string;
        background: string;
    }) => string)) | undefined;
    background?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        shape: "circle" | "square" | "oval" | "triangle" | "flower";
        size: string;
        iconSize: string;
        color: string;
        background: string;
    }) => string)) | undefined;
};
export interface CoolIconSlots {
    default?(props: Record<string, never>): any;
}
export interface CoolIconEmits {
    (e: 'click', event: any): void;
}
export interface CoolIconExpose {
}
