import { type CheckboxGroupOptionKeys } from '../checkbox/common';
import { type CheckboxInputProps, type CheckboxInputSlots } from './common';
declare function __VLS_template(): Readonly<CheckboxInputSlots> & CheckboxInputSlots;
declare const __VLS_component: import("vue").DefineComponent<CheckboxInputProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<CheckboxInputProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    size: string;
    options: import("../checkbox/common").CheckboxGroupOption[];
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: any[];
    type: import("../checkbox/common").IconType;
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
    optionKeys: CheckboxGroupOptionKeys;
    showCheckAll: boolean;
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
