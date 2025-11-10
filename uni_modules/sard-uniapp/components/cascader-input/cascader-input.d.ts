import { type CascaderFieldKeys, type CascaderOption } from '../cascader/common';
import { type CascaderInputProps, type CascaderInputSlots } from './common';
declare function __VLS_template(): Readonly<CascaderInputSlots> & CascaderInputSlots;
declare const __VLS_component: import("vue").DefineComponent<CascaderInputProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: any;
} & {
    [x: string]: any;
}, string, import("vue").PublicProps, Readonly<CascaderInputProps> & Readonly<{
    [x: `on${Capitalize<any>}`]: ((...args: any) => any) | undefined;
}>, {
    options: CascaderOption[];
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: string | number | (string | number)[];
    title: string;
    visible: boolean;
    valueOnClear: () => any;
    loading: boolean;
    disabled: boolean;
    readonly: boolean;
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
    fieldKeys: CascaderFieldKeys;
    hintText: string;
    labelRender: (option: CascaderOption) => string;
    changeOnSelect: boolean;
    allLevels: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
