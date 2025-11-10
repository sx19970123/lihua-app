import { type DatetimePickerProps, type DatetimePickerSlots, type DatetimeLetter, type DatetimeColumnOption } from './common';
declare function __VLS_template(): Readonly<DatetimePickerSlots> & DatetimePickerSlots;
declare const __VLS_component: import("vue").DefineComponent<DatetimePickerProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:model-value": (date: string | Date) => any;
    change: (date: string | Date) => any;
}, string, import("vue").PublicProps, Readonly<DatetimePickerProps> & Readonly<{
    "onUpdate:model-value"?: ((date: string | Date) => any) | undefined;
    onChange?: ((date: string | Date) => any) | undefined;
}>, {
    filter: (letter: DatetimeLetter, value: number, date: Date, index: number) => boolean;
    min: Date | string;
    max: Date | string;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: Date | string;
    type: string;
    calendar: "solar" | "lunar";
    formatter: (letter: DatetimeLetter, option: DatetimeColumnOption, date: Date, index: number) => string | void | undefined;
    valueFormat: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
