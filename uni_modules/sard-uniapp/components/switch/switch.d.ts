import { type SwitchProps } from './common';
declare const _default: import("vue").DefineComponent<SwitchProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {} & {
    "update:model-value": (value: any) => any;
    click: (event: any) => any;
    change: (value: any) => any;
    "update:loading": (loading: boolean) => any;
}, string, import("vue").PublicProps, Readonly<SwitchProps> & Readonly<{
    "onUpdate:model-value"?: ((value: any) => any) | undefined;
    onClick?: ((event: any) => any) | undefined;
    onChange?: ((value: any) => any) | undefined;
    "onUpdate:loading"?: ((loading: boolean) => any) | undefined;
}>, {
    size: string;
    rootStyle: string | false | import("vue").CSSProperties | import("vue").StyleValue[] | null;
    rootClass: string;
    modelValue: any;
    loading: boolean;
    disabled: boolean;
    readonly: boolean;
    validateEvent: boolean;
    checkedColor: string;
    uncheckedColor: string;
    checkedValue: any;
    uncheckedValue: any;
    beforeUpdate: (value: any) => Promise<any>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
