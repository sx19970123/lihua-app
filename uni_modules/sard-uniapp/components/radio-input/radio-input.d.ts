import { type RadioGroupOptionKeys } from '../radio/common';
import { type RadioInputProps, type RadioInputSlots } from './common';
declare function __VLS_template(): Readonly<RadioInputSlots> & RadioInputSlots;
declare const __VLS_component: import("vue").DefineComponent<RadioInputProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<RadioInputProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    size: string;
    options: import("../radio/common").RadioGroupOption[];
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: any;
    type: import("../radio/common").IconType;
    title: string;
    visible: boolean;
    valueOnClear: () => any;
    loading: boolean;
    direction: "horizontal" | "vertical";
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
    checkedColor: string;
    optionKeys: RadioGroupOptionKeys;
    searchable: boolean;
    filterPlaceholder: string;
    iconPosition: "left" | "right";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
