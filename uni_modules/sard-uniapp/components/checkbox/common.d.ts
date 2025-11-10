import { type StyleValue } from 'vue';
export type IconType = 'square' | 'circle';
export interface CheckboxProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    checked?: boolean;
    indeterminate?: boolean;
    value?: any;
    label?: string;
    disabled?: boolean;
    readonly?: boolean;
    size?: string;
    type?: IconType;
    checkedColor?: string;
    validateEvent?: boolean;
}
export declare const defaultCheckboxProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        checked: boolean;
        indeterminate: boolean;
        value: any;
        label: string;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        validateEvent: boolean;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        checked: boolean;
        indeterminate: boolean;
        value: any;
        label: string;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        validateEvent: boolean;
    }) => string)) | undefined;
    checked?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        checked: boolean;
        indeterminate: boolean;
        value: any;
        label: string;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        validateEvent: boolean;
    }) => boolean)) | undefined;
    indeterminate?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        checked: boolean;
        indeterminate: boolean;
        value: any;
        label: string;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        validateEvent: boolean;
    }) => boolean)) | undefined;
    value?: any;
    label?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        checked: boolean;
        indeterminate: boolean;
        value: any;
        label: string;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        validateEvent: boolean;
    }) => string)) | undefined;
    disabled?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        checked: boolean;
        indeterminate: boolean;
        value: any;
        label: string;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        validateEvent: boolean;
    }) => boolean)) | undefined;
    readonly?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        checked: boolean;
        indeterminate: boolean;
        value: any;
        label: string;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        validateEvent: boolean;
    }) => boolean)) | undefined;
    size?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        checked: boolean;
        indeterminate: boolean;
        value: any;
        label: string;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        validateEvent: boolean;
    }) => string)) | undefined;
    type?: (IconType | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        checked: boolean;
        indeterminate: boolean;
        value: any;
        label: string;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        validateEvent: boolean;
    }) => "circle" | "square")) | undefined;
    checkedColor?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        checked: boolean;
        indeterminate: boolean;
        value: any;
        label: string;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        validateEvent: boolean;
    }) => string)) | undefined;
    validateEvent?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        checked: boolean;
        indeterminate: boolean;
        value: any;
        label: string;
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        validateEvent: boolean;
    }) => boolean)) | undefined;
};
export interface CheckboxSlots {
    default?(props: Record<string, never>): any;
    icon?(props: {
        checked: boolean;
    }): any;
}
export interface CheckboxEmits {
    (e: 'click', event: any): void;
    (e: 'update:checked', checked: boolean): void;
    (e: 'change', checked: boolean): void;
}
export declare const defaultOptionKeys: {
    label: string;
    value: string;
    disabled: string;
};
export type CheckboxGroupOption = {
    [key: PropertyKey]: any;
} | string | number | boolean;
export interface CheckboxGroupOptionKeys {
    label?: string;
    value?: string;
}
export interface CheckboxGroupProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    modelValue?: any[];
    disabled?: boolean;
    readonly?: boolean;
    size?: string;
    type?: IconType;
    checkedColor?: string;
    direction?: 'horizontal' | 'vertical';
    validateEvent?: boolean;
    options?: CheckboxGroupOption[];
    optionKeys?: CheckboxGroupOptionKeys;
}
export declare const defaultCheckboxGroupProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any[];
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: CheckboxGroupOption[];
        optionKeys: CheckboxGroupOptionKeys;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any[];
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: CheckboxGroupOption[];
        optionKeys: CheckboxGroupOptionKeys;
    }) => string)) | undefined;
    modelValue?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any[];
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: CheckboxGroupOption[];
        optionKeys: CheckboxGroupOptionKeys;
    }) => any[]) | undefined;
    disabled?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any[];
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: CheckboxGroupOption[];
        optionKeys: CheckboxGroupOptionKeys;
    }) => boolean)) | undefined;
    readonly?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any[];
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: CheckboxGroupOption[];
        optionKeys: CheckboxGroupOptionKeys;
    }) => boolean)) | undefined;
    size?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any[];
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: CheckboxGroupOption[];
        optionKeys: CheckboxGroupOptionKeys;
    }) => string)) | undefined;
    type?: (IconType | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any[];
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: CheckboxGroupOption[];
        optionKeys: CheckboxGroupOptionKeys;
    }) => "circle" | "square")) | undefined;
    checkedColor?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any[];
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: CheckboxGroupOption[];
        optionKeys: CheckboxGroupOptionKeys;
    }) => string)) | undefined;
    direction?: ("horizontal" | "vertical" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any[];
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: CheckboxGroupOption[];
        optionKeys: CheckboxGroupOptionKeys;
    }) => "horizontal" | "vertical")) | undefined;
    validateEvent?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any[];
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: CheckboxGroupOption[];
        optionKeys: CheckboxGroupOptionKeys;
    }) => boolean)) | undefined;
    options?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any[];
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: CheckboxGroupOption[];
        optionKeys: CheckboxGroupOptionKeys;
    }) => CheckboxGroupOption[]) | undefined;
    optionKeys?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        modelValue: any[];
        disabled: boolean;
        readonly: boolean;
        size: string;
        type: IconType;
        checkedColor: string;
        direction: "horizontal" | "vertical";
        validateEvent: boolean;
        options: CheckboxGroupOption[];
        optionKeys: CheckboxGroupOptionKeys;
    }) => CheckboxGroupOptionKeys) | undefined;
};
export interface CheckboxGroupSlots {
    default?(props: Record<string, never>): any;
    custom?(props: {
        toggle: (value: any) => void;
        value: any[];
    }): any;
}
export interface CheckboxGroupEmits {
    (e: 'click', event: any): void;
    (e: 'update:model-value', value: any[]): void;
    (e: 'change', value: any[]): void;
}
export interface CheckboxContext {
    disabled: CheckboxGroupProps['disabled'];
    readonly: CheckboxGroupProps['readonly'];
    size: CheckboxGroupProps['size'];
    type: CheckboxGroupProps['type'];
    checkedColor: CheckboxGroupProps['checkedColor'];
    value: any[];
    toggle: (value: any) => void;
}
export declare const checkboxContextSymbol: unique symbol;
