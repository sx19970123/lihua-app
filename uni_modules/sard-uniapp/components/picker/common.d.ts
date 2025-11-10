import { type StyleValue } from 'vue';
export interface PickerOptionKeys {
    label?: string;
    value?: string;
    children?: string;
}
export interface PickerOptionObject {
    [key: PropertyKey]: any;
}
export type PickerOption = PickerOptionObject | string | number;
export interface PickerProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    columns?: PickerOption[] | PickerOption[][];
    optionKeys?: PickerOptionKeys;
    modelValue?: any;
    immediateChange?: boolean;
    internalCustom?: number;
}
export declare const defaultPickerProps: () => {
    columns: () => never[];
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        columns: PickerOption[] | PickerOption[][];
        optionKeys: PickerOptionKeys;
        modelValue: any;
        immediateChange: boolean;
        internalCustom: number;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        columns: PickerOption[] | PickerOption[][];
        optionKeys: PickerOptionKeys;
        modelValue: any;
        immediateChange: boolean;
        internalCustom: number;
    }) => string)) | undefined;
    optionKeys?: ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        columns: PickerOption[] | PickerOption[][];
        optionKeys: PickerOptionKeys;
        modelValue: any;
        immediateChange: boolean;
        internalCustom: number;
    }) => PickerOptionKeys) | undefined;
    modelValue?: any;
    immediateChange?: (boolean | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        columns: PickerOption[] | PickerOption[][];
        optionKeys: PickerOptionKeys;
        modelValue: any;
        immediateChange: boolean;
        internalCustom: number;
    }) => boolean)) | undefined;
    internalCustom?: (number | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        columns: PickerOption[] | PickerOption[][];
        optionKeys: PickerOptionKeys;
        modelValue: any;
        immediateChange: boolean;
        internalCustom: number;
    }) => number)) | undefined;
};
export interface PickerSlots {
    custom?(props: {
        columns: any[][];
        value: number[];
        pickerViewClass: string;
        maskClass: string;
        indicatorClass: string;
        onChange: (event: any) => void;
    }): any;
}
export interface PickerEmits {
    (e: 'update:model-value', value: any, selectedOptions: PickerOption[], indexes: number[]): void;
    (e: 'change', value: any, selectedOptions: PickerOption[], indexes: number[]): void;
}
export declare const defaultOptionKeys: {
    label: string;
    value: string;
    children: string;
};
export declare function getColumnsType(columns: PickerOption[] | PickerOption[][], optionKeys: Required<PickerOptionKeys>): "single" | "multi" | "cascader";
export declare function getValueOrLabelByOption(option: PickerOption, valueOrLabelKey: string): string | number;
export declare function getValuesByOptions(options: PickerOption[], valueKey: string): (string | number)[];
export declare function getOptionsByIndexes(indexes: number[], columns: PickerOption[] | PickerOption[][], optionKeys: Required<PickerOptionKeys>): PickerOption[];
export declare function getCascaderValidIndexes(indexes: number[], columns: PickerOption[] | PickerOption[][], optionKeys: Required<PickerOptionKeys>): number[];
export declare function getMaySingleValueByOptions(options: PickerOption[], optionKeys: Required<PickerOptionKeys>, columns: PickerOption[] | PickerOption[][]): string | number | (string | number)[];
export declare function getIndexesByValue(value: any[], columns: PickerOption[] | PickerOption[][], optionKeys: Required<PickerOptionKeys>): number[];
export declare function getInitialValue(columns: PickerOption[] | PickerOption[][], optionKeys: Required<PickerOptionKeys>): (string | number | (PickerOption | PickerOption[])[])[];
