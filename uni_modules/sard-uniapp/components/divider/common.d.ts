import { type StyleValue } from 'vue';
export interface DividerProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    type?: 'solid' | 'dashed' | 'dotted';
    hairline?: boolean;
    position?: 'left' | 'right' | 'center';
    vertical?: boolean;
}
export declare const defaultDividerProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "solid" | "dashed" | "dotted";
        hairline: boolean;
        position: "left" | "right" | "center";
        vertical: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "solid" | "dashed" | "dotted";
        hairline: boolean;
        position: "left" | "right" | "center";
        vertical: boolean;
    }) => string)) | undefined;
    type?: ("solid" | "dashed" | "dotted" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "solid" | "dashed" | "dotted";
        hairline: boolean;
        position: "left" | "right" | "center";
        vertical: boolean;
    }) => "solid" | "dashed" | "dotted")) | undefined;
    hairline?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "solid" | "dashed" | "dotted";
        hairline: boolean;
        position: "left" | "right" | "center";
        vertical: boolean;
    }) => boolean)) | undefined;
    position?: ("center" | "left" | "right" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "solid" | "dashed" | "dotted";
        hairline: boolean;
        position: "left" | "right" | "center";
        vertical: boolean;
    }) => "center" | "left" | "right")) | undefined;
    vertical?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: "solid" | "dashed" | "dotted";
        hairline: boolean;
        position: "left" | "right" | "center";
        vertical: boolean;
    }) => boolean)) | undefined;
};
export interface DividerSlots {
    default?(props: Record<string, never>): any;
}
export interface DividerEmits {
    (e: 'click', event: any): void;
}
export interface DividerExpose {
}
