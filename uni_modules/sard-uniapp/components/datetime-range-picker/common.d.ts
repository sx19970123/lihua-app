import { type DatetimePickerSlots, type DatetimePickerProps } from '../datetime-picker/common';
export interface DatetimeRangePickerProps extends Omit<DatetimePickerProps, 'modelValue'> {
    modelValue?: (Date | string)[];
    tabs?: string[];
}
export declare const defaultDatetimeRangePickerProps: {
    modelValue?: ((props: {
        modelValue: (Date | string)[];
        tabs: string[];
        filter: (letter: import("../datetime-picker/common").DatetimeLetter, value: number, date: Date, index: number) => boolean;
        min: Date | string;
        max: Date | string;
        rootStyle: import("vue").StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        formatter: (letter: import("../datetime-picker/common").DatetimeLetter, option: import("../datetime-picker/common").DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => (string | Date)[]) | undefined;
    tabs?: ((props: {
        modelValue: (Date | string)[];
        tabs: string[];
        filter: (letter: import("../datetime-picker/common").DatetimeLetter, value: number, date: Date, index: number) => boolean;
        min: Date | string;
        max: Date | string;
        rootStyle: import("vue").StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        formatter: (letter: import("../datetime-picker/common").DatetimeLetter, option: import("../datetime-picker/common").DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => string[]) | undefined;
    filter?: (((letter: import("../datetime-picker/common").DatetimeLetter, value: number, date: Date, index: number) => boolean) | ((props: {
        modelValue: (Date | string)[];
        tabs: string[];
        filter: (letter: import("../datetime-picker/common").DatetimeLetter, value: number, date: Date, index: number) => boolean;
        min: Date | string;
        max: Date | string;
        rootStyle: import("vue").StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        formatter: (letter: import("../datetime-picker/common").DatetimeLetter, option: import("../datetime-picker/common").DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => (letter: import("../datetime-picker/common").DatetimeLetter, value: number, date: Date, index: number) => boolean)) | undefined;
    min?: (string | ((props: {
        modelValue: (Date | string)[];
        tabs: string[];
        filter: (letter: import("../datetime-picker/common").DatetimeLetter, value: number, date: Date, index: number) => boolean;
        min: Date | string;
        max: Date | string;
        rootStyle: import("vue").StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        formatter: (letter: import("../datetime-picker/common").DatetimeLetter, option: import("../datetime-picker/common").DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => string | Date)) | undefined;
    max?: (string | ((props: {
        modelValue: (Date | string)[];
        tabs: string[];
        filter: (letter: import("../datetime-picker/common").DatetimeLetter, value: number, date: Date, index: number) => boolean;
        min: Date | string;
        max: Date | string;
        rootStyle: import("vue").StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        formatter: (letter: import("../datetime-picker/common").DatetimeLetter, option: import("../datetime-picker/common").DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => string | Date)) | undefined;
    rootStyle?: (string | false | ((props: {
        modelValue: (Date | string)[];
        tabs: string[];
        filter: (letter: import("../datetime-picker/common").DatetimeLetter, value: number, date: Date, index: number) => boolean;
        min: Date | string;
        max: Date | string;
        rootStyle: import("vue").StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        formatter: (letter: import("../datetime-picker/common").DatetimeLetter, option: import("../datetime-picker/common").DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => string | false | import("vue").CSSProperties | import("vue").StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        modelValue: (Date | string)[];
        tabs: string[];
        filter: (letter: import("../datetime-picker/common").DatetimeLetter, value: number, date: Date, index: number) => boolean;
        min: Date | string;
        max: Date | string;
        rootStyle: import("vue").StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        formatter: (letter: import("../datetime-picker/common").DatetimeLetter, option: import("../datetime-picker/common").DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => string)) | undefined;
    type?: (string | ((props: {
        modelValue: (Date | string)[];
        tabs: string[];
        filter: (letter: import("../datetime-picker/common").DatetimeLetter, value: number, date: Date, index: number) => boolean;
        min: Date | string;
        max: Date | string;
        rootStyle: import("vue").StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        formatter: (letter: import("../datetime-picker/common").DatetimeLetter, option: import("../datetime-picker/common").DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => string)) | undefined;
    calendar?: ("solar" | "lunar" | ((props: {
        modelValue: (Date | string)[];
        tabs: string[];
        filter: (letter: import("../datetime-picker/common").DatetimeLetter, value: number, date: Date, index: number) => boolean;
        min: Date | string;
        max: Date | string;
        rootStyle: import("vue").StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        formatter: (letter: import("../datetime-picker/common").DatetimeLetter, option: import("../datetime-picker/common").DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => "solar" | "lunar")) | undefined;
    formatter?: (((letter: import("../datetime-picker/common").DatetimeLetter, option: import("../datetime-picker/common").DatetimeColumnOption, date: Date, index: number) => string | void | undefined) | ((props: {
        modelValue: (Date | string)[];
        tabs: string[];
        filter: (letter: import("../datetime-picker/common").DatetimeLetter, value: number, date: Date, index: number) => boolean;
        min: Date | string;
        max: Date | string;
        rootStyle: import("vue").StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        formatter: (letter: import("../datetime-picker/common").DatetimeLetter, option: import("../datetime-picker/common").DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => (letter: import("../datetime-picker/common").DatetimeLetter, option: import("../datetime-picker/common").DatetimeColumnOption, date: Date, index: number) => string | void | undefined)) | undefined;
    valueFormat?: (string | ((props: {
        modelValue: (Date | string)[];
        tabs: string[];
        filter: (letter: import("../datetime-picker/common").DatetimeLetter, value: number, date: Date, index: number) => boolean;
        min: Date | string;
        max: Date | string;
        rootStyle: import("vue").StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        formatter: (letter: import("../datetime-picker/common").DatetimeLetter, option: import("../datetime-picker/common").DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => string)) | undefined;
};
export interface DatetimeRangePickerSlots extends DatetimePickerSlots {
}
export interface DatetimeRangePickerEmits {
    (e: 'update:model-value', date: (Date | string)[]): void;
    (e: 'change', date: (Date | string)[]): void;
}
