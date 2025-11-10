import { type StyleValue } from 'vue';
export type IconType = 'circle' | 'record';
export interface RadioProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    checked?: boolean;
    value?: any;
    label?: string;
    disabled?: boolean;
    readonly?: boolean;
    size?: string;
    type?: IconType;
    checkedColor?: string;
}
export interface RadioSlots {
    default?(props: Record<string, never>): any;
    icon?(props: {
        checked: boolean;
    }): any;
}
export interface RadioEmits {
    (e: 'click', event: any): void;
}
export declare const defaultOptionKeys: {
    label: string;
    value: string;
    disabled: string;
};
export type RadioGroupOption = {
    [key: PropertyKey]: any;
} | string | number | boolean;
export interface RadioGroupOptionKeys {
    label?: string;
    value?: string;
}
export interface RadioGroupProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    modelValue?: any;
    disabled?: boolean;
    readonly?: boolean;
    size?: string;
    type?: IconType;
    checkedColor?: string;
    direction?: 'horizontal' | 'vertical';
    validateEvent?: boolean;
    options?: RadioGroupOption[];
    optionKeys?: RadioGroupOptionKeys;
}
export declare const defaultRadioGroupProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: RadioGroupOption[];
        optionKeys: RadioGroupOptionKeys;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: RadioGroupOption[];
        optionKeys: RadioGroupOptionKeys;
    }) => string)) | undefined;
    modelValue?: any;
    disabled?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: RadioGroupOption[];
        optionKeys: RadioGroupOptionKeys;
    }) => boolean)) | undefined;
    readonly?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: RadioGroupOption[];
        optionKeys: RadioGroupOptionKeys;
    }) => boolean)) | undefined;
    size?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: RadioGroupOption[];
        optionKeys: RadioGroupOptionKeys;
    }) => string)) | undefined;
    type?: (IconType | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: RadioGroupOption[];
        optionKeys: RadioGroupOptionKeys;
    }) => "circle" | "record")) | undefined;
    checkedColor?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: RadioGroupOption[];
        optionKeys: RadioGroupOptionKeys;
    }) => string)) | undefined;
    direction?: ("horizontal" | "vertical" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: RadioGroupOption[];
        optionKeys: RadioGroupOptionKeys;
    }) => "horizontal" | "vertical")) | undefined;
    validateEvent?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: RadioGroupOption[];
        optionKeys: RadioGroupOptionKeys;
    }) => boolean)) | undefined;
    options?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: RadioGroupOption[];
        optionKeys: RadioGroupOptionKeys;
    }) => RadioGroupOption[]) | undefined;
    optionKeys?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: RadioGroupOption[];
        optionKeys: RadioGroupOptionKeys;
    }) => RadioGroupOptionKeys) | undefined;
};
export interface RadioGroupSlots {
    default?(props: Record<string, never>): any;
    custom?(props: {
        toggle: (value: any) => void;
        value: any;
    }): any;
}
export interface RadioGroupEmits {
    (e: 'update:model-value', value: any): void;
    (e: 'change', value: any): void;
}
export interface RadioContext {
    disabled: RadioProps['disabled'];
    readonly: RadioProps['readonly'];
    size: RadioProps['size'];
    type: RadioProps['type'];
    checkedColor: RadioProps['checkedColor'];
    value: any;
    toggle: (value: any) => void;
}
export declare const radioContextSymbol: unique symbol;
