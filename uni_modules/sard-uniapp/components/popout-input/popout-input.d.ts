import { type PopoutInputProps } from './common';
declare function __VLS_template(): {
    prepend?(_: {}): any;
    append?(_: {}): any;
    arrow?(_: {}): any;
    default?(_: {}): any;
};
declare const __VLS_component: import("vue").DefineComponent<PopoutInputProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:model-value": (value: string) => any;
    click: (event: any) => any;
    change: (value: string) => any;
    clear: () => any;
}, string, import("vue").PublicProps, Readonly<PopoutInputProps> & Readonly<{
    "onUpdate:model-value"?: ((value: string) => any) | undefined;
    onClick?: ((event: any) => any) | undefined;
    onChange?: ((value: string) => any) | undefined;
    onClear?: (() => any) | undefined;
}>, {
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: any;
    loading: boolean;
    disabled: boolean;
    readonly: boolean;
    placeholder: string;
    clearable: boolean;
    multiline: boolean;
    arrow: string;
    arrowFamily: string;
    internalArrow: number;
    inputProps: import("../input").InputProps;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
