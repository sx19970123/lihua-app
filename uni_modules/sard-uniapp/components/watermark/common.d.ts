import { type StyleValue } from 'vue';
export interface WatermarkFont {
    color?: string;
    fontSize?: number;
    fontWeight?: string | number;
    fontFamily?: string;
    fontStyle?: 'none' | 'normal' | 'italic' | 'oblique' | (string & {});
    textAlign?: 'left' | 'right' | 'center' | (string & {});
}
export interface WatermarkProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    width?: number;
    height?: number;
    rotate?: number;
    zIndex?: number;
    image?: string;
    content?: string | string[];
    font?: WatermarkFont;
    gap?: [number, number];
    offset?: [number, number];
}
export declare const defaultWatermarkProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        width: number;
        height: number;
        rotate: number;
        zIndex: number;
        image: string;
        content: string | string[];
        font: WatermarkFont;
        gap: [number, number];
        offset: [number, number];
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        width: number;
        height: number;
        rotate: number;
        zIndex: number;
        image: string;
        content: string | string[];
        font: WatermarkFont;
        gap: [number, number];
        offset: [number, number];
    }) => string)) | undefined;
    width?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        width: number;
        height: number;
        rotate: number;
        zIndex: number;
        image: string;
        content: string | string[];
        font: WatermarkFont;
        gap: [number, number];
        offset: [number, number];
    }) => number)) | undefined;
    height?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        width: number;
        height: number;
        rotate: number;
        zIndex: number;
        image: string;
        content: string | string[];
        font: WatermarkFont;
        gap: [number, number];
        offset: [number, number];
    }) => number)) | undefined;
    rotate?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        width: number;
        height: number;
        rotate: number;
        zIndex: number;
        image: string;
        content: string | string[];
        font: WatermarkFont;
        gap: [number, number];
        offset: [number, number];
    }) => number)) | undefined;
    zIndex?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        width: number;
        height: number;
        rotate: number;
        zIndex: number;
        image: string;
        content: string | string[];
        font: WatermarkFont;
        gap: [number, number];
        offset: [number, number];
    }) => number)) | undefined;
    image?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        width: number;
        height: number;
        rotate: number;
        zIndex: number;
        image: string;
        content: string | string[];
        font: WatermarkFont;
        gap: [number, number];
        offset: [number, number];
    }) => string)) | undefined;
    content?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        width: number;
        height: number;
        rotate: number;
        zIndex: number;
        image: string;
        content: string | string[];
        font: WatermarkFont;
        gap: [number, number];
        offset: [number, number];
    }) => string | string[])) | undefined;
    font?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        width: number;
        height: number;
        rotate: number;
        zIndex: number;
        image: string;
        content: string | string[];
        font: WatermarkFont;
        gap: [number, number];
        offset: [number, number];
    }) => WatermarkFont) | undefined;
    gap?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        width: number;
        height: number;
        rotate: number;
        zIndex: number;
        image: string;
        content: string | string[];
        font: WatermarkFont;
        gap: [number, number];
        offset: [number, number];
    }) => [number, number]) | undefined;
    offset?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        width: number;
        height: number;
        rotate: number;
        zIndex: number;
        image: string;
        content: string | string[];
        font: WatermarkFont;
        gap: [number, number];
        offset: [number, number];
    }) => [number, number]) | undefined;
};
export declare const defaultWatermarkFont: Required<WatermarkFont>;
export interface WatermarkSlots {
    default?(props: Record<string, never>): any;
}
export interface WatermarkEmits {
}
export interface WatermarkExpose {
}
