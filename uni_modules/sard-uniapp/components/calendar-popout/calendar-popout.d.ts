import { type CalendarPopoutProps } from './common';
declare function __VLS_template(): {
    "title-prepend"?(_: {}): any;
    title?(_: {}): any;
};
declare const __VLS_component: import("vue").DefineComponent<CalendarPopoutProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<CalendarPopoutProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    min: Date;
    max: Date;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: Date | Date[] | string | string[];
    type: import("../calendar/common.js").CalendarType;
    title: string;
    visible: boolean;
    currentDate: Date;
    disabledDate: (date: Date) => boolean;
    maxDays: number;
    overMaxDays: () => void;
    weekStartsOn: number;
    formatter: (day: import("../calendar/common.js").CalendarDay) => void;
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
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
