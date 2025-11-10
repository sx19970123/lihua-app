import { type PickerPopoutProps, type PickerPopoutSlots } from './common';
declare function __VLS_template(): Readonly<PickerPopoutSlots> & PickerPopoutSlots;
declare const __VLS_component: import("vue").DefineComponent<PickerPopoutProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<PickerPopoutProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: any;
    title: string;
    visible: boolean;
    columns: import("../picker/common").PickerOption[] | import("../picker/common").PickerOption[][];
    validateEvent: boolean;
    popoutClass: string;
    popoutStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    resettable: boolean;
    optionKeys: import("../picker/common").PickerOptionKeys;
    immediateChange: boolean;
    internalCustom: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
