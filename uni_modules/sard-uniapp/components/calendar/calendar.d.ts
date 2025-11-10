import { type CalendarProps } from './common';
declare const _default: import("vue").DefineComponent<CalendarProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:model-value": (value: string | string[] | Date | Date[]) => any;
    change: (value: string | string[] | Date | Date[]) => any;
}, string, import("vue").PublicProps, Readonly<CalendarProps> & Readonly<{
    "onUpdate:model-value"?: ((value: string | string[] | Date | Date[]) => any) | undefined;
    onChange?: ((value: string | string[] | Date | Date[]) => any) | undefined;
}>, {
    min: Date;
    max: Date;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: Date | Date[] | string | string[];
    type: import("./common").CalendarType;
    currentDate: Date;
    disabledDate: (date: Date) => boolean;
    maxDays: number;
    overMaxDays: () => void;
    weekStartsOn: number;
    formatter: (day: import("./common").CalendarDay) => void;
    allowSameDay: boolean;
    severalMonths: boolean;
    valueFormat: string;
    startDateText: string;
    endDateText: string;
    sameDateText: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
