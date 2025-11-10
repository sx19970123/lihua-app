import { type PickerOption, type PickerOptionKeys } from '../picker/common';
import { type PickerInputProps, type PickerInputSlots } from './common';
declare function __VLS_template(): Readonly<PickerInputSlots> & PickerInputSlots;
declare const __VLS_component: import("vue").DefineComponent<PickerInputProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<PickerInputProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: any;
    title: string;
    visible: boolean;
    valueOnClear: () => any;
    loading: boolean;
    columns: PickerOption[] | PickerOption[][];
    disabled: boolean;
    readonly: boolean;
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
    optionKeys: PickerOptionKeys;
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
