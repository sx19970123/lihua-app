import { type StyleValue } from 'vue';
export type SegmentedOption = {
    [key: PropertyKey]: any;
} | string | number | boolean;
export interface SegmentedOptionKeys {
    label?: string;
    value?: string;
    disabled?: string;
}
export declare const defaultOptionKeys: {
    label: string;
    value: string;
    disabled: string;
};
export type SegmentedSize = 'small' | 'middle' | 'large';
export interface SegmentedProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    modelValue?: any;
    disabled?: boolean;
    readonly?: boolean;
    size?: SegmentedSize;
    direction?: 'horizontal' | 'vertical';
    shape?: 'square' | 'round';
    options?: SegmentedOption[];
    optionKeys?: SegmentedOptionKeys;
    validateEvent?: boolean;
}
export declare const defaultSegmentedProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: SegmentedSize;
        direction: "horizontal" | "vertical";
        shape: "square" | "round";
        options: SegmentedOption[];
        optionKeys: SegmentedOptionKeys;
        validateEvent: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: SegmentedSize;
        direction: "horizontal" | "vertical";
        shape: "square" | "round";
        options: SegmentedOption[];
        optionKeys: SegmentedOptionKeys;
        validateEvent: boolean;
    }) => string)) | undefined;
    modelValue?: any;
    disabled?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: SegmentedSize;
        direction: "horizontal" | "vertical";
        shape: "square" | "round";
        options: SegmentedOption[];
        optionKeys: SegmentedOptionKeys;
        validateEvent: boolean;
    }) => boolean)) | undefined;
    readonly?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: SegmentedSize;
        direction: "horizontal" | "vertical";
        shape: "square" | "round";
        options: SegmentedOption[];
        optionKeys: SegmentedOptionKeys;
        validateEvent: boolean;
    }) => boolean)) | undefined;
    size?: (SegmentedSize | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: SegmentedSize;
        direction: "horizontal" | "vertical";
        shape: "square" | "round";
        options: SegmentedOption[];
        optionKeys: SegmentedOptionKeys;
        validateEvent: boolean;
    }) => "small" | "large" | "middle")) | undefined;
    direction?: ("horizontal" | "vertical" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: SegmentedSize;
        direction: "horizontal" | "vertical";
        shape: "square" | "round";
        options: SegmentedOption[];
        optionKeys: SegmentedOptionKeys;
        validateEvent: boolean;
    }) => "horizontal" | "vertical")) | undefined;
    shape?: ("square" | "round" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: SegmentedSize;
        direction: "horizontal" | "vertical";
        shape: "square" | "round";
        options: SegmentedOption[];
        optionKeys: SegmentedOptionKeys;
        validateEvent: boolean;
    }) => "square" | "round")) | undefined;
    options?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: SegmentedSize;
        direction: "horizontal" | "vertical";
        shape: "square" | "round";
        options: SegmentedOption[];
        optionKeys: SegmentedOptionKeys;
        validateEvent: boolean;
    }) => SegmentedOption[]) | undefined;
    optionKeys?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: SegmentedSize;
        direction: "horizontal" | "vertical";
        shape: "square" | "round";
        options: SegmentedOption[];
        optionKeys: SegmentedOptionKeys;
        validateEvent: boolean;
    }) => SegmentedOptionKeys) | undefined;
    validateEvent?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: SegmentedSize;
        direction: "horizontal" | "vertical";
        shape: "square" | "round";
        options: SegmentedOption[];
        optionKeys: SegmentedOptionKeys;
        validateEvent: boolean;
    }) => boolean)) | undefined;
};
export interface SegmentedSlots {
    default?(props: Record<string, never>): any;
}
export interface SegmentedEmits {
    (e: 'update:model-value', value: any): void;
    (e: 'change', value: any): void;
}
export interface SegmentedExpose {
}
export interface SegmentedContext {
    disabled: SegmentedProps['disabled'];
    readonly: SegmentedProps['readonly'];
    size: SegmentedProps['size'];
    shape: SegmentedProps['shape'];
    value: any;
    toggle: (value: any) => void;
}
export declare const segmentedContextSymbol: unique symbol;
