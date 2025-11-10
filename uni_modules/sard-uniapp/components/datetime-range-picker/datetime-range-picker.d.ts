import { type DatetimeRangePickerProps, type DatetimeRangePickerSlots } from './common';
declare function __VLS_template(): Readonly<DatetimeRangePickerSlots> & DatetimeRangePickerSlots;
declare const __VLS_component: import("vue").DefineComponent<DatetimeRangePickerProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:model-value": (date: (string | Date)[]) => any;
    change: (date: (string | Date)[]) => any;
}, string, import("vue").PublicProps, Readonly<DatetimeRangePickerProps> & Readonly<{
    "onUpdate:model-value"?: ((date: (string | Date)[]) => any) | undefined;
    onChange?: ((date: (string | Date)[]) => any) | undefined;
}>, {
    filter: (letter: import("../datetime-picker/common").DatetimeLetter, value: number, date: Date, index: number) => boolean;
    min: Date | string;
    max: Date | string;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: (Date | string)[];
    type: string;
    calendar: "solar" | "lunar";
    tabs: string[];
    formatter: (letter: import("../datetime-picker/common").DatetimeLetter, option: import("../datetime-picker/common").DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
    valueFormat: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
