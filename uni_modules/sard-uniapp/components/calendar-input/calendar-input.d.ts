import { type CalendarType } from '../calendar/common';
import { type CalendarInputProps, type CalendarInputSlots } from './common';
declare function __VLS_template(): Readonly<CalendarInputSlots> & CalendarInputSlots;
declare const __VLS_component: import("vue").DefineComponent<CalendarInputProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<CalendarInputProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    min: Date;
    max: Date;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: Date | Date[] | string | string[];
    type: CalendarType;
    title: string;
    visible: boolean;
    valueOnClear: () => any;
    disabled: boolean;
    readonly: boolean;
    currentDate: Date;
    disabledDate: (date: Date) => boolean;
    maxDays: number;
    overMaxDays: () => void;
    weekStartsOn: number;
    formatter: (day: import("../calendar/common").CalendarDay) => void;
    allowSameDay: boolean;
    severalMonths: boolean;
    valueFormat: string;
    startDateText: string;
    endDateText: string;
    sameDateText: string;
    showConfirm: boolean;
    validateEvent: boolean;
    popoutClass: string;
    popoutStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    resettable: boolean;
    placeholder: string;
    clearable: boolean;
    multiline: boolean;
    arrow: string;
    arrowFamily: string;
    internalArrow: number;
    inputProps: import("../input/common.js").InputProps;
    outletFormat: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
