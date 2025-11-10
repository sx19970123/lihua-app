import { type StyleValue } from 'vue';
export type QrcodeECL = 'L' | 'M' | 'Q' | 'H';
export interface QrcodeProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    text?: string;
    ecl?: QrcodeECL;
    type?: 'canvas' | 'image';
    size?: string;
    canvasSize?: number;
    color?: string;
    bgColor?: string;
    quietZoneModules?: number;
    showMenuByLongpress?: boolean;
    icon?: string;
}
export declare const defaultQrcodeProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        text: string;
        ecl: QrcodeECL;
        type: "canvas" | "image";
        size: string;
        canvasSize: number;
        color: string;
        bgColor: string;
        quietZoneModules: number;
        showMenuByLongpress: boolean;
        icon: string;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        text: string;
        ecl: QrcodeECL;
        type: "canvas" | "image";
        size: string;
        canvasSize: number;
        color: string;
        bgColor: string;
        quietZoneModules: number;
        showMenuByLongpress: boolean;
        icon: string;
    }) => string)) | undefined;
    text?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        text: string;
        ecl: QrcodeECL;
        type: "canvas" | "image";
        size: string;
        canvasSize: number;
        color: string;
        bgColor: string;
        quietZoneModules: number;
        showMenuByLongpress: boolean;
        icon: string;
    }) => string)) | undefined;
    ecl?: (QrcodeECL | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        text: string;
        ecl: QrcodeECL;
        type: "canvas" | "image";
        size: string;
        canvasSize: number;
        color: string;
        bgColor: string;
        quietZoneModules: number;
        showMenuByLongpress: boolean;
        icon: string;
    }) => "M" | "H" | "L" | "Q")) | undefined;
    type?: ("image" | "canvas" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        text: string;
        ecl: QrcodeECL;
        type: "canvas" | "image";
        size: string;
        canvasSize: number;
        color: string;
        bgColor: string;
        quietZoneModules: number;
        showMenuByLongpress: boolean;
        icon: string;
    }) => "image" | "canvas")) | undefined;
    size?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        text: string;
        ecl: QrcodeECL;
        type: "canvas" | "image";
        size: string;
        canvasSize: number;
        color: string;
        bgColor: string;
        quietZoneModules: number;
        showMenuByLongpress: boolean;
        icon: string;
    }) => string)) | undefined;
    canvasSize?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        text: string;
        ecl: QrcodeECL;
        type: "canvas" | "image";
        size: string;
        canvasSize: number;
        color: string;
        bgColor: string;
        quietZoneModules: number;
        showMenuByLongpress: boolean;
        icon: string;
    }) => number)) | undefined;
    color?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        text: string;
        ecl: QrcodeECL;
        type: "canvas" | "image";
        size: string;
        canvasSize: number;
        color: string;
        bgColor: string;
        quietZoneModules: number;
        showMenuByLongpress: boolean;
        icon: string;
    }) => string)) | undefined;
    bgColor?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        text: string;
        ecl: QrcodeECL;
        type: "canvas" | "image";
        size: string;
        canvasSize: number;
        color: string;
        bgColor: string;
        quietZoneModules: number;
        showMenuByLongpress: boolean;
        icon: string;
    }) => string)) | undefined;
    quietZoneModules?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        text: string;
        ecl: QrcodeECL;
        type: "canvas" | "image";
        size: string;
        canvasSize: number;
        color: string;
        bgColor: string;
        quietZoneModules: number;
        showMenuByLongpress: boolean;
        icon: string;
    }) => number)) | undefined;
    showMenuByLongpress?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        text: string;
        ecl: QrcodeECL;
        type: "canvas" | "image";
        size: string;
        canvasSize: number;
        color: string;
        bgColor: string;
        quietZoneModules: number;
        showMenuByLongpress: boolean;
        icon: string;
    }) => boolean)) | undefined;
    icon?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        text: string;
        ecl: QrcodeECL;
        type: "canvas" | "image";
        size: string;
        canvasSize: number;
        color: string;
        bgColor: string;
        quietZoneModules: number;
        showMenuByLongpress: boolean;
        icon: string;
    }) => string)) | undefined;
};
export interface QrcodeSlots {
    default?(props: Record<string, never>): any;
}
export interface QrcodeEmits {
    (e: 'success', tempFilePath: string): void;
}
