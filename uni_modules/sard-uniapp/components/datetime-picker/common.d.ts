import { type StyleValue } from 'vue';
import { type PickerSlots } from '../picker/common';
export interface DatetimePickerProps {
    rootStyle?: StyleValue;
    rootClass?: string;
    type?: string;
    calendar?: 'solar' | 'lunar';
    min?: Date | string;
    max?: Date | string;
    modelValue?: Date | string;
    filter?: (letter: DatetimeLetter, value: number, date: Date, index: number) => boolean;
    formatter?: (letter: DatetimeLetter, option: DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
    valueFormat?: string;
}
export declare const defaultDatetimePickerProps: {
    rootStyle?: (string | false | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        min: Date | string;
        max: Date | string;
        modelValue: Date | string;
        filter: (letter: DatetimeLetter, value: number, date: Date, index: number) => boolean;
        formatter: (letter: DatetimeLetter, option: DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => string | false | import("vue").CSSProperties | StyleValue[]) | null) | undefined;
    rootClass?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        min: Date | string;
        max: Date | string;
        modelValue: Date | string;
        filter: (letter: DatetimeLetter, value: number, date: Date, index: number) => boolean;
        formatter: (letter: DatetimeLetter, option: DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => string)) | undefined;
    type?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        min: Date | string;
        max: Date | string;
        modelValue: Date | string;
        filter: (letter: DatetimeLetter, value: number, date: Date, index: number) => boolean;
        formatter: (letter: DatetimeLetter, option: DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => string)) | undefined;
    calendar?: ("solar" | "lunar" | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        min: Date | string;
        max: Date | string;
        modelValue: Date | string;
        filter: (letter: DatetimeLetter, value: number, date: Date, index: number) => boolean;
        formatter: (letter: DatetimeLetter, option: DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => "solar" | "lunar")) | undefined;
    min?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        min: Date | string;
        max: Date | string;
        modelValue: Date | string;
        filter: (letter: DatetimeLetter, value: number, date: Date, index: number) => boolean;
        formatter: (letter: DatetimeLetter, option: DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => string | Date)) | undefined;
    max?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        min: Date | string;
        max: Date | string;
        modelValue: Date | string;
        filter: (letter: DatetimeLetter, value: number, date: Date, index: number) => boolean;
        formatter: (letter: DatetimeLetter, option: DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => string | Date)) | undefined;
    modelValue?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        min: Date | string;
        max: Date | string;
        modelValue: Date | string;
        filter: (letter: DatetimeLetter, value: number, date: Date, index: number) => boolean;
        formatter: (letter: DatetimeLetter, option: DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => string | Date)) | undefined;
    filter?: (((letter: DatetimeLetter, value: number, date: Date, index: number) => boolean) | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        min: Date | string;
        max: Date | string;
        modelValue: Date | string;
        filter: (letter: DatetimeLetter, value: number, date: Date, index: number) => boolean;
        formatter: (letter: DatetimeLetter, option: DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => (letter: DatetimeLetter, value: number, date: Date, index: number) => boolean)) | undefined;
    formatter?: (((letter: DatetimeLetter, option: DatetimeColumnOption, date: Date, index: number) => string | void | undefined) | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        min: Date | string;
        max: Date | string;
        modelValue: Date | string;
        filter: (letter: DatetimeLetter, value: number, date: Date, index: number) => boolean;
        formatter: (letter: DatetimeLetter, option: DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => (letter: DatetimeLetter, option: DatetimeColumnOption, date: Date, index: number) => string | void | undefined)) | undefined;
    valueFormat?: (string | ((props: {
        rootStyle: StyleValue;
        rootClass: string;
        type: string;
        calendar: "solar" | "lunar";
        min: Date | string;
        max: Date | string;
        modelValue: Date | string;
        filter: (letter: DatetimeLetter, value: number, date: Date, index: number) => boolean;
        formatter: (letter: DatetimeLetter, option: DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
        valueFormat: string;
    }) => string)) | undefined;
};
export interface DatetimePickerSlots extends PickerSlots {
}
export interface DatetimePickerEmits {
    (e: 'update:model-value', date: Date | string): void;
    (e: 'change', date: Date | string): void;
}
export interface DatetimeColumnOption {
    value: number;
    label?: string;
    zerofill?: string;
    [key: PropertyKey]: any;
}
export type DatetimeLetter = 'y' | 'M' | 'd' | 'h' | 'm' | 's';
export type DateEvery = [number, number, number, number, number, number];
export declare const getMinDate: () => Date;
export declare const getMaxDate: () => Date;
interface Strategies {
    [p: string]: [
        index: number,
        length: number,
        min: number | null,
        max: number | null,
        getter: (date: Date) => number,
        setter: (date: Date, value: number) => number
    ];
}
export declare const strategies: Strategies;
export declare const letterArray: DatetimeLetter[];
export declare function getBoundaryValue(calendar: 'solar' | 'lunar', isMax: boolean, endDate: Date, currentDate: Date): number[];
export declare function correctSolarDate(date: DateEvery, minDate: Date, maxDate: Date): void;
export declare function correctLunarDate(date: DateEvery, minDate: Date, maxDate: Date): void;
export declare function correctDate(calendar: 'solar' | 'lunar', date: DateEvery, minDate: Date, maxDate: Date): void;
export declare const getColumnData: (calendar: "solar" | "lunar", min: number, max: number, length: number, letter: DatetimeLetter, currentDate: Date, translate: (...args: any[]) => any, filter?: (letter: DatetimeLetter, value: number, date: Date, index: number) => boolean, formatter?: (letter: DatetimeLetter, option: DatetimeColumnOption, date: Date, index: number) => string | void | undefined) => DatetimeColumnOption[];
export declare function getInitialValue(minDate: Date, maxDate: Date): Date;
export declare const normalizeRangeValue: (minDate: Date, maxDate: Date, value?: (string | Date)[], valueFormat?: string) => (string | Date)[];
export {};
