import { type DatetimePickerPopoutProps, type DatetimePickerPopoutSlots } from './common';
declare function __VLS_template(): Readonly<DatetimePickerPopoutSlots> & DatetimePickerPopoutSlots;
declare const __VLS_component: import("vue").DefineComponent<DatetimePickerPopoutProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<DatetimePickerPopoutProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    filter: (letter: import("../datetime-picker/common").DatetimeLetter, value: number, date: Date, index: number) => boolean;
    min: Date | string;
    max: Date | string;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: Date | string;
    type: string;
    title: string;
    visible: boolean;
    calendar: "solar" | "lunar";
    formatter: (letter: import("../datetime-picker/common").DatetimeLetter, option: import("../datetime-picker/common").DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
    valueFormat: string;
    validateEvent: boolean;
    popoutClass: string;
    popoutStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    resettable: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
