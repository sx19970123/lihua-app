import { type NodeRect } from '../../utils';
import { type StyleValue } from 'vue';
export interface ResizeSensorProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    initial?: boolean;
    threshold?: number;
}
export declare const defaultResizeSensorProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        initial: boolean;
        threshold: number;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        initial: boolean;
        threshold: number;
    }) => string)) | undefined;
    initial?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        initial: boolean;
        threshold: number;
    }) => boolean)) | undefined;
    threshold?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        initial: boolean;
        threshold: number;
    }) => number)) | undefined;
};
export interface ResizeSensorSlots {
    default?(props: Record<string, never>): any;
}
export interface ResizeSensorEmits {
    (e: 'resize', value: NodeRect): void;
}
export interface ResizeSensorExpose {
}
